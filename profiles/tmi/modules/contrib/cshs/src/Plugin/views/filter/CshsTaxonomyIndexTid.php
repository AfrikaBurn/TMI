<?php

namespace Drupal\cshs\Plugin\views\filter;

use Drupal\taxonomy\Plugin\views\filter\TaxonomyIndexTid;

/**
 * Filter by term ID.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("cshs_taxonomy_index_tid")
 */
class CshsTaxonomyIndexTid extends TaxonomyIndexTid {

  /**
   * Option ID.
   */
  const ID = 'cshs';

  use CshsTaxonomyIndex;

}
