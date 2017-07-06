<?php

namespace Drupal\cshs\Plugin\views\filter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\cshs\CshsOptionsFromHelper;
use Drupal\views\ViewExecutable;
use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Common implementation for "CshsTaxonomyIndex" plugin.
 */
trait CshsTaxonomyIndex {

  use CshsOptionsFromHelper;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    EntityTypeManagerInterface $entity_type_manager,
    EntityRepositoryInterface $entity_repository
  ) {
    parent::__construct(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $entity_type_manager->getStorage('taxonomy_vocabulary'),
      $entity_type_manager->getStorage('taxonomy_term')
    );

    $this->entityRepository = $entity_repository;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('entity.repository')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    $options['value'] = isset($options['value']) ? (array) $options['value'] : [];

    parent::init($view, $display, $options);
  }

  /**
   * {@inheritdoc}
   */
  public function defineOptions() {
    $options = parent::defineOptions();

    foreach (static::defaultSettings() + ['type' => static::ID] as $option => $value) {
      $options[$option] = ['default' => $value];
    }

    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function buildExtraOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildExtraOptionsForm($form, $form_state);

    $form['type']['#options'] += [
      static::ID => $this->t('Client-side hierarchical select'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildExposeForm(&$form, FormStateInterface $form_state) {
    parent::buildExposeForm($form, $form_state);

    if (static::ID === $this->options['type']) {
      // Disable the "multiple" option in the exposed form settings.
      $form['expose']['multiple']['#access'] = FALSE;
      $form += $this->settingsForm($form, $form_state);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function valueForm(&$form, FormStateInterface $form_state) {
    parent::valueForm($form, $form_state);

    if (empty($this->getVocabulary()) && $this->options['limit']) {
      $form['markup'] = [
        '#type' => 'item',
        '#markup' => $this->t('An invalid vocabulary is selected. Please change it in the options.'),
      ];
    }
    elseif (static::ID === $this->options['type']) {
      $form['value'] = array_merge($form['value'], $this->formElement(), [
        '#multiple' => FALSE,
        '#default_value' => (array) $form['value']['#default_value'],
      ]);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getSettings() {
    return $this->options;
  }

  /**
   * {@inheritdoc}
   */
  public function getSetting($key) {
    return isset($this->options[$key]) ? $this->options[$key] : NULL;
  }

  /**
   * {@inheritdoc}
   */
  protected function getVocabularyStorage() {
    return $this->vocabularyStorage;
  }

  /**
   * {@inheritdoc}
   */
  protected function getTermStorage() {
    return $this->termStorage;
  }

  /**
   * {@inheritdoc}
   */
  public function getVocabulary() {
    return $this->vocabularyStorage->load($this->options['vid']);
  }

}
