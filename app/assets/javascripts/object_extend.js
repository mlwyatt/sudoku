// String
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.upcase = function(){
    return this.toUpperCase();
};

String.prototype.downcase = function(){
    return this.toLowerCase();
};

String.prototype.strip = function(){
    return this.replace(/(^\s+|\s$)/gi, '');
};


// Array
Array.prototype.compact = function(){
    var ca = [];

    for(var i in this){
        if (this.hasOwnProperty(i)) {
            if ( present(this[i]) ) {
                ca.push(this[i]);
            }
        }
    }

    return ca;
};