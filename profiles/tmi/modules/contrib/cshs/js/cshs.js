/**
 * @file
 * Behavior which initializes the simplerSelect jQuery Plugin.
 */

(function ($) {
  'use strict';

  Drupal.behaviors.cshs = {
    attach: function (context, settings) {
      $('select.simpler-select-root', context)
        .once('cshs')
        .each(function (idx, element) {
          // See if we got settings from Drupal for this field.
          if (typeof settings.cshs !== 'undefined' && typeof settings.cshs[element.id] !== 'undefined') {
            $(element).simplerSelect(settings.cshs[element.id]);
          }
        }
      );
    }
  };
})(jQuery);
