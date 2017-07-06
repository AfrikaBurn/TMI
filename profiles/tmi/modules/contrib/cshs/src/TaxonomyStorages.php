<?php

namespace Drupal\cshs;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\taxonomy\TermStorage;
use Drupal\taxonomy\VocabularyStorage;

/**
 * Class TaxonomyStorages.
 */
trait TaxonomyStorages {

  /**
   * Entity repository service.
   *
   * @var EntityRepositoryInterface
   */
  protected $entityRepository;
  /**
   * Entity type manager service.
   *
   * @var EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Get storage object for terms.
   *
   * @return TermStorage
   *   Taxonomy term storage.
   */
  protected function getTermStorage() {
    return $this->getStorage('taxonomy_term');
  }

  /**
   * Get storage object for vocabularies.
   *
   * @return VocabularyStorage
   *   Taxonomy vocabulary storage.
   */
  protected function getVocabularyStorage() {
    return $this->getStorage('taxonomy_vocabulary');
  }

  /**
   * Gets the entity translation to be used in the given context.
   *
   * @param EntityInterface $entity
   *   The entity whose translation will be returned.
   *
   * @return EntityInterface
   *   An entity object for the translated data.
   */
  protected function getTranslationFromContext(EntityInterface $entity) {
    if (NULL === $this->entityRepository) {
      $this->entityRepository = \Drupal::service('entity.repository');
    }

    return $this->entityRepository->getTranslationFromContext($entity);
  }

  /**
   * Get storage object for an entity.
   *
   * @param string $entity_type
   *   Name of an entity type.
   *
   * @return EntityStorageInterface
   *   Storage object.
   */
  private function getStorage($entity_type) {
    if (NULL === $this->entityTypeManager) {
      $this->entityTypeManager = \Drupal::entityTypeManager();
    }

    return $this->entityTypeManager->getStorage($entity_type);
  }

}
