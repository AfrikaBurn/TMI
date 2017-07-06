<?php

namespace Drupal\cshs\Plugin\Field\FieldFormatter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\Plugin\Field\FieldFormatter\EntityReferenceFormatterBase;
use Drupal\taxonomy\Entity\Term;
use Drupal\cshs\IsApplicable;
use Drupal\cshs\TaxonomyStorages;

/**
 * Base formatter for CSHS field.
 */
abstract class CshsFormatterBase extends EntityReferenceFormatterBase {

  use IsApplicable;
  use TaxonomyStorages;

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'linked' => FALSE,
      'reverse' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element = [];

    $element['linked'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Link to term page'),
      '#default_value' => $this->getSetting('linked'),
    ];

    $element['reverse'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Reverse order view'),
      '#default_value' => $this->getSetting('reverse'),
      '#description' => $this->t('Outputs hierarchy in reverse order (the deepest level first).'),
    ];

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $summary[] = $this->t('Linked to term page: @linked', [
      '@linked' => $this->getSetting('linked') ? $this->t('Yes') : $this->t('No'),
    ]);

    $summary[] = $this->t('Reverse order view: @reverse', [
      '@reverse' => $this->getSetting('reverse') ? $this->t('Yes') : $this->t('No'),
    ]);

    return $summary;
  }

  /**
   * Returns an array of all parents of a given term.
   *
   * @param Term $term
   *   Taxonomy term.
   *
   * @return Term[]
   *   Parent terms of a given term.
   */
  protected function getTermParents(Term $term) {
    return array_reverse($this->getTermStorage()->loadAllParents($term->id()));
  }

}
