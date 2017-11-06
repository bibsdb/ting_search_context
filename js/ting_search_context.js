
  (function($) {
    'use strict';

    var TingSearchContext = (function() {

      var carousel = null;
      var content;
      var pane;
      var position;

      /**
       * Object to detect and store the current css breakpoint.
       */
      var breakpoint = {
        val: "",

        refresh_value: function () {
          this.val = this.get_current();
        },
        is_small_medium_large: function () {
          return this.val === "<940px";
        },
        has_changed: function () {
          return this.val !== this.get_current();
        },
        get_current: function () {
          var mql = window.matchMedia("screen and (min-width: 940px)");
          if (mql.matches){ // if media query matches
            return ">=940px";
          }
          else {
            return "<940px";
          }
        }
      };

       /**
       * Private: Makes an ajax call to the server to get new content for the
       * carousel. The search context is send along with the ajax request.
       */
      function _fetch() {
        $.ajax({
          type: 'post',
          url : Drupal.settings.basePath + 'ting/ting_search_context/content/ajax',
          dataType : 'json',
          data: {
            'context_id' : Drupal.settings.ting_search_context_id
          },
          success : function(data) {
            content = data;
            // Update the carousel.
            _update();
          }
        });
      }


     /**
       * Private: Updates the carousel after content has been fetched.
       */
       function _update() {

        // Reveal carousel if there is any content to display
        if(content.length > 0) {
          pane.show();
        }

        for (var i in content) {
          carousel.slick('slickAdd', content[i]);
        }
      }

          /**
       * Private: Sets the carousel element based on position-variable in Drupal.settings.
       * If viewport below 940px, the position-variable is ignored
       * and position is set to js-below-search-result.
       */
      function _set_element() {
        position = Drupal.settings.ting_search_context_position;

        // On small screens display below search results
        console.log(breakpoint);
        if (breakpoint.is_small_medium_large()) {
          position = 'js-below-search-result';
        }

        $('.pane-search-context').each(function() {

          if ($(this).hasClass(position)) {
            pane = $(this);
            console.log(pane);
            carousel = $(this).find('.slick-items');

            carousel.slick({
              infinite: false,
              slidesToShow: 4,
              slidesToScroll: 4,
              arrows: true,
              position: 'js-above-search-result',
              responsive: [
              {
                breakpoint: 940,
                settings: {
                  arrows: true,
                  slidesToShow: 4,
                  slidesToScroll: 4,
                  position: 'js-below-search-result'
                }
              },
              {
                breakpoint: 769,
                settings: {
                  arrows: false,
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  position: 'js-above-search-result'
                }
              }
              ]
            });
          }
        });
      }
      
      /**
       * Public: Init the carousel and fetch content.
       */
       function init() {

        // Detect the viewport
        breakpoint.refresh_value();

        // Pick and set the carousel element.
        _set_element();

        // Fetch content for the carousel.
        _fetch();

      }

      /**
       * Expoes public functions.
       */
       return {
        name: 'ting_search_context',
        init: init,
       };
     })();

    /**
     * Start the carousel when the document is ready.
     */
     $(document).ready(function() {
      TingSearchContext.init();
     });


   })(jQuery);