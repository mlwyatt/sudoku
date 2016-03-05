$(function(){

  (function shiftMenu() {

    var current = 'menu-0';

    var showMenu = function() {
      $('#menu-wrapper').attr('style', 'display: block;')
    }

    var setViewHeight = function() {
      $('#content-container').attr('style', 'position:absolute;padding-top:0px;');
      var height = $('#content-0').outerHeight();
      $('#content-wrapper').attr('style', 'height:'+(height+40)+'px;');
    }

    //-----//

    var removeActive = function() {
      [].forEach.call($('.menu-item'), function(element) {
        $(element).removeClass('active');
      });
    }

    var addActiveClass = function(itemId) {
      $('#'+itemId).addClass('active');
    }

    // set marker position - works with any number of menu items
    var setMarkerPosition = function(itemId) {
      var marker = $('.marker');
      var numOfItems = $('div.menu-item').length;
      var percent = Math.floor(100/numOfItems) * itemId.charAt(5);
      var width = $('#'+itemId).find('span.inner').outerWidth();
      $(marker).attr('style', 'left:'+percent+'%;');
      $(marker).find('span').attr('style', 'width:'+width+'px;');
      current = itemId;
    }

    // shift view - works with any number of content items
    var shiftView = function(itemId) {
      var container = $('#content-container');
      var content = $('#content-'+itemId.charAt(5));
      var height = $(content).outerHeight();
      var prevItems = $(content).prevAll();
      var heightSum = 0;

      if(prevItems.length > 0) {
        for(var i=0; i<prevItems.length; i++) {
          heightSum += $(prevItems[i]).outerHeight();
        }
        $(container).attr('style', 'top:-'+(heightSum-40)+'px;position:absolute;padding-top:0px;');
      } else {
        $(container).attr('style', 'top:40px;position:absolute;padding-top:0px;');
      }
      $('#content-wrapper').attr('style', 'height:'+(height+40)+'px;');
    }

    var runShift = function(itemId) {
      removeActive();
      addActiveClass(itemId);
      setMarkerPosition(itemId);
      shiftView(itemId);
    }

    var addHashValue = function(itemId) {
      window.location.hash = itemId.charAt(5);
    }

    //-----//


    var onUrlHash = function(){
      var itemId = 'menu-'+window.location.hash.substring(1);

      if (itemId && $('#'+itemId).length) {
        runShift(itemId);
      }
      $(window).on('hashchange', function(){
        if (window.location.hash.substring(1) == '' || window.location.hash.substring(1) == ' ' ){
          runShift('menu-0');
        } else {
          itemId = 'menu-'+ window.location.hash.substring(1);
          if (itemId && $('#'+itemId).length) {
            runShift(itemId);
          }
        }
      });
    }

    var onMenuClick = function() {
      $('#menu-wrapper').click(function(event){
        var itemId = $(event.target).closest('.menu-item').attr('id');
        runShift(itemId);
        addHashValue(itemId);
      });
    }

    //-----//

    showMenu();
    onMenuClick();

    // sets the height of content wrapper (for some reason to the wrong height.)
    setViewHeight();

    // by waiting for window load the height is set correctly
    // the above "setViewHeight" functions helps with the delay caused waiting for load.
    $(window).load(function(){
      setViewHeight();
      onUrlHash();
    });

    // reset values on window resize
    $(window).resize(function() {
      setViewHeight();
      runShift(current);
    });

  }());

});
