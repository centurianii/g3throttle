/**
 * Javascript debugger for printing native types (number, boolean, string, date, 
 * array), functions and objects of any type native, host or custom in the form
 * of:
 * 'value' for simple types or, 
 * '[depth] key -> value' for complex ones.
 *
 * @version 0.1.4
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 */
(function(g3, $, window, document, undefined){
/*
 * Add necessary functions from 'g3.utils' namespace.
 */
   g3.utils = g3.utils || {};
g3.utils.typeOf = (typeof g3.utils.typeOf === 'function')? g3.utils.typeOf : function(value) {
   var s = typeof value;
   if (s === 'object') {
      if (value) {
         if (Object.prototype.toString.call(value) === Object.prototype.toString.call([])) { //'[object Array]'
            s = 'array';
         }
      } else {
         s = 'null';
      }
   }
   return s;
};
g3.utils.isEmptyObject = (typeof g3.utils.isEmptyObject === 'function')? g3.utils.isEmptyObject : function(obj){
   var result = true;
   if(obj === null)
      return result;
   if((typeof obj === 'object') || (typeof obj === 'function')){
      for(var prop in obj){
         if(Object.prototype.hasOwnProperty.call(obj, prop)){
            result = false;
            break;
         }
      }
      //overwrite previous result! (new ECMA 5 properties)
      //FF Error: returns 5 prototype properties on functions and 1 on arrays
      //as their own members!
      if((typeof Object.getOwnPropertyNames === 'function') && (g3.utils.typeOf(obj) === 'object')){
         result = (Object.getOwnPropertyNames(obj).length === 0);
      }
      return result;
   }
   return result;
};
g3.utils.type = (typeof g3.utils.type === 'function')? g3.utils.type : function (obj){
   if(obj === null)
      return 'null';
   else if(typeof obj === 'undefined')
      return 'undefined';
   return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
};
g3.utils.Array = (typeof g3.utils.Array === 'object')? g3.utils.Array : {
   indexOf: function(){
      if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)){
         Array.prototype.indexOf = function (searchElement, fromIndex){
            if ( this === undefined || this === null ){
               throw new TypeError( '"this" is null or not defined' );
            }
            var length = this.length >>> 0; // Hack to convert object.length to a UInt32
            fromIndex = +fromIndex || 0;
            if (Math.abs(fromIndex) === Infinity){
               fromIndex = 0;
            }
            if (fromIndex < 0){
               fromIndex += length;
               if (fromIndex < 0){
                  fromIndex = 0;
               }
            }
            for (;fromIndex < length; fromIndex++){
               if (this[fromIndex] === searchElement){
                  return fromIndex;
               }
            }
            return -1;
         };
      }
   }
};
g3.utils.Array.indexOf();
g3.utils.htmlList = (typeof g3.utils.htmlList === 'function')? g3.utils.htmlList : function(type) {
   if(!type || (g3.utils.typeOf(type) != 'string') || ((type.toLowerCase() != 'u') && 
     (type.toLowerCase() != 'o')) || (arguments.length <= 1))
      return false;
   var result = "<" + type.toLowerCase() + "l><li>";
   var args;
   if(g3.utils.typeOf(arguments[1]) === 'array')
      args = arguments[1];
   else
      args = Array.prototype.slice.call(arguments, 1);
   result += args.join("</li><li>");
   result += "</li></" + type.toLowerCase() + "l>";
   return result;
};
   
/*********************************Object debug()********************************
* Returns a stringify form of an object for debugging purposes. Internally, it 
* stores a flattened representation of the object's tree-structure.
* @module {g3.debug}
* @constructor
* @param {Object} 'obj' the object to stringify.
* @param {Number} 'maxDepth' the maximum depth to look for when a property is an 
* object reference which in turn can contain other object references. It's 
* 0-based starting with the first level childs.
* @param {Boolean} 'force' If it evaluates to true, it forces debugger to  
* analyse the first argument. Shouldn't need it any more because we test for 
* known types and force the rest objects to be analysed like in the case of host
* objects where previously they were reported as empty by 
* g3.utils.isEmptyObject(). 
* @return {Object} Returns an object. Circular references are not followed 
* because they are recognised on first meet. The internal structure that is 
* built is a flattened representation of a tree which is a 2-dimensional 
* array(i, j) whose index i stores a 3-cell linear sub-array where: i. index 0, 
* at (i, 0), keeps the depth of the current member, ii. index 1, at (i, 1), 
* keeps the name of the member and iii. index 2, at (i, 2), keeps the member's 
* value. 
* This representation exchibits some interesting behaviours:
* 1) Between two successive depths with the same value, n <- (i, 0) & (i+j, 0), 
* exist all members of the member-object at (i, 1) as in the following example:
* members-objects|(i+j,0)->depth|(i+j,1)->member|(i+j, 2)->value
* .............  | .........    | .........     | .........
* |--[a]         |(i,   0)->n   |(i,   1)->'a'  |(i,   1)->'custom object' <---|
* |   |--[b]     |(i+1, 0)->n+1 |(i+1, 1)->'b'  |(i+1, 1)->'custom object' \   | members of
* |   |   |--[c] |(i+2, 0)->n+2 |(i+2, 1)->'c'  |(i+2, 1)->'value of c'    |----
* |   |--[d]     |(i+3, 0)->n+1 |(i+3, 1)->'d'  |(i+3, 1)->'value of d'    /
* |--[e]         |(i+4, 0)->n   |(i+4, 1)->'e'  |(i+4, 1)->'value of e'
* ............   | .........    | .........     | .........
* 2) Similar, successive entries with the same depth n are all members of the 
* object at depth n-1 at the entry immediate before them. Example: at n+1 we can 
* see 2 members of an object at depth (n+1)-1 = n <- (i, 0).
* @function {g3.debug.toString}
* @public
* @return {String} A string representation of the structure based on key-value
* pairs in depth defined during construction. Each pair ends with a newline 
* character, i.e. '\n'.
* @function {g3.debug.toHtml}
* @public
* @return {String} An html representation of the structure based on key-value
* pairs in depth defined during construction. Each pair ends with a break 
* character, i.e. '<br \>'.
* @function {g3.debug.formatRow}
* @public
* Formats a single array that is passed as argument to an html string. It's a 
* helper function to be used by 'toHtml()' and 'popup()' methods.
* @param {Array} 'arr' A single array with 3 entries: [depth, key, value].
* @return {String} An html representation of the array entry. Newlines '\n' in 
* string values are converted to breaks, '<br \>'.
* @function {g3.debug.popup}
* @public
* Opens a new window and writes an html string with formation that follows the 
* passed argument.
* @param {String} 'tag' One of the strings: ['pre', 'o', 'u'] with default value 
* 'pre'.
* @return {Null}
*
* @author Scripto JS Editor by Centurian Comet.
* @copyright MIT licence.
*******************************************************************************/
   g3.debug = function(obj, maxDepth, force){ //construct with argument
      var tree = [], refs = [], max;
      refs.push( [ 0, obj ] );
      if((maxDepth === null) || (maxDepth === undefined))
         max = 0;
      else if((g3.utils.typeOf(maxDepth) === 'number') && (maxDepth >= 0))
         max = maxDepth;
      else
         max = -1;
      function traverse(obj, i){
         var value, str = '', tmp = '', circular, found, iterate = false;
         for (var property in obj){
            iterate = true;
            found = false;
            //case: Mozila's number-properties of 'style' object, ha-ha-ha!!!
            property += '';
            try{
               value = obj[property];
            }catch(e){
               str = [-1, 'Error:', e];
               //new record
               tree.push(str);
               break;
            }
            str = [i, property, value];
            //new record
            tree.push('');
            /* 1. not recursion
             * ----------------
             */
            if(value === null){
               tmp = 'null';
               found = true;
            }else if(g3.utils.typeOf(value) === 'undefined'){
               tmp = 'undefined';
               found = true;
            }else if(value === ''){
               tmp = '\'\'';
               found = true;
            }else if (g3.utils.typeOf(value) === 'boolean'){
               tmp = (value)?'\'true\'':'\'false\'';
               found = true;
            }else if (g3.utils.typeOf(value) === 'string'){
               tmp = '\'' + value + '\'';
               found = true;
            }else if (g3.utils.typeOf(value) === 'number'){
               tmp = value;
               found = true;
            }else if(g3.utils.typeOf(value) === 'array'){
               tmp = '[' + value + ']';
               found = true;
            }
            if(found){
               str[2] = tmp;
               tree[tree.length - 1] = str;
            /* 2. recursion or not?
             * --------------------
             */
            }else if ((g3.utils.typeOf(value) === 'function') || (g3.utils.typeOf(value) === 'object')){
               circular = false;
               for(var j = 0; j < refs.length; j++){
                  if(refs[j][1] === value){
                     if(refs[j][0] === 0)
                        tmp = '\'contains a circular reference to the passed object\'';
                     else
                        tmp = '\'contains a circular reference to object at index ' + (refs[j][0] + 1)+'\'';
                     circular = true;
                     break;
                  }
               }
               if(!circular){
                  if(g3.utils.typeOf(value) === 'object'){
                     refs.push( [ tree.length - 1, value ] );
                     tmp = '\'object\'';
                     if(value.toString)
                        tmp += value.toString() + '';
                  }else if(g3.utils.typeOf(value) === 'function'){
                     tmp = '\'function\'';
                     if(value.toString){
                        tmp += ' [' + value.toString().slice(0, value.toString().indexOf('{')+1).replace(/\n|\r|[\b]/g, '') + '...]';
                     }
                  }
               }
               str[2] = tmp;
               tree[tree.length - 1] = str;
               //recursion with new 2nd arg but keep original!
               if(!circular && ((max < 0) || (i < max))){
                  traverse(value, i+1);
               }
            /* 3. fallback
             * -----------
             */
            }else{ //some value check was missed!
               str[2] = 'value check was missed: ' + str[2];
               tree[tree.length - 1] = str;
            }
         }
         //even a debugger needs to be debugged! Not for production use!
         //new record
         /*if(!iterate){
            str = [i, '\'can\'t iterate on object/function\'', obj];
            tree.push(str);
         }*/
      };
      //never enters for..in loop on functions with no members, null, empty 
      //objects, empty arrays, booleans, dates, numbers and strings also,
      //'g3.utils.isEmptyObject()' fails on css host objects so we need 'force'
      /*if(!force && g3.utils.isEmptyObject(obj)){
         var str;
         if(typeof obj === 'undefined')
            str = 'undefined';
         else if(obj === null)
            str = 'null';
         else if(obj === '')
            str = '\'\'';
         else
            str = obj.toString();
         if(g3.utils.typeOf(obj) === 'array')
            str = '[]';
         else if(g3.utils.typeOf(obj) === 'object')
            str = '{}';
         else if(g3.utils.typeOf(obj) === 'function')
            str = 'function(){}';
         tree.push([null, null, str]);
      }else
         traverse(obj, 0);*/
      var natives = ['boolean', 'string', 'undefined', 'null', 'number', 'date', 'object', 'function', 'array', 'regexp'];
      if(!force && natives.indexOf(g3.utils.type(obj)) > -1){
         var str, tmp = ['boolean', 'string', 'number', 'date'];
         if(g3.utils.type(obj) === 'undefined')
            str = 'undefined';
         else if(g3.utils.type(obj) === 'null')
            str = 'null';
         else if(obj === '')
            str = '\'\'';
         else if(g3.utils.type(obj) === 'regexp')
            str = 'RegExp: '+ obj.toString();
         else if(tmp.indexOf(g3.utils.type(obj)) > -1)
            str = obj.toString();
         //it's one of array, object, function
         else if(g3.utils.isEmptyObject(obj)){
            if(g3.utils.type(obj) === 'array')
               str = '[]';
            else if(g3.utils.type(obj) === 'object')
               str = '{}';
            else if(g3.utils.type(obj) === 'function')
               str = 'function(){}';
         }else
            traverse(obj, 0);
         if(str)
            tree.push([null, null, str]);
      }else
         traverse(obj, 0);
      return {
         toString: function(){
            var tmp ='';
            for(var i = 0; i < tree.length; i++){
               if(tree[i][0] !== null)
                  tmp += '[' + tree[i][0] + '] ';
               if(tree[i][1] !== null)
                  tmp += tree[i][1] + ' -> ';
               tmp += tree[i][2] + '\n';
            }
            return tmp;
         },
         toHtml: function(){
            var tmp, start, end;
            if(tree.length > 1){
               tmp = '<ol style="padding: 0 40px;">';
               start = '<li>';
               end = '</li>';
            }else{
               tmp = start = '';
               end = '<br />';
            }
            for(var i = 0; i < tree.length; i++)
               tmp += start + '<span style="margin-left: '+tree[i][0]*2+'em">'+this.formatRow(tree[i])+'</span>' + end;
            if(tree.length > 1)
               tmp += '</ol>';
            return tmp;
         },
         formatRow: function(arr){
            var quotes = ['\'object\'', '\'function\'', 'circular reference'], 
            pos = -1, circular = false;
            if(arr[0] == -1)
               return '<span style="color: red">' + '[' + arr[0] + '] ' + arr[1] + ' -> ' + arr[2] + '</span>';
            for(var i = 0; i < quotes.length; i++){
               pos = (arr[2] + '').lastIndexOf(quotes[i]);
               if(pos >= 0){
                  if(i === 2)
                     circular = true;
                  break;
               }
            }
            if(pos >= 0)
               arr[2] = '<span style="color: ' + ((circular)? 'red': 'blue') + '">' + arr[2] + '</span>';
            //replace newlines in strings with breaks, '<br />' and '<' with '&lt;'
            else if(arr[2] && (typeof arr[2] === 'string'))
               arr[2] = arr[2].replace(/</gi, '&lt;').replace(/\n/g, '<br />');
               //arr[2] = arr[2].replace(/\n/g, '<br />');
            var tmp ='';
            if(arr[0] !== null)
               tmp += '[' + arr[0] + '] ';
            if(arr[1] !== null)
               tmp += arr[1] + ' -> ';
            tmp += arr[2];
            return tmp;
         },
         popup: function(tag){
            if(!tag || (typeof tag !== 'string'))
               tag = 'pre';
            tag = tag.toLowerCase();
            var tags = ['pre', 'o', 'u'];
            var found = false;
            for(var i = 0; i < tags.length; i++)
               if(tag === tags[i]){
                  found = true;
                  break;
               }
            if(!found)
               tag = 'pre';
            var w = window.open("about:blank");
            w.document.open();
            w.document.writeln("<HTML><BODY>");
            if(tag === 'pre'){
               w.document.writeln("<PRE>");
               w.document.writeln(this.toString());
               w.document.writeln("</PRE>");
            }
            if((tag === 'u') || (tag === 'o')){
               var list = [];
               for(var i = 0; i < tree.length; i++)
                  list[i] = '<span style="margin-left: '+tree[i][0]*2+'em">'+this.formatRow(tree[i])+'</span>';
               w.document.writeln(g3.utils.htmlList(tag, list));
            }
            w.document.writeln("</BODY></HTML>");
            w.document.close();
         }
      };
   };
}(window.g3 = window.g3 || {}, jQuery, window, document));
