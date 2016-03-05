jQuery(document).ready(function($){

    $('select').material_select();

    $('.navbar-trigger').on('click', function(){
        $('.navbar-trigger').toggleClass('is-open');
        $('#primary_nav ul').toggleClass('is-visible');
    });

    $(".nav-container .nav-item a").click(function ( e ) {
        e.preventDefault();
        $(".nav-container .nav-item a.active").removeClass("active");
        $(this).addClass("active");
    });

});

// Trying to create a function like .present? and .blank?.
// Pass in an obj to test if it is there and not empty.
//
// WARNING: This code is not fool proof. Use at your own risk.
//
// +thing+ is the var that is to be tested. Just call
// +blank+ since it's the opposite.
function present( thing ) {
    return !blank(thing);
}

// This will see if a var exists or not. +obj+ is the var to
// be tested. This will return a boolean.
function blank( obj ) {
    if ( isUndefined(obj) ) {
        return true;
    }

    if ( isNull(obj) ) {
        return true;
    }

    if ( isString(obj) ) {
        return obj === '' || obj === 'null' || obj === 'nil' || obj.length < 1;
    }

    if ( isNumber(obj) ) {
        return isNaN(obj);
    }

    if ( isBoolean(obj) ) {
        // If it is false then it is blank.
        return obj === false;
    }

    if ( isArray(obj) ) {
        // If array length less than one(1), assume that it is empty.
        return obj.length < 1;
    }

    if ( isObject(obj) ) {
        // jQuery has a native function to check for an empty object,
        // but if there is no jquery, we need a fall back.
        if (jQuery) {
            return jQuery.isEmptyObject(obj);
        }
        else {
            for ( var name in obj ) {
                if (obj.hasOwnProperty(name))
                    return false;
            }

            return true;
        }
    }

    return false;
}

//
// These are the object testers. The first check will be
// a generic check and if it fails then we don't need to
// go to the second check. The second check is more expensive
// to run. That is why there are 2 checks.
//
function isArray(arry) {
    if ( typeof arry !== 'object' ) return false;

    return Object.prototype.toString.call(arry) === '[object Array]';
}

function isNumber(num) {
    if ( typeof num === 'number' ) return true;

    return Object.prototype.toString.call(num) === '[object Number]';
}

function isString(str) {
    if ( typeof str === 'string' ) return true;

    return Object.prototype.toString.call(str) === '[object String]';
}

function isObject(obj) {
    if ( typeof obj !== 'object' ) return false;

    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isBoolean(bool) {
    if ( typeof bool === 'boolean' ) return true;

    return Object.prototype.toString.call(bool) === '[object Boolean]';
}

function isDate(date) {
    if ( typeof date !== 'object' ) return false;

    return Object.prototype.toString.call(date) === '[object Date]';
}

function isRegExp(regex) {
    if ( typeof regex !== 'object' ) return false;

    return Object.prototype.toString.call(regex) === '[object RegExp]';
}

function isFunction(fun) {
    if ( typeof fun === 'function' ) return true;

    return Object.prototype.toString.call(fun) === '[object Function]';
}

function isNull(n) {
    if ( n === null ) return true;

    return Object.prototype.toString.call(n) === '[object Null]';
}

function isUndefined(un) {
    if ( typeof un === 'undefined' || un === undefined ) return true;

    return Object.prototype.toString.call(un) === '[object Undefined]';
}

function isArguments(args) {
    return Object.prototype.toString.call(args) === '[object Arguments]';
}

// see: http://makandracards.com/makandra/1122-cancelling-event-propagation-with-jquery
function stopEvent(event){
    try{ event.preventDefault(); }catch(e){}
}
function stopEventBubble(event){
    try{ event.preventBubble(); }catch(e){}
    try{ event.cancelBubble = true; }catch(e){}
}
function stopEventProp(event){
    try{ event.stopImmediatePropagation(); }catch(e){}
    try{ event.stopPropagation(); }catch(e){}
}
function stopEventAndProp(evt){
    stopEvent(evt);
    stopEventProp(evt);
}
function stopEventAndBubble(evt){
    stopEvent(evt);
    stopEventBubble(evt);
}
function killEvent(event){
    stopEventProp(event);
    stopEventBubble(event);
    stopEvent(event);
    return false;
}

// +select2+ matcher function. +regexMatcher+ is if you need to put anything in front of the regex
// builder. Example: '^' to start matching at the beginning of the string. Can change this to support
// an object if need to add something to the ending of the string (will need to check if a string or
// object for backwards com.). +regexOptions+ is the regex options for global etc. Example: 'i' or 'gi'.
// +search_str+ is the user inputted search string from select2. +option_text+ is the text from the
// option itself. +$option+ is a jquery object of the option that the search is running against.
//
// NOTE: This MUST return a boolean to determine if it's a match or not.
var select2MatcherFn = function(regexMatcher, regexOptions, search_str, option_text, $option){
    // Set up options for regex.
    regexMatcher = blank(regexMatcher) ? '' : regexMatcher;
    regexOptions = blank(regexOptions) ? 'i' : regexOptions;

    // Create a new regex with options.
    var regex = new RegExp( regexMatcher+search_str, regexOptions );

    // Test regex against current option.
    return regex.test( option_text );
};

// general remove fields
function remove_fields(link, closest_class_or_el) {
    if ( blank(closest_class_or_el) ) { closest_class_or_el = '.fields'; }
    $(link).prev("input[type=hidden]").val("1").end().closest(closest_class_or_el).hide();
}

// general add fields
function add_fields(link, association, content, target) {
    var new_id = new Date().getTime();
    var regexp = new RegExp("new_" + association, "g");
    var $target = present(target) ? $(target) : $(link).parent();
    $target.before( content.replace(regexp, new_id) );
    $(document).trigger('add_fields', {association: association, id: new_id});
}

function add_fields_to_table(link, association, content, target) {
    var new_id = new Date().getTime();
    var regexp = new RegExp("new_" + association, "g");
    var $target = present(target) ? $(target) : $(link).parent();
    $target.append( content.replace(regexp, new_id) );
    $(document).trigger('add_fields', {association: association, id: new_id});
}


// remove fields with confirmation
function remove_fields_confirm(link, closest_class_or_el) {
    if ( confirm("You sure?") ) {
        if ( blank(closest_class_or_el) ) { closest_class_or_el = '.fields'; }
        $(link).prev("input[type=hidden]").val("1").end().closest(closest_class_or_el).hide();
    }
}

// This will display a gmail like notification at the top of a page.
// +message+ is the message that will be displayed to the user.
// +options+ is a hash of options (see code below to see what is supported).
function simple_alert(message, options) {
    // If there is no message throw an error.
    if ( blank(message) ) {
        throw new Error("No message passed into SimpleAlert!");
    }

    // Set up the options
    options = options || {};

    var opts = $.extend({}, {
        parentId : 'body',
        autoHide : 5000,
        id       : new Date().getTime(),
        class    : 'g-alert'
    }, options);

    // Need it to be this way so user can change one css property
    // without destroying all of them.
    opts.css = $.extend({}, {
        'background-color' : '#fce483', //#fff1a8
        'color'            : '#3d4545', //#222
        'white-space'      : 'nowrap',
        'border-color'     : '#fce483', //#f0c36d
        'top'              : '1%',
        'left'             : '40%',
        'z-index'          : $.maxZindex()+100,
        'position'         : 'fixed',
        'padding'          : '5px',
        'border-radius'    : '0.5em',
        'font-size'        : '16px',
        'font-weight'      : '400',
        'line-height'      : '24px'
    }, options.css||{});

    // Set up values that can't be over written
    opts.message = message;
    opts.$msg = $('<div />');

    opts.$msg.css(opts.css);
    opts.$msg.attr('id', opts.id);
    opts.$msg.addClass(opts.class);
    opts.$msg.html(opts.message);

    // If parent passed in, append it
    if ( present(opts.parentId) ) {
        $(opts.parentId).append(opts.$msg);
    }

    // If autoHide passed in, set the timer
    if ( present(opts.autoHide) ) {
        setTimeout(function () {
            opts.$msg.hide().remove();
        }, opts.autoHide);
    }

    // Return the dom message object if the user wants to do
    // other things with it.
    return opts.$msg;
}

function redirect_to(path) {
    $(window).unbind("beforeunload").unbind('unload').off('beforeunload').off('unload');
    window.location = path;
}

function remove_and_redirect_to(path){
    $(window).unbind("beforeunload").unbind('unload').off('beforeunload').off('unload');
    window.location.replace(path);
}

function pluralize(count, singular, plural) {
    return (count == 1 || /^1(\.0+)?$/gi.test(count)) ? singular : plural;
}

function pluralize_with_count(count, singular, plural) {
    return ''+count+' '+(pluralize(count, singular, plural))+'';
}

// see: http://stackoverflow.com/a/3479960/2258871
function pageHasFocus(){
    if (typeof document.hasFocus === 'undefined') {
        return document.visibilityState === 'visible';
    }

    return document.hasFocus();
}

// http://stackoverflow.com/a/11381730/989439
function isMobile() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function page_focus_scroll(parent, selectors, options){
    if ( blank(parent) ) { throw new Error('No parent target found!'); }
    var $parent = $(parent);
    selectors = blank(selectors) ? 'input:visible, select:visible, textarea:visible' : selectors.toString();
    var opts = $.extend({}, {
        scrollStop     : true,
        viewPortBottom : 50,
        viewPortTop    : 135,
        speed          : 800
    }, options||{});

    $parent
        .on('focus', selectors, function(ev){
            try{
                if ( ev.which === 1 ) { return; }

                var $el = $(this);
                var el = $el.offset();
                el.bottom = el.top + $el.outerHeight();
                var win3 = $(window).height()/3;
                var viewPortBottom = ViewPort.bottom();
                var viewPortTop = ViewPort.top();

                if ( (viewPortBottom-opts.viewPortBottom) < el.top ) {
                    $('html, body').animate({ scrollTop: (el.top - (win3+win3)) }, opts.speed, 'swing');
                }
                else if ( (viewPortTop+opts.viewPortTop) > el.bottom ) {
                    $('html, body').animate({ scrollTop: (el.top - (win3)) }, opts.speed, 'swing');
                }
            }
            catch(e){
                console.error("Error with scroll focus::"+e.message);
            }
        })
    ;

    if ( opts.scrollStop ) {
        $parent
            // Stop the animation from preventing the user from scrolling up/down the page
            // see: http://stackoverflow.com/a/22518932
            // see: https://api.jquery.com/stop/
            .on('mousewheel DOMMouseScroll', function(evt){
                $('html, body').stop();
            })
        ;
    }
}

function validate_vin(vin, callback){
    var isValidVin = simple_vin_validation(vin);
    // Feature: Add more complex vin validation checking.
    if ( isFunction(callback) ) { callback(isValidVin); }
    return isValidVin;
}

function simple_vin_validation(vin){
    var v = vin.toString().strip().split('');

    if ( v.length !== 17 ) {
        console.log("Vin failed validation: number of chars: "+ v.length+"");
        return false;
    }

    // For 1-8, can't have 'I', 'O', or 'Q'
    for(var v1 = 0; v1 < 8; v1++) {
        if ( /(i|o|q)/gi.test(v[v1]) ) {
            console.log("Vin failed validation: 1-8: "+v1+": "+v[v1]+"");
            return false;
        }
    }

    // For 9, only 0-9 and 'X' are allowed
    if ( !/([0-9]|x)/gi.test(v[8]) ) {
        console.log("Vin failed validation: 9: 8: "+v[8]+"");
        return false;
    }

    // For 10, can't have 'I', 'O', 'Q', 'U', 'Z', '0'
    if ( /(i|q|u|z|0)/gi.test(v[9]) ) {
        console.log("Vin failed validation: 10: 9: "+v[9]+"");
        return false;
    }

    // For 11-14, can't have 'I', 'O', 'Q'
    for(var v2 = 10; v2 < 14; v2++) {
        if ( /(i|o|q)/gi.test(v[v2]) ) {
            console.log("Vin failed validation: 11-14: "+v2+": "+v[v2]+"");
            return false;
        }
    }

    // For 15-17, only 0-9
    for(var v3 = 14; v3 < 17; v3++) {
        if ( !/[0-9]/gi.test(v[v3]) ) {
            console.log("Vin failed validation: 15-17: "+v3+": "+v[v3]+"");
            return false;
        }
    }

    // This vin passes
    return true;
}
//
function check_form_fields(which_form){
    $(which_form).find(':input').each(function() {
        if ($(this).val() != '') {
            $('label[for="'+$(this).attr('id')+'"]').addClass('active');
        }
    });
}