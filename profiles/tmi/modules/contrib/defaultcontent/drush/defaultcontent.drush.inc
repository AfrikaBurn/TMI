<?php

/**
 * @file
 * Drush integration for the defaultcontent module.
 */

/**
 * Implements hook_drush_command().
 */
function defaultcontent_drush_command() {
  $items['defaultcontent-export'] = [
    'description' => dt('Exports a single entity'),
    'arguments' => [
      'entity_type' => dt('The entity type to export.'),
      'entity_id' => dt('The ID of the entity to export.'),
      'module' => dt('The module or profile to hold this content.'),
    ],
    //I'm not sure how the options syntax works. 'ref' is intended as a flag
    'options' => [
      'ref' => dt('Include content entities from entity_reference fields, including the node owner')
    ],
    'aliases' => ['dce'],
    'required-arguments' => 2,
  ];

  return $items;
}

/**
 * Exports a piece of content into a odule's content/ directory.
 *
 * @param string $entity_type_id
 *   The entity type ID.
 * @param $entity_id
 *   The entity ID to export.
 */
function drush_defaultcontent_export($entity_type_id, $entity_id, $module) {
  $manager = \Drupal::service('defaultcontent.manager');
  
  if (drush_get_option('ref')) {
    $entities = $manager->exportContentWithReferences($entity_type_id, $entity_id);
  }
  else {
    $entities = $manager->exportContentWithMenuLinks($entity_type_id, $entity_id);
  }
  
  $dir = drupal_get_path('module', $module).'/content';
  foreach ($entities as $entity_type_id => $serialized_entities) {
    //store contentEntities in json oand configEntities in yml
    //@todo how do we determine, from the entity_type_id, if it is a contentEntity?
    $ext = $entity_type_id == 'node' ? 'json' : 'yml';
    // Ensure that the folder per entity type exists.
    $entity_type_dir = "$dir/$entity_type_id";
    if (file_prepare_directory($entity_type_dir, FILE_CREATE_DIRECTORY)) {
      foreach ($serialized_entities as $entity_id => $serialized_entity) {
        $filename = $entity_type_dir . '/' . $entity_id . '.'.$ext;
        file_put_contents($filename, $serialized_entity);    
        print dt('Written file @file', ['@file' => $filename]) ."\n";
      }
    }
    else {
      print dt('Could not write file')."\n";
    }
  }
}
