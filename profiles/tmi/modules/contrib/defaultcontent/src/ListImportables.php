<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\ListImportables.
 *
 * @todo There's not a lot of point to listing importables, given that they are
 *  all imported as the module is installed. nonetheless, this page could be
 * used to show importables whose dependencies were not met, especially because of language.
 *
 */

namespace Drupal\defaultcontent;

use Drupal\Core\Entity\EntityInterface;

/**
 * Converts a node to a config entity
 */
class ListImportables extends \Drupal\Core\Controller\ControllerBase {

  public function buildHeader() {
    $row = [
      'language' => $this->t('Language'),
      'module' => $this->t('Module'),
      'uuid' => $this->t('Uuid'),
      'type' => $this->t('Content type id'),
      'title' => $this->t('Title'),
    ];
    return $row;
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity, $module) {
    $row['language']['data'] = $entity->get('langcode');
    $row['language']['module'] = $module;
    $row['uuid']['data'] = $entity->getUuid();
    $row['type']['data'] = $entity->get('type');
    $row['title']['data'] = $entity->get('title');
    return $row;
  }

  public function render() {
    $build['table'] = array(
      '#type' => 'table',
      '#header' => $this->buildHeader(),
      '#title' => $this->t('All exported content'),
      '#rows' => array(),
      '#empty' => $this->t("There is no exported content in any modules 'content' directory."),
    );
    foreach (\Drupal::ModuleHandler()->getModuleList() as $module => $whatever) {
      $folder = drupal_get_path('module', $module).'/content';
      //
      drupal_set_message("This page doesn't work. Nor does the menu item pointing to it");
      foreach (\Drupal::service('defaultcontent.manager')->getFilesInOrder($folder) as $file) {
        print_r($file);

        //I'm abandoning it here because life is too short, and this module does what I need.

        $entity = \Drupal::service('defaultcontent.manager')->generateEntity($file, 'node');
        if ($row = $this->buildRow($entity)) {
          $build['table']['#rows'][$entity->id()] = $row;
        }
      }
    }
    return $build;
  }

}
