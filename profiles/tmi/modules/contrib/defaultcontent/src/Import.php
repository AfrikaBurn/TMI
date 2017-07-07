<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\Import.
 * @deprecated for now. All importing is done via hook_modules_installed
 */

namespace Drupal\defaultcontent;

use Drupal\defaultcontent\Entity\DefaultContent;
use Drupal\Core\Controller\ControllerBase;

/**
 * Converts a node to a config entity
 */
class Import extends ControllerBase {

  public function import($id) {
    $config_entity = DefaultContent::load($id);
    defaultcontent_import_one($config_entity);
    return $this->redirect('entity.default_node.collection');
  }


  public function import_all() {
    //@todo where do these come from?
    drupal_set_message('script is unclear which items to import!');
    return;
    defaultcontent_import_multiple();
    //this isn't the right route name for admin/content
    return $this->redirect('system.admin_content');
  }

}
