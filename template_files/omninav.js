/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

/**
 * OmniNav
 */
(function ($) {
  /* global OmniNav jQuery */
  window.OmniNav = {};

  OmniNav.collapsibles = function(){
    var $openItem = null;
    $('#omninav .o-nav-search-link, #omninav .o-nav-more-link').on('click',function(){
      var $item = $(this).data('target'),
          $oitem = $openItem ? $openItem.data('target') : null,
          $target = $($item);

      if ($oitem !== null && $oitem !== $item ) {
        $openItem.click();
      }

      if ($oitem !== null && $oitem === $item ) {
        if (!$(this).collapse)
        {
          $target.trigger('hide.bs.collapse').animate({ height: 0 }, 350, function() {
            $target.removeClass("in").removeAttr("style");
          });
          $openItem.addClass("collapsed");
        }

        $openItem = null;
      } else {
        $openItem = $(this);

        if (!$(this).collapse)
        {
          $openItem.removeClass("collapsed");
          var h = $target.trigger('show.bs.collapse').addClass("in").height();

          $target.css("height", 0).animate({
            height: h
          }, 350, function() {
                    $target.css("height", "auto");
                  });
        }
      }
    });
    
    $('#omninav .main-nav').on('hide.bs.collapse', function() {
    	$('#omninav .navbar').removeClass('menu-open');
    }).on('show.bs.collapse', function() {
    	$('#omninav .navbar').addClass('menu-open');
    });
    
    $('#omninav .navbar .close-more').on('click', function() {
    	$('#omninav .o-nav-more-link').trigger('click');
    });
  };

  // this is for global navigation
  OmniNav.init = function() {
    if($('#omninav ul.menu').find('li').children('ul.menu').length > 0){
      var item = $('#omninav ul.menu').find('li').children('ul.menu');
      item.parent().addClass('submenu');
      item.parent().children('a').unbind('click').click(function(){
        $("#omninav .main-nav .back").css('display','block');
        // $(this).parent().siblings().hide();
        $("#omninav .menu li a").hide();
        $(this).show();
        $(this).next('ul').find('a').show();
        $(this).addClass('active').next('ul').css('display','block');
      });
    }

    $('#omninav .main-nav .back').unbind('click').click(function(){
      // $(this).hide();
      // $('.menu li a').show();
      // $('.menu li a').removeClass('active');
      // $('.menu li ul').css('display','none');
      $("#omninav .menu li a").each(function(){
        if( $(this).is(':visible')){
          $(this).parent('li').parent('ul').prev('a').css('display','block');
          $(this).removeClass('active').next('ul').css('display','none');
          $(this).parent('li').siblings().children('a').css('display','block');

          var hideback = 1;
          $('#omninav ul.menu > li > a').each(function(){
            if($(this).hasClass('active')){
              hideback = 0;
            }
          });
          if (hideback === 1){
            $('#omninav .main-nav .back').hide();
          }
        }
      });
    });
  };

  OmniNav.setLocation = function(){
    if($.cookie('CITY') && $.cookie('STATE')) {
      var location = $('.main-nav .menu li.location a');
      location.removeClass('request-location');
      location.html('');
      location.html('<span><strong>Your Location: '+$.cookie('CITY')+", "+$.cookie('STATE')+'</strong>Change location</span>');
    }
  };

  OmniNav.selectors = {
    cartIconCount: '.navbar .o-nav-more-icon span',
    miniCartIcon: '.navbar .o-nav-more-icon'
  };

  OmniNav.events = {
    addToCart: 'OmniNav.events.addToCart'
  };

  OmniNav.endPoints = {
    miniCartCount: 'url to service'
  };

  OmniNav.miniCart = {
    updateCartIconCount: function () {
      $.ajax({
        url: OmniNav.endPoints.miniCartCount,
        type: 'post',
        dataType: 'html',
        success: function(data) {
          if (data.success) {
            $(OmniNav.selectors.cartIconCount).html(data.success.cartCount);
          }
        },
        error: function(xhr) {
          // TODO handle error condition: hide count completely? Show a modal?
        }
      });
    }
  };

  OmniNav.controller = function() {

    // listen for addToCartEvents throughout the UI and update the count as needed
    $(document).on(OmniNav.events.addToCart, OmniNav.miniCart.updateCartIconCount);

  };

  /** Main Controller */
  $(function() {
    'use strict';

    OmniNav.init();
    //OmniNav.controller();
    OmniNav.collapsibles();
    OmniNav.setLocation();
  });
  
	OmniNav.callOnlineOpinion = function(){
		var globalId = String(encodeURIComponent($.cookie('GLOBALID')));
		var page = String(encodeURIComponent(window.location));
		var channel = String(encodeURIComponent('/mobile store'));
		var opinlabURL = 'https://secure.opinionlab.com/ccc01/o.asp?id=lqArjREC&referer='+ page +'&custom_var='+ globalId + '%7C' + channel;
		window.location = opinlabURL;
	};

})(jQuery)

