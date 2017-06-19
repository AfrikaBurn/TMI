<?php

namespace Drupal\openid_connect\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\openid_connect\Claims;
use Drupal\openid_connect\Plugin\OpenIDConnectClientManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class LoginForm.
 *
 * @package Drupal\openid_connect\Form
 */
class LoginForm extends FormBase implements ContainerInjectionInterface {

  /**
   * Drupal\openid_connect\Plugin\OpenIDConnectClientManager definition.
   *
   * @var \Drupal\openid_connect\Plugin\OpenIDConnectClientManager
   */
  protected $pluginManager;

  /**
   * The OpenID Connect claims.
   *
   * @var \Drupal\openid_connect\Claims
   */
  protected $claims;

  /**
   * The constructor.
   *
   * @param \Drupal\openid_connect\Plugin\OpenIDConnectClientManager $plugin_manager
   *   The plugin manager.
   * @param \Drupal\openid_connect\Claims $claims
   *   The OpenID Connect claims.
   */
  public function __construct(
      OpenIDConnectClientManager $plugin_manager,
      Claims $claims
  ) {

    $this->pluginManager = $plugin_manager;
    $this->claims = $claims;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('plugin.manager.openid_connect_client.processor'),
      $container->get('openid_connect.claims')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'openid_connect_login_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $definitions = $this->pluginManager->getDefinitions();
    foreach ($definitions as $client_id => $client) {
      if (!$this->config('openid_connect.settings.' . $client_id)
        ->get('enabled')) {
        continue;
      }

      $form['openid_connect_client_' . $client_id . '_login'] = array(
        '#type' => 'submit',
        '#value' => t('Log in with @client_title', array(
          '@client_title' => $client['label'],
        )),
        '#name' => $client_id,
        '#prefix' => '<div>',
        '#suffix' => '</div>',
      );
    }
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    openid_connect_save_destination();
    $client_name = $form_state->getTriggeringElement()['#name'];

    $configuration = $this->config('openid_connect.settings.' . $client_name)
      ->get('settings');
    $client = $this->pluginManager->createInstance(
      $client_name,
      $configuration
    );
    $scopes = $this->claims->getScopes();
    $_SESSION['openid_connect_op'] = 'login';
    $response = $client->authorize($scopes, $form_state);
    $form_state->setResponse($response);
  }

}
