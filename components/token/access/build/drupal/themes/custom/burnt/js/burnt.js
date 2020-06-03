/**
 * @file
 * Burnt shared javascript.
 */

'use strict';

(function ($) {

  Drupal.behaviors.burnt = {
    attach: function (context, settings) {

      $('.slick--view--slideshow--front-page .slick-slider').ready(
        () => {

          var
            bgSlider = $('.slick--view--slideshow--background'),
            fpSlider = $('.slick--view--slideshow--front-page')

          bgSlider.on('beforeChange',
            (event, slick, currentSlide) => {
              setTimeout(
                () => fpSlider.children('.slick-slider').slick('slickGoTo', currentSlide + 1),
                500
              )
            }
          )

          fpSlider.on('beforeChange',
            (event, slick, currentSlide) => {
              // var oldSpeed = bgSlider.children('.slick-slider').slick('speed')
              // bgSlider.children('.slick-slider').slick('speed', 100)
              bgSlider.children('.slick-slider').slick('slickGoTo', currentSlide + 1)
              // bgSlider.children('.slick-slider').slick('speed', oldSpeed)
            }
          )

          bgSlider.children('.slick-slider').slick('slickGoTo', 0)
        }
      )
    }
  }

})(jQuery)