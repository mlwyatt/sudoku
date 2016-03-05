var Ajax = function(args){
    if ( blank(args) ) {
        throw new Error("No arguments found for Ajax!");
    }

    // If the user wants to show a loading message at the top of the screen.
    if ( args.showLoading ) {
        var $alert = simple_alert('Loading...', {
            autoHide: 30000,
            css: {
                'display': 'none'
            }
        });

        // Make sure not to override passed in ajax calls
        var currentBeforeSend;
        if ( isFunction(args.beforeSend) ) {
            currentBeforeSend = args.beforeSend;
        }
        var beforeSend = function(jqXHR, settings){
            $alert.show();
            if ( isFunction(currentBeforeSend) ) {
                //currentBeforeSend.call(this, jqXHR, settings);
                currentBeforeSend(jqXHR, settings);
            }
        };
        var currentComplete;
        if ( isFunction(args.complete) ) {
            currentComplete = args.complete;
        }
        var complete = function(jqXHR, textStatus){
            $alert.hide().remove();
            if ( isFunction(currentComplete) ) {
                //currentComplete.call(this, jqXHR, textStatus);
                currentComplete(jqXHR, textStatus);
            }
        };

        args.beforeSend = beforeSend;
        args.complete = complete;
    }

    if ( !isFunction(args.error) ) {
        args.error = function(jqXHR, textStatus, errorThrown){
            alert("There was an error trying to reach the server. Please try again later.");
            console.log("AjaxError::"+textStatus+"::"+errorThrown+"");
        };
    }

    return jQuery.ajax(args);
};