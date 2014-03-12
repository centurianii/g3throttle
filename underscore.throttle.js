(function(_, $, window, document, undefined){
   _.now = Date.now || function() { return new Date().getTime(); };
   
   _.throttle = function(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      options || (options = {});
      var later = function() {
         previous = options.leading === false ? 0 : _.now();
         timeout = null;
         result = func.apply(context, args);
         context = args = null;
      };
      return function() {
         var now = _.now();
         if (!previous && options.leading === false) previous = now;
         var remaining = wait - (now - previous);
         context = this;
         args = arguments;
         if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            context = args = null;
         } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
         }
         return result;
      };
   };
}(window._ = window._ || {}, jQuery, window, document));