<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\defaultContentServiceProvider.
 */
 
namespace Drupal\defaultcontent;

class DefaultcontentServiceProvider extends \Drupal\Core\DependencyInjection\ServiceProviderBase {

  public function alter(\Drupal\Core\DependencyInjection\ContainerBuilder $container) {
    // Override the language_manager class with a new class.
    $definition = $container->getDefinition('rest.link_manager.type');
    $definition->setClass('Drupal\defaultcontent\LinkManager\TypeLinkManager');
  }
  
}
