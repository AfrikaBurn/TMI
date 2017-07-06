<?php

namespace Drupal\cshs\Plugin\Field\FieldWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\cshs\IsApplicable;
use Drupal\cshs\CshsOptionsFromHelper;

/**
 * Provides "cshs" field widget.
 *
 * @FieldWidget(
 *   id = "cshs",
 *   label = @Translation("Client-side hierarchical select"),
 *   field_types = {
 *     "entity_reference",
 *   },
 * )
 */
class CshsWidget extends WidgetBase {

  use IsApplicable;
  use CshsOptionsFromHelper {
    defaultSettings as helperDefaultSettings;
    settingsSummary as helperSettingsSummary;
    settingsForm as helperSettingsForm;
    formElement as helperFormElement;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return static::helperDefaultSettings() + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    return $this->helperSettingsSummary();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    return $this->helperSettingsForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element['target_id'] = array_merge($element, $this->helperFormElement(), [
      '#label' => $this->fieldDefinition->getLabel(),
      '#default_value' => $items->get($delta)->getValue(),
    ]);

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function getVocabulary() {
    $settings = $this->getFieldSettings();

    if (empty($settings['handler_settings']['target_bundles'])) {
      return NULL;
    }

    return $this->getVocabularyStorage()->load(reset($settings['handler_settings']['target_bundles']));
  }

}
