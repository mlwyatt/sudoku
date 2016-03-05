(function($){

    $.fn.hasAttr = function(name) {
        return this.attr(name) !== undefined && this.attr(name) !== false;
    };

    $.fn.vshow = function() {
        return this.each(function(){
            $(this).css('visibility', 'visible');
        });
    };

    $.fn.vhide = function() {
        return this.each(function(){
            $(this).css('visibility', 'hidden');
        });
    };

    $.fn.showInline = function() {
        return this.each(function(){
            $(this).css('display', 'inline-block');
        });
    };

    $.fn.btnLoading = function(txt, is_disabled){
        return this.each(function(){
            var $this = $(this);

            // Make sure the button isn't already in the loading state.
            if ( !$this.attr('data-btn-loading') || $this.attr('data-btn-loading').toString() != 'true' ) {
                // Set the orig text to the element and make sure it's status is set to loading.
                $this.attr({
                    'data-orig-text'  : ($this.html() != '' ? $this.html() : $this.text()),
                    'data-btn-loading': true
                });

                if (is_disabled) {
                    $this.btnDisable();
                }

                // If no default loading text passed in, let user know that it is doing something.
                if ( typeof txt == 'undefined' || txt == '' ) {
                    $this.text('').html('Loading...'); //'<i class="icon-spin2 animate-spin"></i>'+$(this).attr('data-orig-text')
                }
                else {
                    $this.text('').html(txt);
                }
            }
        });
    };

    $.fn.btnDoneLoading = function(){
        return this.each(function(){
            var $this = $(this);

            // Set button back to default text and set loading to false.
            $this.text('').html( $this.attr('data-orig-text') )
                .attr('data-btn-loading', false)
                .removeAttr('disabled')
            ;

            if ($this.attr('data-disabled') == 'true' || $this.hasAttr('disabled') || $this.is(':disabled')) {
                $this.btnEnable();
            }
        });
    };

    $.fn.isHidden = function(){
        return $(this).css('display') === 'none' || $(this).css('visibility') === 'hidden';
    };

    $.fn.isVisible = function(){
        return !$(this).isHidden();
    };

    $.fn.reload = function(){
        return $(this.selector);
    };

    $.fn.btnDisable = function(){
        return this.each(function(){
            var $this = $(this);

            if (!$this.hasClass('btn-disabled')) {
                $this.attr('data-orig-class', $this.attr('class'))
                    .addClass('btn-disabled')
                    .attr('disabled', true)
                    .attr('data-disabled', 'true')
                    .attr('title', 'Button is disabled. '+($this.attr('title')||''))
                    .removeClass('btn-default btn-success btn-primary btn-error btn-warning btn-danger btn-info')
                ;
            }
        });
    };

    $.fn.btnEnable = function(){
        return this.each(function(){
            var $this = $(this);

            $this.removeAttr('disabled')
                .removeClass('btn-disabled')
                .attr('data-disabled', 'false')
            ;

            if ($this.hasAttr('title')) {
                $this.attr('title', $this.attr('title').replace('Button is disabled. ', ''));
            }

            if ($this.hasAttr('data-orig-class')){
                $this.attr('class', $this.attr('data-orig-class'));
            }
        });
    };

    // This will add an error to a field. Pass in the message that you want to
    // be displayed to the user via tooltip on field focus. :val_error is added
    // to a field if it is an error from the validations.
    $.fn.add_error = function(message, val_error) {
        return this.each(function(){
            $(this).attr({
                'data-error': 'true',
                'data-error-message': message
            });

            if ( typeof val_error != 'undefined' && (val_error === true || val_error === 'true') ) $(this).attr('data-validation-error', true);
        });
    };

    // This will remove an error from a field (see: $.fn.add_error). It deletes
    // all known attrs tied to fields with errors except classes.
    $.fn.remove_error = function() {
        return this.each(function(){
            $(this).attr('data-error', 'false')
                .removeAttr('data-error-message')
                .removeAttr('data-validation-error');
        });
    };

    // Locks a field, so the user can no longer use the field to enter data.
    $.fn.lock_field = function(){
        return this.each(function(){
            if ( !$(this).hasAttr('data-tabindex') ) {
                $(this).attr('data-tabindex', ($(this).attr('tabindex') || 0));
            }

            $(this).addClass('lock_fields')
                .attr({
                    'data-locked': true,
                    'tabindex': '-1',
                    'readonly': 'readonly'
                })
                .remove_error();
        });
    };

    // Removes lock on field so user can enter data (see: $.fn.lock_field).
    $.fn.unlock_field = function(){
        return this.each(function(){
            $(this).removeClass('lock_fields')
                .attr({
                    'data-locked': false,
                    'tabindex': $(this).attr('data-tabindex')
                })
                .removeAttr('readonly');
        });
    };

    // This is for whitelisting fields.
    $.fn.fieldNotRequired = function(){
        return this.each(function(){
            if ( !$(this).hasAttr('data-tabindex') ) {
                $(this).attr('data-tabindex', ($(this).attr('tabindex') || 0));
            }

            $(this).addClass('lock_fields')
                .attr({
                    'data-required': false,
                    'tabindex': '-1'
                })
                .remove_error();
        });
    };

    $.fn.fieldRequired = function(){
        return this.each(function(){
            $(this).removeClass('lock_fields')
                .attr({
                    'data-required': true,
                    'tabindex': $(this).attr('data-tabindex')
                })
                .removeAttr('readonly')
                .unlock_field();
        });
    };

    // This will make the button class and if null passed in,
    // it will go back to the default if one is found.
    //
    $.fn.btnClass = function(toggle_class){
        return this.each(function(){
            var $button = $(this);

            if (typeof toggle_class === typeof undefined) {
                var default_class = $button.attr('data-default-toggle-class');

                if (default_class) {
                    $button.attr('class', default_class);
                }

                return;
            }

            $button.attr('data-default-toggle-class', $button.attr('class'));
            $button.removeClass('is-default is-success is-primary is-error is-warning is-disabled');
            $button.addClass(toggle_class);
        });
    };

    // Adding jQuery UI :tabbable and :focusable selector. jQuery must be loaded in before called.
    // Calling $(':tabbable') will return all fields that are tabbable. This includes
    // links, buttons, inputs (type: text_field, textarea, number_field, select, etc.), etc.
    //
    // see: https://api.jqueryui.com/tabbable-selector/
    // see: https://api.jqueryui.com/focusable-selector/

    // This was added in because the addBack function was not added until
    // v1.8. Since we are using 1.7, this needed to be added to support
    // :tabbable and :focusable selectors.
    //
    // see: http://stackoverflow.com/a/17809461/2258871
    $.fn.addBack = function (selector) {
        return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    };

    function focusable( element, isTabIndexNotNaN ) {
        var map, mapName, img,
            nodeName = element.nodeName.toLowerCase();
        if ( "area" === nodeName ) {
            map = element.parentNode;
            mapName = map.name;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
            return !!img && visible( img );
        }
        return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
                !element.disabled :
                "a" === nodeName ?
                element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
                // the element and all of its ancestors must be visible
            visible( element );
    }

    function visible( element ) {
        return $.expr.filters.visible( element ) &&
            !$( element ).parents().addBack().filter(function() {
                return $.css( this, "visibility" ) === "hidden";
            }).length;
    }

    // This is where the selectors are actually added to jQuery selector
    // methods. These will call the above functions.
    //
    $.extend( $.expr[ ":" ], {
        data: $.expr.createPseudo ?
            $.expr.createPseudo(function( dataName ) {
                return function( elem ) {
                    return !!$.data( elem, dataName );
                };
            }) :
            // support: jQuery <1.8
            function( elem, i, match ) {
                return !!$.data( elem, match[ 3 ] );
            },

        focusable: function( element ) {
            return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
        },

        tabbable: function( element ) {
            var tabIndex = $.attr( element, "tabindex" ),
                isTabIndexNaN = isNaN( tabIndex );
            return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
        }
    });

    // This method does the same thing as $.inArray, just this will
    // except 2 arrays.
    // +elem+ is the string, integer, or array to be checked. +array+
    // is the array to compare +elem+ to. To check if the elements are
    // in the array do the same thing as you normally would.
    // Ex:
    // This will be true because 1,2,3 are in the array
    // $.inArry( [1,2,3], [1,2,3,4,5] ) !== -1;
    // => true
    // This will be false because 7 is not in the compare array
    // $.inArry( [1,2,7], [1,2,3,4,5] ) !== -1;
    // => false
    $.inArry = function( elem, array, i ) {
        // If +elem+ is an array, do special loop checks.
        if ( elem && isArray(elem) ){
            var in_array = [];

            // Store each check into an array.
            $.each(elem, function(ek, ev){
                in_array.push( $.inArray( ev, array ) !== -1 );
            });

            // Once all checks are done, see if any of them returned false
            return $.inArray( false, in_array );
        }
        // This is the default check.
        else {
            return $.inArray( elem, array, i );
        }
    };

    $.fn.addError = function(){
        return this.each(function(){
            $(this).addClass('inputError').attr('data-has-error', 'true');
        });
    };

    $.fn.removeError = function(){
        return this.each(function(){
            $(this).removeClass('inputError').attr('data-has-error', 'false');
        });
    };

    // If you want to check multiple classes against an element, then split
    // those classes out into an array (ex: $el.attr('class').split(' ')).
    // This will then return true or false if any of those classes our found
    // on that element. If an array passed in, but only one element in the
    // array, it will call the default hasClass function. If no array passed
    // in, it defaults to hasClass function.
    $.fn.hasClasses = function(classes){
        var $this = $(this);

        // If it's an array, do special stuff
        if ( isArray(classes) ) {
            // If the array only has one element, then just do the default
            if ( classes.length === 1 ) {
                return $this.hasClass(classes[0]);
            }

            // Store the returns of hasClass into an array to check later
            var hasClass = [];

            $.each(classes, function(k, v){
                hasClass.push($this.hasClass(v));
            });

            // Check the array of hasClass returns to see if any classes are
            // in the class attr of that element.
            return $.inArray( true, hasClass ) !== -1;
        }

        // No an array, so call default
        return $this.hasClass(classes);
    };

    // Figures out the max z-index in the dom
    // see: https://code.google.com/p/topzindex/
    $.maxZindex = function(){
        return Math.max(
            0,
            Math.max.apply(
                null,
                $.map(
                    $.makeArray(document.getElementsByTagName("*")),
                    function (v) {
                        return parseFloat($(v).css("z-index")) || null;
                    }
                )
            )
        );
    };

    // Check whether a link/button acts like a link or button.
    // Pass in 'button' or 'a'/'link' and this will try and figure out
    // if the passed in object is acting like a button or link. The object
    // could be a link in the dom, but if it needs to look like a button
    // this will figure that out.
    //
    // Examples:
    // <a>Some link</a>
    // $('a').actsLike('a') => true
    // $('a').actsLike('button') => false
    //
    // <a class="button">Some link to look like a button</a>
    // $('a').actsLike('a') => false
    // $('a').actsLike('button') => true
    //
    $.fn.actsLike = function(acting_like){
        // If nothing was passed in, just return false
        if (!acting_like || typeof acting_like === typeof undefined || acting_like === '') {
            return false;
        }

        var $thing = $(this);
        // Make sure to downcase everything for checking
        acting_like = acting_like.toString().toLowerCase();

        if (acting_like === 'button') {
            // A button either needs to be a button in the dom with no link class
            // or it needs to have the class button and no link class.
            return (/button/gi.test($thing.get(0).tagName) || $thing.hasClass('button')) && !$thing.hasClass('is-link');
        }
        else if (acting_like === 'a' || acting_like === 'link') {
            // A link needs to be a link in the dom with no button class
            // or it needs to have the link class and no button class.
            return (/a/gi.test($thing.get(0).tagName) || $thing.hasClass('is-link')) && !$thing.hasClass('button');
        }

        // Nothing matched, so return false
        return false;
    };

    $.fn.ariaHide = function(){
        return this.each(function(){
            $(this).attr('aria-hidden', true).hide();
        });
    };

    $.fn.ariaShow = function(){
        return this.each(function(){
            $(this).removeAttr('aria-hidden').show();
        });
    };

    // When pasting anything into a visible input field, we want to make sure
    // that there is no leading tab char or leading space. If you want an input
    // to not have this listener give it the attr 'data-paste="ignore"' and this
    // function will skip it.
    //
    // WARN: This will not wait for other functions to fire before this changes
    //       the value. This could mean any code that depends on `change` could
    //       be affected by this code.
    $(document).on('paste', function(evt){
        var $el = $(document).find('input:focus');

        if ( !$el ||
            $el.length <= 0 ||
            !$el.is(':visible') ||
            ($el.hasAttr('data-paste') && $el.hasAttr('data-paste') == 'ignore')
        )
        {
            return;
        }

        // If it has a change trigger, we need to stop it right away until
        // the value is fixed. Once the value is fixed we can trigger that
        // the change has taken effect.
        if ( $el.hasListener('change') ) {
            stopEventBubble(evt);
            stopEventProp(evt);

            // Attach listener to the paste.change event. Once that is triggered
            // it is safe to trigger the normal change event.
            $el.one('paste.change', function(){
                $el.trigger('change');
            });
        }

        // Need to set timeout because we need to let the value in the field
        // catch up to the js. If there is a change trigger, it should be
        // canceled by this point, so we don't need to worry about timing.
        setTimeout(function(){
            $el = $el.reload();
            var currentVal = $el.val()||'';
            var newVal = currentVal.strip();
            // Going to set the value that was pasted into the field, just
            // in case we need it somewhere else.
            $el.val(newVal).attr('data-paste-val', currentVal);
            $el.trigger('paste.change');
        }, 1);
    });

    // This returns a boolean (true|false). This only works for elements
    // that are attached to the listeners directly.
    //
    // For example:
    //   $('#el_id').on('click', clickHandler);
    //   $('#el_id').hasListener('click');
    //   => true
    //
    //   $('#container_id').on('click', '#el_id', clickHandler);
    //   $('#el_id').hasListener('click');
    //   => false
    //
    // WARN: This WILL break chaining in jQuery objects. This is only used
    //       to return a boolean. not to chain multiple selectors.
    //
    // NOTE: This will only take one selected element at a time. This has
    //       NOT be tested on a multiple select.
    //
    // Resources:
    //  - http://stackoverflow.com/a/1515073
    //  - http://stackoverflow.com/a/14072162
    //  - http://stackoverflow.com/a/22841712
    //  - http://stackoverflow.com/a/1236080
    $.fn.hasListener = function(listener_event){
        return $(this).getEventsFor(listener_event).length > 0;
    };

    // This is tied to the doc of `hasListener`.
    //
    // WARN: This will return an Array. You will NOT be able to chain functions
    //       in jQuery after using this method.
    //
    // NOTE: This only supports a single selector only!
    $.fn.getEventsFor = function(event_type){
        var $el = $(this);
        var events = $el.data('events');
        if ( events ) events = events[event_type]||[];
        else events = [];
        var inlineEvent = $el.attr('on'+event_type);
        if ( inlineEvent ) events.push([{handler: inlineEvent, origType: event_type, type: event_type}]);
        return events;
    };

    $.fn.dateField = function(options){
        return this.each(function(){
            $(this).datepicker(options);
        });
    };

})(jQuery);