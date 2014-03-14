/********************************Function throttle********************************
 * Implements a throttle function that restricts it's repeated calls to one per 
 * time window defined in user's arguments. This implementation contains a 
 * argument passing mechanism even if the calls can't pass arguments at all!
 * Moreover, we can pass the context that 'this' refers to inside the function!
 * @module {g3}
 * @function {g3.throttle}
 * @public
 * @param {Function} 'func' is the function that eventually is been called.
 * @param {Object} An object consisting of properties as options
 * - 'delay': (Number) is the minimum delay in milliseconds that we want this 
 *      function to execute, 
 * - 'context': (Object) is the context under which the function will be 
 *      executed. if it is omitted then the function is called as usual,
 * - 'fireFirst': (Boolean) if we want the first call to happen and then after 
 *      'delay' ms, defaults to true,
 * - 'fireLast': (Boolean) if we want the last call to happen 'delay' ms after
 *      the last call, defaults to true.
 * @return {Anything} Anything that the passed function returns.
 *
 * @version 0.2
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 ******************************************************************************/
(function(g3, $, window, document, undefined){
   g3.throttle = function(func, options, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9){
      var state = {
         pid: null,
         last: 0
      };
      if(typeof func !== 'function')
         return null;
      if(!options || (typeof options.delay !== 'number'))
         return func;
      //default options.fireFirst
      if(typeof options.fireFirst === 'undefined')
         options.fireFirst = true;
      //default options.fireLast
      if(typeof options.fireLast === 'undefined')
         options.fireLast = true;
      
      //usually 'callback()' is called without arguments, a.k.a event handler!
      //but, arguments do passed through the closure above!
      //we use Function.call() instead of Function.apply() because named 
      //arguments do cover the sooo poor case of just an array argument that 
      //Function.apply() imposes(!!)
      function callback(){
         var elapsed = new Date().getTime() - state.last;
         function exec(){
            state.last = new Date().getTime();
            if(!options.context || (typeof options.context != 'object'))
               return func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
            else
               return func.call(options.context, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
         }
         //execute immediately
         if(elapsed > options.delay){
            if((state.last > 0) || (options.fireFirst === true))
               exec();
            else
               state.last = 1;
         //reset & re-schedule execution
         }else if (options.fireLast === true){
            clearTimeout(state.pid);
            state.pid = setTimeout(exec, options.delay - elapsed);
         }
      }
      
      return callback;
   }
}(window.g3 = window.g3 || {}, jQuery, window, document));