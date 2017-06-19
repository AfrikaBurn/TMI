<?php

namespace Drupal\openid_connect\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\openid_connect\Claims;
use Drupal\openid_connect\Plugin\OpenIDConnectClientManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class SettingsForm.
 *
 * @package Drupal\openid_connect\Form
 */
class SettingsForm extends ConfigFormBase implements ContainerInjectionInterface {

  /**
   * Drupal\openid_connect\Plugin\OpenIDConnectClientManager definition.
   *
   * @var \Drupal\openid_connect\Plugin\OpenIDConnectClientManager
   */
  protected $pluginManager;

  /**
   * The entity manager.
   *
   * @var \Drupal\Core\Entity\EntityManager
   */
  protected $entityFieldManager;

  /**
   * The OpenID Connect claims.
   *
   * @var \Drupal\openid_connect\Claims
   */
  protected $claims;

  /**
   * The constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\openid_connect\Plugin\OpenIDConnectClientManager $plugin_manager
   *   The plugin manager.
   * @param \Drupal\Core\Entity\EntityFieldManagerInterface $entity_field_manager
   *   The entity field manager.
   * @param \Drupal\openid_connect\Claims $claims
   *   The claims.
   */
  public function __construct(
      ConfigFactoryInterface $config_factory,
      OpenIDConnectClientManager $plugin_manager,
      EntityFieldManagerInterface $entity_field_manager,
      Claims $claims
  ) {
    parent::__construct($config_factory);
    $this->pluginManager = $plugin_manager;
    $this->entityFieldManager = $entity_field_manager;
    $this->claims = $claims;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('plugin.manager.openid_connect_client.processor'),
      $container->get('entity_field.manager'),
      $container->get('openid_connect.claims')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['openid_connect.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'openid_connect_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $settings = $this->configFactory()
      ->getEditable('openid_connect.settings');

    $options = array();
    foreach ($this->pluginManager->getDefinitions() as $client_plugin) {
      $options[$client_plugin['id']] = $client_plugin['label'];
    }

    $clients_enabled = array();
    foreach ($this->pluginManager->getDefinitions() as $client_plugin) {
      $enabled = $this->configFactory()
        ->getEditable('openid_connect.settings.' . $client_plugin['id'])
        ->get('enabled');
      $clients_enabled[$client_plugin['id']] = (bool) $enabled ? $client_plugin['id'] : 0;
    }

    $form['#tree'] = TRUE;
    $form['clients_enabled'] = array(
      '#title' => t('Enabled OpenID Connect clients'),
      '#description' => t('Choose enabled OpenID Connect clients.'),
      '#type' => 'checkboxes',
      '#options' => $options,
      '#default_value' => $clients_enabled,
    );
    foreach ($this->pluginManager->getDefinitions() as $client_name => $client_plugin) {
      $configuration = $this->configFactory()
        ->getEditable('openid_connect.settings.' . $client_name)
        ->get('settings');

      /* @var \Drupal\openid_connect\Plugin\OpenIDConnectClientInterface $client */
      $client = $this->pluginManager->createInstance(
        $client_name,
        $configuration
      );

      $element = 'clients_enabled[' . $client_plugin['id'] . ']';
      $form['clients'][$client_plugin['id']] = array(
        '#title' => $client_plugin['label'],
        '#type' => 'fieldset',
        '#tree' => TRUE,
        '#states' => array(
          'visible' => array(
            ':input[name="' . $element . '"]' => array('checked' => TRUE),
          ),
        ),
      );
      $form['clients'][$client_plugin['id']]['settings'] = array();
      $form['clients'][$client_plugin['id']]['settings'] += $client->buildConfigurationForm([], $form_state);
    }

    $form['always_save_userinfo'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Save user claims on every login'),
      '#description' => $this->t('If disabled, user claims will only be saved when the account is first created.'),
      '#default_value' => $settings->get('always_save_userinfo'),
    );

    $form['userinfo_mappings'] = array(
      '#title' => t('User claims mapping'),
      '#type' => 'fieldset',
    );

    $properties = $this->entityFieldManager->getFieldDefinitions('user', 'user');
    $properties_skip = _openid_connect_user_properties_to_skip();
    $claims = $this->claims->getOptions();
    $mappings = $settings->get('userinfo_mappings');
    foreach ($properties as $property_name => $property) {
      if (isset($properties_skip[$property_name])) {
        continue;
      }
      // Always map the timezone.
      $default_value = 0;
      if ($property_name == 'timezone') {
        $default_value = 'zoneinfo';
      }

      $form['userinfo_mappings'][$property_name] = array(
        '#type' => 'select',
        '#title' => $property->getLabel(),
        '#description' => $property->getDescription(),
        '#options' => (array) $claims,
        '#empty_value' => 0,
        '#empty_option' => t('- No mapping -'),
        '#default_value' => isset($mappings[$property_name]) ? $mappings[$property_name] : $default_value,
      );
    }

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('openid_connect.settings')
      ->set('always_save_userinfo', $form_state->getValue('always_save_userinfo'))
      ->set('userinfo_mappings', $form_state->getValue('userinfo_mappings'))
      ->save();
    $clients_enabled = $form_state->getValue('clients_enabled');
    foreach ($clients_enabled as $client_name => $status) {
      $this->configFactory()
        ->getEditable('openid_connect.settings.' . $client_name)
        ->set('enabled', $status)
        ->save();
      if ((bool) $status) {
        $this->configFactory()
          ->getEditable('openid_connect.settings.' . $client_name)
          ->set('settings', $form_state->getValue(array(
            'clients',
            $client_name,
            'settings',
          )))
          ->save();
      }
    }

  }

}
