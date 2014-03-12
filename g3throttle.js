/********************************Function throttle********************************
 * Implements a throttle function that restricts it's repeated calls to one per 
 * time window defined in user's arguments. This implementation contains a 
 * argument passing mechanism even if the calls can't pass arguments at all!
 * Moreover, we can pass the context that 'this' refers to inside the function!
 * @module {g3}
 * @function {g3.throttle}
 * @public
 * @param {Function} 'func' is the function that eventually is been called.
 * @param {Integer} 'delay' is the minimum delay in milliseconds that we want 
 * this function to executes.
 * @param {Object} 'context' is the context under which the function will be 
 * executed. if it is omitted then the function is called as usual.
 * @return {Anything} Anything that the passed function returns.
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 ******************************************************************************/
(function(g3, $, window, document, undefined){
   g3.throttle = function(func, delay, context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9){
      var state = {
         pid: null,
         last: 0
      };
      if(typeof func !== 'function')
         return null;
      
      //usually 'callback()' is called without arguments, a.k.a event handler!
      //but, arguments do passed through the closure above!
      //we use Function.call() instead of Function.apply() because named 
      //arguments do cover the sooo poor case of just an array argument that 
      //Function.apply() imposes(!!)
      function callback(){
         var elapsed = new Date().getTime() - state.last;
         var self = this;
         function exec(){
            state.last = new Date().getTime();
            if((context === null) || (typeof context != "object"))
               return func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            else
               return func.call(context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
         }
         //execute immediately
         if(elapsed > delay){
            exec();
         //reset & re-schedule execution
         }else{
            clearTimeout(state.pid);
            state.pid = setTimeout(exec, delay - elapsed);
         }
      }
      
      return callback;
   }
}(window.g3 = window.g3 || {}, jQuery, window, document));