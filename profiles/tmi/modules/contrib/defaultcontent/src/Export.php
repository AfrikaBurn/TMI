<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\Export.
 */

namespace Drupal\defaultcontent;

use Drupal\Core\Entity\EntityForm;
use Symfony\Component\HttpFoundation\Response;

/**
 * Converts a node to a config entity and shows it on screen
 * We use the EntityForm here because it is an easy way to get the node from the routing system
 */
class Export extends EntityForm {

  function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $entity = $form_state->getFormObject()->getEntity();

    $entities = \Drupal::service('defaultcontent.manager')
      ->exportContentWithReferences($entity->getEntityTypeId(), $entity->id());
    $content = $entities[$entity->getEntityTypeId()][$entity->uuid()];
    $headers = [
      'Content-Type' => 'application/octet-stream',
      'Content-Length' => strlen($content),
      'Content-Disposition' =>  'attachment; filename='.$entity->uuid().'.json'
    ];
    $response = new Response($content, 200, $headers);
    $response->send();
    exit;
  }


}
