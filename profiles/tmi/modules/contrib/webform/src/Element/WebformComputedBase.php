<?php

namespace Drupal\webform\Element;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element\FormElement;
use Drupal\webform\Entity\WebformSubmission;
use Drupal\webform\Utility\WebformHtmlHelper;
use Drupal\webform\WebformSubmissionForm;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Provides a base class for 'webform_computed' elements.
 */
abstract class WebformComputedBase extends FormElement {


  /**
   * Denotes HTML.
   *
   * @var string
   */
  const MODE_HTML = 'html';

  /**
   * Denotes plain text.
   *
   * @var string
   */
  const MODE_TEXT = 'text';

  /**
   * Denotes markup whose content type should be detected.
   *
   * @var string
   */
  const MODE_AUTO = 'auto';

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $class = get_class($this);
    return [
      '#process' => [
        [$class, 'processWebformComputed'],
      ],
      '#pre_render' => [
        [$class, 'preRenderWebformComputed'],
      ],
      '#input' => TRUE,
      '#value' => '',
      '#mode' => NULL,
      '#webform_submission' => NULL,
      '#theme_wrappers' => ['form_element'],
    ];
  }

  /**
   * Processes a Webform computed token element.
   *
   * @param array $element
   *   The element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   * @param array $complete_form
   *   The complete form structure.
   *
   * @return array
   *   The processed element.
   */
  public static function processWebformComputed(&$element, FormStateInterface $form_state, &$complete_form) {
    /** @var \Drupal\webform\WebformSubmissionForm $form_object */
    $form_object = $form_state->getFormObject();

    if (isset($element['#webform_submission'])) {
      if (is_string($element['#webform_submission'])) {
        $webform_submission = WebformSubmission::load($element['#webform_submission']);
      }
      else {
        /** @var \Drupal\webform\WebformSubmissionInterface $webform_submission */
        $webform_submission = $element['#webform_submission'];
      }
    }
    elseif ($form_object instanceof WebformSubmissionForm) {
      /** @var \Drupal\webform\WebformSubmissionInterface $webform_submission */
      $webform_submission = $form_object->getEntity();
    }
    else {
      return $element;
    }

    if ($webform_submission) {
      $element['#markup'] = static::processValue($element, $webform_submission);
    }

    return $element;
  }

  /**
   * Computes value before rendering.
   *
   * @param $element
   *   An associative array containing the properties and children of the
   *   details.
   *
   * @return
   *   The modified element.
   */
  public static function preRenderWebformComputed($element) {
    return $element;
  }

  /**
   * Process computed value.
   *
   * @param array $element
   *   The element.
   * @param \Drupal\webform\WebformSubmissionInterface $webform_submission
   *   A webform submission.
   *
   * @return array|string
   *   The string with tokens replaced.
   */
  public static function processValue(array $element, WebformSubmissionInterface $webform_submission) {
    return $element['#value'];
  }

  /**
   * Get an element's value mode/type.
   *
   * @param array $element
   *   The element.
   *
   * @return string
   *   The markup type (html or text).
   */
  public static function getMode(array $element) {
    if (empty($element['#mode']) || $element['#mode'] === static::MODE_AUTO) {
      return (WebformHtmlHelper::containsHtml($element['#value'])) ? static::MODE_HTML : static::MODE_TEXT;
    }
    else {
      return $element['#mode'];
    }
  }

}
