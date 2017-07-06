<?php

namespace Drupal\cshs\Plugin\views\filter;

use Drupal\taxonomy\Plugin\views\filter\TaxonomyIndexTidDepth;

/**
 * Filter handler for taxonomy terms with depth.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("cshs_taxonomy_index_tid_depth")
 */
class CshsTaxonomyIndexTidDepth extends TaxonomyIndexTidDepth {

  /**
   * Option ID.
   */
  const ID = 'cshs';

  use CshsTaxonomyIndex;

}
