<?php

namespace Drupal\cshs\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the "Group by root" formatter.
 *
 * @FieldFormatter(
 *   id = "cshs_group_by_root",
 *   label = @Translation("Hierarchy grouped by root"),
 *   description = @Translation("Display the hierarchy of the taxonomy term grouped by root."),
 *   field_types = {
 *     "entity_reference",
 *   }
 * )
 */
class CshsGroupByRootFormatter extends CshsFormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $linked = $this->getSetting('linked');
    $reverse = $this->getSetting('reverse');
    $elements = [];

    foreach ($this->getEntitiesToView($items, $langcode) as $delta => $term) {
      $parents = $this->getTermParents($term);
      $parents = $reverse ? array_reverse($parents) : $parents;
      $root = array_shift($parents);
      $terms = [];

      foreach ($parents as $parent) {
        $terms[] = $linked ? $parent->link() : $this->getTranslationFromContext($parent)->label();
      }

      $elements[$root->id()] = [
        '#theme' => 'cshs_term_group',
        '#title' => $this->getTranslationFromContext($root)->label(),
        '#terms' => $terms,
      ];
    }

    return $elements;
  }

}
