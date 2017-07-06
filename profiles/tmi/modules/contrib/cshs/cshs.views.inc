<?php

/**
 * @file
 * Views integration.
 */

use Drupal\cshs\Plugin\views\filter\CshsTaxonomyIndexTid;
use Drupal\cshs\Plugin\views\filter\CshsTaxonomyIndexTidDepth;

/**
 * Implements hook_views_plugins_filter_alter().
 */
function cshs_views_plugins_filter_alter(array &$plugins) {
  $plugins['taxonomy_index_tid']['class'] = CshsTaxonomyIndexTid::class;
  $plugins['taxonomy_index_tid_depth']['class'] = CshsTaxonomyIndexTidDepth::class;
}
