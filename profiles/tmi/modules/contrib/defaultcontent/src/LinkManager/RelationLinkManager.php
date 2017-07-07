<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\LinkManager\RelationLinkManager.
 */

namespace Drupal\defaultcontent\LinkManager;

use Drupal\rest\LinkManager\RelationLinkManager as RestRelationLinkManager;

class RelationLinkManager extends RestRelationLinkManager {


  /**
   * {@inheritdoc}
   */
  public function getRelationUri($entity_type, $bundle, $field_name) {
    // Make the base path refer to drupal.org.x`
    return "http://drupal.org/rest/relation/$entity_type/$bundle/$field_name";
  }

  /**
   * {@inheritdoc}
   */
  protected function writeCache() {
    $data = array();

    foreach ($this->entityManager->getDefinitions() as $entity_type_id => $entity_type) {
      $reflection = new \ReflectionClass($entity_type->getClass());
      // We are only interested in importing content entities.
      if ($reflection->implementsInterface('\Drupal\Core\Config\Entity\ConfigEntityInterface') ||
        // @todo remove when Menu links are EntityNG.
         !$reflection->hasMethod('baseFieldDefinitions')) {
        continue;
      }
      foreach (array_keys($this->entityManager->getBundleInfo($entity_type_id)) as $bundle) {
        foreach ($this->entityManager->getFieldDefinitions($entity_type_id, $bundle) as $field_name => $field_details) {
          $relation_uri = $this->getRelationUri($entity_type_id, $bundle, $field_name);
          $data[$relation_uri] = array(
            'entity_type' => $entity_type_id,
            'bundle' => $bundle,
            'field_name' => $field_name,
          );
        }
      }
    }
  }

}
