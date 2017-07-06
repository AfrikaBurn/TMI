<?php

namespace Drupal\cshs;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\Tags;
use Drupal\Component\Utility\Html;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;

/**
 * Defines a class for getting options for a cshs form element from vocabulary.
 */
trait CshsOptionsFromHelper {

  use TaxonomyStorages;

  /**
   * Defines the default settings for this plugin.
   *
   * @return array
   *   A list of default settings, keyed by the setting name.
   */
  public static function defaultSettings() {
    return [
      'parent' => 0,
      'level_labels' => '',
      'force_deepest' => FALSE,
    ];
  }

  /**
   * Returns the array of settings, including defaults for missing settings.
   *
   * @return array
   *   The array of settings.
   */
  abstract public function getSettings();

  /**
   * Returns the value of a setting, or its default value if absent.
   *
   * @param string $key
   *   The setting name.
   *
   * @return mixed
   *   The setting value.
   */
  abstract public function getSetting($key);

  /**
   * Returns the taxonomy vocabulary to work with.
   *
   * @return Vocabulary
   *   Taxonomy vocabulary object.
   */
  abstract public function getVocabulary();

  /**
   * Returns a short summary for the settings.
   *
   * @return array
   *   A short summary of the settings.
   */
  public function settingsSummary() {
    $settings = $this->getSettings();
    $summary = [];

    $summary[] = $this->t('Force deepest: @force_deepest', [
      '@force_deepest' => empty($settings['force_deepest']) ? $this->t('No') : $this->t('Yes'),
    ]);

    $summary[] = $this->t('Parent: @parent', [
      '@parent' => empty($settings['parent']) ? $this->t('None') : $this->getTranslationFromContext($this->getTermStorage()->load($settings['parent']))->label(),
    ]);

    $summary[] = $this->t('Level labels: @level_labels', [
      '@level_labels' => empty($settings['level_labels']) ? $this->t('None') : $this->getTranslatedLevelLabels(),
    ]);

    return $summary;
  }

  /**
   * Returns a form to configure settings.
   *
   * @param array $form
   *   The form where the settings form is being included in.
   * @param FormStateInterface $form_state
   *   The current state of the form.
   *
   * @return array
   *   The form definition for the settings.
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $vocabulary = $this->getVocabulary();
    $options = [];

    // Build options for parent select field.
    foreach ($this->getOptions($vocabulary->id()) as $key => $value) {
      $options[$key] = $value['name'];
    }

    $element['force_deepest'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Force selection of deepest level'),
      '#description' => $this->t('If checked the user will be forced to select terms from the deepest level.'),
      '#default_value' => $this->getSetting('force_deepest'),
    ];

    $element['parent'] = [
      '#type' => 'select',
      '#title' => $this->t('Parent'),
      '#description' => $this->t('Select a parent term to use only a subtree of a vocabulary for this field.'),
      '#options' => $options,
      '#default_value' => $this->getSetting('parent'),
    ];

    $element['level_labels'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Labels per hierarchy-level'),
      '#description' => $this->t('Enter labels for each hierarchy-level separated by comma.'),
      '#default_value' => $this->getTranslatedLevelLabels(),
    ];

    $form_state->set('vocabulary', $vocabulary);

    return $element;
  }

  /**
   * Returns the form for a single widget.
   *
   * @return array
   *   The form elements for a single widget.
   */
  public function formElement() {
    $vocabulary = $this->getVocabulary();
    $settings = $this->getSettings();

    return [
      '#type' => 'cshs',
      '#labels' => $this->getTranslatedLevelLabels(FALSE),
      '#parent' => $settings['parent'],
      '#options' => $this->getOptions($vocabulary->id(), $settings['parent'], CSHS_DEFAULT_NONE_VALUE),
      '#vocabulary' => $vocabulary,
      '#none_value' => CSHS_DEFAULT_NONE_VALUE,
      '#force_deepest' => $settings['force_deepest'],
      '#default_value' => CSHS_DEFAULT_NONE_VALUE,
    ];
  }

  /**
   * Collects the options.
   *
   * @param string $vocabulary_id
   *   Name of taxonomy vocabulary.
   * @param int $parent
   *   ID of a parent term.
   * @param int|string $none_value
   *   Value for the first option.
   *
   * @return array[]
   *   Widget options.
   */
  private function getOptions($vocabulary_id, $parent = 0, $none_value = 0) {
    $options = [
      $none_value => [
        // @codingStandardsIgnoreStart
        'name' => $this->t(CSHS_DEFAULT_NONE_LABEL),
        // @codingStandardsIgnoreEnd
        'parent_tid' => 0,
      ],
    ];

    /** @var Term $term */
    foreach ($this->getTermStorage()->loadTree($vocabulary_id, $parent, NULL, TRUE) as $term) {
      $parents = array_values($term->parents);

      $options[$term->id()] = [
        'name' => str_repeat('- ', $term->depth) . $this->getTranslationFromContext($term)->label(),
        'parent_tid' => (int) reset($parents),
      ];
    }

    return $options;
  }

  /**
   * Returns translated labels with escaped markup.
   *
   * @param bool $return_as_string
   *   Whether returning value have to be a string.
   *
   * @return string|string[]
   *   Translated labels, splitted by comma, or an array of them.
   */
  private function getTranslatedLevelLabels($return_as_string = TRUE) {
    $labels = $this->getSetting('level_labels');

    if (empty($labels)) {
      return $return_as_string ? '' : [];
    }

    $labels = Tags::explode($labels);

    foreach ($labels as $i => $label) {
      // @codingStandardsIgnoreStart
      $labels[$i] = $this->t(Html::escape($label));
      // @codingStandardsIgnoreEnd
    }

    return $return_as_string ? implode(', ', $labels) : $labels;
  }

}
