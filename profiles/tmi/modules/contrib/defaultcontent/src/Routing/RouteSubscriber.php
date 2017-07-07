<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\Routing\RouteSubscriber.
 */

namespace Drupal\defaultcontent\Routing;

use Drupal\Core\Entity\EntityManagerInterface;
use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/**
 * Subscriber for Devel routes.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $route = new Route(
      'node/{node}/convert',
      [
        '_controller' => '\Drupal\defaultcontent\Export::export',
        '_title_callback' => '\Drupal\defaultcontent\Export::title'
      ],
      [
        '_permission' => 'access devel information'
      ],
      [
        '_admin_route' => TRUE,
      ]
    );
    $collection->add("entity.node.convert", $route);
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events = parent::getSubscribedEvents();
    $events[RoutingEvents::ALTER] = 'onAlterRoutes';
    return $events;
  }

}
