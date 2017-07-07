<?php

/**
 * @file
 * Contains \Drupal\defaultcontent\DefaultContentManager.
 * @todo remove all references to linkmanager?
 */

namespace Drupal\defaultcontent;

use Drupal\Component\Graph\Graph;
use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityTypeManager;
use Drupal\rest\LinkManager\LinkManagerInterface;
use Drupal\rest\Plugin\Type\ResourcePluginManager;
use Symfony\Component\Serializer\Serializer;
use Drupal\Component\Serialization\Yaml;



/**
 * A service for handling import of default content.
 * @todo throw useful exceptions
 */
class DefaultContentManager implements DefaultContentManagerInterface {

  //const LINK_DOMAIN = 'http://drupal.org';

  /**
   * The serializer service.
   *
   * @var \Symfony\Component\Serializer\Serializer
   */
  protected $serializer;

  /**
   * The rest resource plugin manager.
   *
   * @var \Drupal\rest\Plugin\Type\ResourcePluginManager
   */
  protected $resourcePluginManager;

  /**
   * The entity manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The file system scanner.
   *
   * @var \Drupal\defaultcontent\DefaultContentScanner
   */
  protected $scanner;

  /**
   * A list of vertex objects keyed by their link.
   *
   * @var array
   */
  protected $vertexes = array();

  /**
   * The graph entries.
   *
   * @var array
   */
  protected $graph = [];

  /**
   * The link manager service.
   *
   * @var \Drupal\rest\LinkManager\LinkManagerInterface
   */
  protected $linkManager;

  private $fileMap;

  /**
   * Constructs the default content manager.
   *
   * @param \Symfony\Component\Serializer\Serializer $serializer
   *   The serializer service.
   * @param \Drupal\rest\Plugin\Type\ResourcePluginManager $resource_plugin_manager
   *   The rest resource plugin manager.
   * @param \Drupal\Core\Entity\EntityManager $entity_manager
   *   The entity manager service.
   * @param \Drupal\rest\LinkManager\LinkManagerInterface $link_manager
   *   The link manager service.
   */
  public function __construct(Serializer $serializer, ResourcePluginManager $resource_plugin_manager, EntityTypeManager $entity_type_manager, LinkManagerInterface $link_manager) {
    $this->serializer = $serializer;
    $this->resourcePluginManager = $resource_plugin_manager;
    $this->entityTypeManager = $entity_type_manager;
    ///$this->linkManager = $link_manager;
  }

  /**
   * {@inheritdoc}
   */
  public function importContent($module) {
    $created = array();
    $folder = drupal_get_path('module', $module) . "/content/";
    if (file_exists($folder)) {
      $this->file_map = [];

      foreach ($this->getFilesInOrder($folder) as $link => $details) {
        if (!empty($this->file_map[$link])) {
          $file = $this->file_map[$link];
          $entity_type_id = $file->entity_type_id;
          $entity = $this->generateEntity($file, $file->entity_type_id);
          if ($this->entityTypeManager->getStorage('node')->loadByProperties(['uuid' => $entity->uuid()])) {
            drupal_set_message(t('node @uuid already exists', ['@uuid' => $entity->uuid()]));
          }
          else {
            //drupal_set_message("Importing node ".$entity->uuid());
            $entity->save();
            $created[] = $entity;
          }
        }
      }
      //import the menu links
      //@todo at the moment this is just importing the entity types the author needed
      if ($files = $this->scanner()->scan($folder . '/menu_link_content', 'yml')) {
        foreach ($files as $file) {
          $menu_link = Yaml::decode(file_get_contents($file->uri));
          $entities = $this->entityTypeManager->getStorage('node')->loadByProperties(['uuid' => $menu_link['dest_uuid']]);
          //assume the entity exists!
          unset($menu_link['dest_uuid']);
          $menu_link['link'] = [
            'uri' => 'entity:node/'.reset($entities)->id(),
            'name' => $menu_link['title'],
            'options' => []
          ];
          $link = \Drupal\menu_link_content\Entity\MenuLinkContent::create($menu_link);
          $link->save();
        }
      }
    }

    // Reset the tree.
    $this->resetTree();
    // Reset link domain.
    //$this->linkManager->setLinkDomain(FALSE);
    return $created;
  }

  /**
   * {@inheritdoc}
   */
  public function exportContentWithMenuLinks($entity_type_id, $entity_id) {
  $entity = $this->entityTypeManager
    ->getStorage($entity_type_id)
    ->load($entity_id);

    //$this->linkManager->setLinkDomain(static::LINK_DOMAIN);

    $serialized = $this->serializer->serialize(
      $entity,
      'hal_json',
      ['json_encode_options' => JSON_PRETTY_PRINT]
    );
    $serialized_entities_per_type[$entity_type_id][$entity->uuid()] = $serialized;
    // Reset link domain.
    //$this->linkManager->setLinkDomain(FALSE);
    //now add the menu links
    if ($item = $this->getMenuLink($entity)) {
      $serialized_entities_per_type['menu_link_content'][$entity->uuid()] = $item;
    }
    return $serialized_entities_per_type;
  }

  /**
   * {@inheritdoc}
   */
  public function exportContentWithReferences($entity_type_id, $entity_id) {
  $entity = $this->entityTypeManager
    ->getStorage($entity_type_id)
    ->load($entity_id);

    $entities = array_merge([$entity], $this->getEntityReferencesRecursive($entity));

    $serialized_entities_per_type = [];
    //$this->linkManager->setLinkDomain(static::LINK_DOMAIN);
    // Serialize all entities and key them by entity TYPE and uuid.
    foreach ($entities as $entity) {
      $serialized_entities_per_type[$entity_type_id][$entity->uuid()] = $this->serializer->serialize($entity, 'hal_json', ['json_encode_options' => JSON_PRETTY_PRINT]);
    }
    //$this->linkManager->setLinkDomain(FALSE);

    return $serialized_entities_per_type;
  }

  /**
   * Returns all referenced entities of an entity.
   *
   * This method is also recursive to support usecases like a node -> media
   * -> file.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity.
   * @param int $depth
   *   Guard against infinite recursion.
   *
   * @return \Drupal\Core\Entity\EntityInterface[]
   */
  protected function getEntityReferencesRecursive(ContentEntityInterface $entity, $depth = 0) {
    $entity_dependencies = $entity->referencedEntities();

    foreach ($entity_dependencies as $id => $dependent_entity) {
      // Config entities should not be exported but rather provided by default
      // config.
      if ($dependent_entity instanceof ConfigEntityInterface) {
        unset($entity_dependencies[$id]);
      }
      else {
        $entity_dependencies = array_merge($entity_dependencies, $this->getEntityReferencesRecursive($dependent_entity, $depth + 1));
      }
    }

    // Build in some support against infinite recursion.
    if ($depth > 5) {
      return $entity_dependencies;
    }

    return array_unique($entity_dependencies, SORT_REGULAR);
  }

  /**
   * Utility to get a default content scanner
   *
   * @return \Drupal\defaultcontent\DefaultContentScanner
   *   A system listing implementation.
   */
  protected function scanner() {
    if ($this->scanner) {
      return $this->scanner;
    }
    return new DefaultContentScanner();
  }

  /**
   * {@inheritdoc}
   */
  public function setScanner(DefaultContentScanner $scanner) {
    $this->scanner = $scanner;
  }

  /**
   * Parses content files
   */
  protected function parseFile($file) {
    return file_get_contents($file->uri);
  }

  protected function resetTree() {
    $this->graph = [];
    $this->vertexes = array();
  }

  protected function sortTree(array $graph) {
    $graph_object = new Graph($graph);
    $sorted = $graph_object->searchAndSort();
    uasort($sorted, 'Drupal\Component\Utility\SortArray::sortByWeightElement');
    return array_reverse($sorted);
  }

  /**
   * Returns a vertex object for a given item link.
   *
   * Ensures that the same object is returned for the same item link.
   *
   * @param string $item_link
   *   The item link as a string.
   *
   * @return object
   *   The vertex object.
   */
  protected function getVertex($item_link) {
    if (!isset($this->vertexes[$item_link])) {
      $this->vertexes[$item_link] = (object) array('link' => $item_link);
    }
    return $this->vertexes[$item_link];
  }

  protected function getMenuLink($entity) {
    if (!\Drupal::moduleHandler()->moduleExists('menu_link_content')) return;
    $links = $this->entityTypeManager
      ->getStorage('menu_link_content')
      ->loadByProperties(['link.uri' => 'entity:node/' . $entity->id()]);
    if (empty($links)) return;
    $link = reset($links);
    $item = [
      'title' => $link->getTitle(),
      'description' => $link->getDescription(),
      'menu_name' => $link->getMenuName(),
      'dest_uuid' => $entity->uuid(),
      'weight' => $link->getWeight()
    ];
    return Yaml::encode($item);
  }

  function getFilesInOrder($folder) {
    foreach ($this->entityTypeManager->getDefinitions() as $entity_type_id => $entity_type) {
      if ($entity_type_id == 'menu_link_content') {
        continue;//we'll deal with these AFTER the nodes are imported at least with drush
      }
      $reflection = new \ReflectionClass($entity_type->getClass());
      // We are only interested in importing content entities.
      if ($reflection->implementsInterface('\Drupal\Core\Config\Entity\ConfigEntityInterface')) {
        continue;
      }
      if (!file_exists($folder . '/' . $entity_type_id)) {
        continue;
      }
      $files = $this->scanner()->scan($folder . '/' . $entity_type_id, 'json');
      // Default content uses drupal.org as domain.
      // @todo Make this use a uri like default-content:.
      //$this->linkManager->setLinkDomain(static::LINK_DOMAIN);

      // Parse all of the files and sort them in order of dependency.
      foreach ($files as $file) {
        $contents = $this->parseFile($file);
        // Decode the file contents.
        $decoded = $this->serializer->decode($contents, 'hal_json');
        // Get the link to this entity.
        $self = $decoded['_links']['self']['href'];

        // Throw an exception when this URL already exists.
        if (isset($this->file_map[$self])) {
          $args = array(
            '@href' => $self,
            '@first' => $this->file_map[$self]->uri,
            '@second' => $file->uri,
          );
          // Reset link domain.
          //$this->linkManager->setLinkDomain(FALSE);
          throw new \Exception(t('Default content with href @href exists twice: @first @second', $args));
        }

        // Store the entity type with the file.
        $file->entity_type_id = $entity_type_id;
        // Store the file in the file map.
        $this->file_map[$self] = $file;
        // Create a vertex for the graph.
        $vertex = $this->getVertex($self);
        $this->graph[$vertex->link]['edges'] = [];
        if (empty($decoded['_embedded'])) {
          // No dependencies to resolve.
          continue;
        }
        // Here we need to resolve our dependencies;
        foreach ($decoded['_embedded'] as $embedded) {
          foreach ($embedded as $item) {
            $edge = $this->getVertex($item['_links']['self']['href']);
            $this->graph[$vertex->link]['edges'][$edge->link] = TRUE;
          }
        }
      }
    }
    // @todo what if no dependencies?
    return $this->sortTree($this->graph);

  }

  public function generateEntity($file, $entity_type_id) {
    $resource = $this->resourcePluginManager->getInstance(
      ['id' => 'entity:' . $entity_type_id]
    );
    $entity = $this->serializer
      ->deserialize(
        $this->parseFile($file),
        $resource->getPluginDefinition()['serialization_class'],
        'hal_json',
        ['request_method' => 'POST']
      );
    $entity->enforceIsNew(TRUE);
    $entity->setOwnerId(1);//this would be Anonymous if done by drush
    return $entity;
  }
}
