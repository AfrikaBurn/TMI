<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\DefaultContentManager.
 */

namespace Drupal\defaultcontent;


/**
 * An interface defining a default content importer.
 */
interface DefaultContentManagerInterface {
  /**
   * Set the scanner.
   *
   * @param \Drupal\defaultcontent\DefaultContentScanner $scanner
   *   The system scanner.
   */
  public function setScanner(DefaultContentScanner $scanner);

  /**
   * Imports default content for a given module.
   *
   * @param string $module
   *   The module to create the default content for.
   *
   * @return array[\Drupal\Core\Entity\EntityInterface]
   *   The created entities.
   */
  public function importContent($module);

  /**
   * Exports a single entity as importContent expects it.
   *
   * @param EntityInterface $entity
   *   The entity type ID.
   *
   * @return string
   *   The rendered export as hal.
   */
  public function exportContentWithMenuLinks($entity_type_id, $entity_id);

  /**
   * Exports a single entity and all its referenced entity.
   *
   * @param EntityInterface $entity
   *   The entity type ID.
   *
   * @return string[][]
   *   The serialized entities keyed by entity type and UUID.
   */
  public function exportContentWithReferences($entity_type_id, $entity_id);

}
