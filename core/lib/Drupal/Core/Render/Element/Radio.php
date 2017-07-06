<?php

namespace Drupal\Core\Render\Element;

use Drupal\Core\Render\Element;

/**
 * Provides a form element for a single radio button.
 *
 * This is an internal element that is primarily used to render the radios form
 * element. Refer to \Drupal\Core\Render\Element\Radios for more documentation.
 *
 * @see \Drupal\Core\Render\Element\Radios
 * @see \Drupal\Core\Render\Element\Checkbox
 *
 * @FormElement("radio")
 */
class Radio extends FormElement {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $class = get_class($this);
    return [
      '#input' => TRUE,
      '#default_value' => NULL,
      '#process' => [
        [$class, 'processAjaxForm'],
      ],
      '#pre_render' => [
        [$class, 'preRenderRadio'],
      ],
      '#theme' => 'input__radio',
      '#theme_wrappers' => ['form_element'],
      '#title_display' => 'after',
    ];
  }

  /**
   * Prepares a #type 'radio' render element for input.html.twig.
   *
   * @param array $element
   *   An associative array containing the properties of the element.
   *   Properties used: #required, #return_value, #value, #attributes, #title,
   *   #description. The #name property will be sanitized before output. This is
   *   currently done by initializing Drupal\Core\Template\Attribute with all
   *   the attributes.
   *
   * @return array
   *   The $element with prepared variables ready for input.html.twig.
   */
  public static function preRenderRadio($element) {
    $element['#attributes']['type'] = 'radio';
    Element::setAttributes($element, ['id', 'name', '#return_value' => 'value']);

    if (isset($element['#return_value']) && $element['#value'] !== FALSE && $element['#value'] == $element['#return_value']) {
      $element['#attributes']['checked'] = 'checked';
    }
    static::setAttributes($element, ['form-radio']);

    return $element;
  }

}
