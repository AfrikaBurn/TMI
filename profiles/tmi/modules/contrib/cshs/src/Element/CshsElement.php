<?php

namespace Drupal\cshs\Element;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element\Select;
use Drupal\views\Form\ViewsExposedForm;

/**
 * Provides a CSHS element.
 *
 * @FormElement("cshs")
 */
class CshsElement extends Select {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $info = parent::getInfo();

    $info['#label'] = '';
    $info['#labels'] = [];
    $info['#parent'] = 0;
    $info['#force_deepest'] = FALSE;
    $info['#none_value'] = CSHS_DEFAULT_NONE_VALUE;
    // @codingStandardsIgnoreStart
    $info['#none_label'] = $this->t(CSHS_DEFAULT_NONE_LABEL);
    // @codingStandardsIgnoreEnd
    // Standard properties.
    $info['#theme'] = 'cshs_select';
    $info['#process'][] = [static::class, 'processElement'];
    $info['#element_validate'][] = [static::class, 'validateElement'];

    return $info;
  }

  /**
   * {@inheritdoc}
   */
  public static function valueCallback(&$element, $input, FormStateInterface $form_state) {
    return FALSE !== $input && NULL !== $input ? $input : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public static function processElement(array $element) {
    $element['#attached']['library'][] = 'cshs/cshs.base';
    $element['#attached']['drupalSettings']['cshs'][$element['#id']] = [
      'labels' => $element['#labels'],
      'noneLabel' => $element['#none_label'],
      'noneValue' => $element['#none_value'],
    ];

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public static function validateElement(array &$element, FormStateInterface $form_state) {
    // The value is not selected.
    if (empty($element['#value']) || $element['#value'] == $element['#none_value']) {
      // Element must have its "none" value when nothing selected. This will
      // let it function correctly, for instance with views. Otherwise it could
      // lead to illegal choice selection error.
      // @link https://www.drupal.org/node/2882790
      $form_state->setValueForElement($element, is_a($form_state->getFormObject(), ViewsExposedForm::class) ? $element['#none_value'] : NULL);

      // Set an error if user doesn't select anything and field is required.
      if ($element['#required']) {
        $form_state->setError($element, t('@label field is required.', [
          '@label' => $element['#label'],
        ]));
      }
    }
    // Do we want to force the user to select terms from the deepest level?
    elseif ($element['#force_deepest']) {
      /* @var \Drupal\taxonomy\TermStorage $storage */
      $storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
      $term = $storage->load($element['#value']);

      // Set an error if term has children.
      if (!empty($storage->loadChildren($term->id(), $term->getVocabularyId()))) {
        $form_state->setError($element, t('You need to select a term from the deepest level in @label field.', [
          '@label' => $element['#label'],
        ]));
      }
    }
  }

}
