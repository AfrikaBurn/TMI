<?php

namespace Drupal\cshs;

use Drupal\Core\Field\FieldDefinitionInterface;

/**
 * Class IsApplicable.
 */
trait IsApplicable {

  /**
   * {@inheritdoc}
   */
  public static function isApplicable(FieldDefinitionInterface $field_definition) {
    return 'taxonomy_term' === $field_definition->getFieldStorageDefinition()->getSetting('target_type');
  }

}
