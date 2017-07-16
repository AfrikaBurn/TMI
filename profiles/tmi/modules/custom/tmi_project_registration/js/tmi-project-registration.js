/**
 * @file
 * Project registration form behaviors.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Set the correct state on tabs.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behavior for the block settings summaries.
   */
  Drupal.behaviors.tmiProjectRegistration = {
    attach: function (context) {
      if (context == document){
        $(
          function(){
            for (var i in drupalSettings.tmiProjectRegistration.state){
              var 
                state = drupalSettings.tmiProjectRegistration.state[i],
                panel = $('#edit-group-' + i),
                index = panel.parent().children('.form-wrapper').index(panel),
                tabs = $('.vertical-tabs__menu-item', panel.parents('.vertical-tabs'));
              $(tabs[index]).addClass('js-section-tab js-section-tab-state-' + state);
            }
            $('a', $('.vertical-tabs__menu .js-section-tab-state-started').first()).click();
          }
        );        
      }
    }
  };

})(jQuery, Drupal, drupalSettings);
