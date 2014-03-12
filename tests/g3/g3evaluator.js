/*********************************Object evaluator******************************
 * A graphical client testing tool for batch processing javascript commands.
 * It uses eval() and emulates console.log() in all clients even in IE browsers.
 * @module {g3.evaluator}
 *
 * @version 0.1.3
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
*******************************************************************************/
(function(g3, $, window, document, undefined){
/*
 * Add necessary functions from 'g3.utils' namespace.
 */
g3.utils = g3.utils || {};
g3.utils.randomString = (typeof g3.utils.randomString === 'function')? g3.utils.randomString: function(len, charSet){
   charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var result = '', ndx;
   for (var i = 0; i < len; i++){
      ndx = Math.floor(Math.random() * charSet.length);
      result += charSet.substring(ndx, ndx+1);
   }
   return result;
};
/*
 * deprecated
 */
g3.utils.createScriptNode = (typeof g3.utils.createScriptNode === 'function')? g3.utils.createScriptNode: function(text, tag, src, type, id, win){
   var obj = text;
   //overwrite arguments in case of a first argument object
   if(typeof obj === 'object'){
      tag = obj.tag;
      src = obj.src;
      type = obj.type;
      id = obj.id;
      win = obj.win;
      text = obj.text; //always last!
   }
   if(!win || (win.self !== win) || !(win.window == win))
      win = window;
   //convert 'tag' to node reference
   if(!tag)
      tag = 'head';
   if(typeof tag === 'string'){
      tag = tag.toLowerCase();
      if((tag !== 'head') && (tag !== 'body'))
         tag = win.document.getElementsByTagName('head')[0];
      else
         tag = win.document.getElementsByTagName(tag)[0];
   }
   if(!tag.nodeType || (typeof text !== 'string'))
      return false;
   try{
      var script = win.document.createElement('script');
      script.setAttribute('type', type);
      //attention: error in FF if an empty src is set!
      if(src) script.setAttribute('src', src);
      script.setAttribute('id', id);
   }catch(e){
      return false;
   }
   try{
      script.appendChild(win.document.createTextNode(text));
      //script.innerHTML = text;
   }catch(e){
      try{
         script.text = text;
      }catch(e){
         return false;
      }
   }
   tag.appendChild(script);
   return script;
};
/*
 * deprecated
 */
g3.utils.createStyleNode = (typeof g3.utils.createStyleNode === 'function')? g3.utils.createStyleNode: function(cssText, tag, media, type, id, win){
   var obj = cssText;
   //overwrite arguments in case of a first argument object
   if(typeof obj === 'object'){
      tag = obj.tag;
      media = obj.media;
      type = obj.type;
      id = obj.id;
      win = obj.win;
      cssText = obj.cssText; //always last!
   }
   if(!win || (win.self !== win) || !(win.window == win))
      win = window;
   //convert 'tag' to node reference
   if(!tag)
      tag = 'head';
   if(typeof tag === 'string'){
      tag = tag.toLowerCase();
      if((tag !== 'head') && (tag !== 'body'))
         tag = win.document.getElementsByTagName('head')[0];
      else
         tag = win.document.getElementsByTagName(tag)[0];
   }
   if(!tag.nodeType || (typeof cssText !== 'string'))
      return false;
   try{
      var style = win.document.createElement('style');
      style.setAttribute('type', type);
      style.setAttribute('media', media);
      style.setAttribute('id', id);
   }catch(e){
      return false;
   }
   try{
      //also covers WebKit hack :(
      style.appendChild(win.document.createTextNode(cssText));
      //style.innerHTML = cssText;
   }catch(e){
      try{
         style.styleSheet.cssText = cssText;
      }catch(e){
         return false;
      }
   }
   tag.appendChild(style);
   return style;
};
/*
 * deprecated
 */
g3.utils.createLinkNode = (typeof g3.utils.createLinkNode === 'function')? g3.utils.createLinkNode: function(tag, media, type, id, rel, href, win){
   var obj = tag;
   //overwrite arguments in case of a first argument object
   if(typeof obj === 'object' && !tag.nodeType){
      tag = obj.tag;
      media = obj.media;
      type = obj.type;
      id = obj.id;
      rel = obj.rel;
      href = obj.href;
      win = obj.win;
      tag = obj.tag; //always last!
   }
   if(!win || (win.self !== win) || !(win.window == win))
      win = window;
   //convert 'tag' to node reference
   if(!tag)
      tag = 'head';
   if(typeof tag === 'string'){
      tag = tag.toLowerCase();
      if((tag !== 'head') && (tag !== 'body'))
         tag = win.document.getElementsByTagName('head')[0];
      else
         tag = win.document.getElementsByTagName(tag)[0];
   }
   if(!tag.nodeType || !href || (typeof href !== 'string'))
      return false;
   try{
      var link = win.document.createElement('link');
      link.setAttribute('media', media);
      link.setAttribute('type', type);
      link.setAttribute('id', id);
      link.setAttribute('rel', rel);
      link.setAttribute('href', href);
      tag.appendChild(link);
   }catch(e){
      return false;
   }
   return link;
};

/*********************************Object evaluator******************************
 * A graphical client testing tool for batch processing javascript commands.
 * It uses eval() and emulates console.log() in all clients even in IE browsers.
 * @module {g3.evaluator}
 * @function {g3.evaluator.getInstance}
 * @constructor
 * @return {Object} It builds the node tree and assigns events on nodes.
 * @object {g3.evaluator.getInstance().console}
 * @public
 * @function {g3.evaluator.getInstance().console.log}
 * @public
 * User's batch commands that contain the string 'console.log(value, n, force)' 
 * are sent to this function that a) calls native 'console.log(value)' and 
 * b) sends output of 'g3.debug(value, n, force)' to page's console area.
 * @param {Type} 'value' an identifier of any type that we want to be analysed.
 * @param {Number} 'n' the depth of the analysis for complex types.
 * @param {Boolean} 'force' if true, analysis will happen in all other cases,
 * a) natives 'boolean', 'string', 'undefined', 'null', 'number', 'date' and 
 * 'regexp' are not analysed and b) 'object', 'function' and 'array' are 
 * analysed (see g3.debug).
 * @return {Object} The console object.
 * @function {g3.evaluator.getInstance().$load}
 * @public
 * Load a file with JQuery's '$.load()' method and add all it's contents in a 
 * given node.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that will hold the file's contents.
 * @param {String} 'url' the file's path.
 * @param {String|Object} 'data' to be sent to the server.
 * @param {Function} 'complete' is a function callback.
 * @return {Object} The evaluator object.
 * @function {g3.evaluator.getInstance().loadFrame}
 * @public
 * Create an iframe inside the given selector node and load the page with the 
 * given url.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that will hold the iframe.
 * @param {String} 'src' the file's path.
 * @return {Object} The evaluator object.
 * @function {g3.evaluator.getInstance().deleteFrame}
 * @public
 * Delete the iframe loaded with g3.evaluator.getInstance().loadFrame().
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that holds the iframe.
 * @return {Object} The evaluator object.
 * @function {g3.evaluator.getInstance().cloneFrame}
 * @public
 * a) Load an html file to an iframe, b) copy all contents from the frame's body 
 * to the passed selector node, c) copy all contents from the frame's header 
 * to the evaluator's header and d) delete the iframe.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that will hold the iframe.
 * @param {String} 'src' the file's path.
 * @return {Object} The evaluator object.
 * @function {g3.evaluator.getInstance().removeCloned}
 * @public
 * a) Deletes all of the cloned frame's body contents inside the selector node 
 * and b) deletes all of the cloned frame's header contents from the evaluator's 
 * header.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that holds the cloned frame's body contents.
 * @return {Object} The evaluator object.
 * @function {g3.evaluator.getInstance().calledFromFrame}
 * @public
 * It is called from a page that will be cloned having been loaded to an iframe.
 * @param {String|Object} 'selector' is a css selector string or another JQuery 
 * object or a node reference that holds the cloned frame's body contents.
 * @return {undefined}.
*******************************************************************************/
g3.evaluator = (function(){   
   var evaluator;
   /*
    * initialization function:
    * contains event handlers and tree manipulation
    */
   function init(){
      /*
       * 'global' variables
       */
      var nodes = {
         $console: $("form#console pre"), /*see evaluator.console*/
         $frameSrc: $("form#loadFrame input[type='text']"), /*see 'load/remove frame button actions'*/
         frameParent: $('#stub').get(0),
         $excludeNodes: $("form#bodyHtml input[type='text']"), /*see 'load body html button actions'*/
         $name: $('form#addRemoveLib #libName'), /*see 'add/remove library button actions'*/
         $path: $('form#addRemoveLib #libPath'),
         $title: $('form#blackboard input#title'), /*see 'blackboard button actions'*/
         $panel: $('form#addRemovePanel #panelTitle'), /*see 'add/remove panel button actions'*/
         $blackboard: $('#blackboard textarea') /*see 'load to blackboard behaviour'*/
      };
      
      /*
       * evaluation function
       * execution context: Function code
       * variable object: Activation object
       * ref.: http://perfectionkills.com/understanding-delete/
       */
      function evalExpr(value, win){
         if(win && (win.self === win) && (win.window == win))
            value = 'window = win;' + value;
         var re = /console.log/g;
         value = value.replace(re, 'evaluator.console.log');
         try{
            eval(value);
         }catch(e){
            //alert(e);
            throw e;
         }
      }
      window.onerror = printError;
      function printError(msg, url, line){
         evaluator.console.log(msg+'\nat: '+url+'\nline: '+line);
         return true;
      }
      
      /*
       * set/edit title
       */
      document.title = $("#title h1").text();
      $("#title span").click(function(){
         $(this).toggleClass('edit');
         if($(this).hasClass('edit'))
            $(this).siblings('h1').prop('contenteditable', 'true');
         else{
            $(this).siblings('h1').prop('contenteditable', 'false');
            //$('title', document.getElementsByTagName('head')[0]).text($(this).siblings('h1').text());
            document.title = $("#title h1").text();
         }
      });
      
      /*
       * load/remove frame button actions
       */
      $("form#loadFrame legend").click(function(){
         $("form#loadFrame div").slideToggle();
      });
      $("form#loadFrame button, form#loadFrame input[type='button']").click(function(event){
         if($(this).val() === 'Load file in frame'){
            evaluator.loadFrame(nodes.frameParent, nodes.$frameSrc.val());
            //$('<iframe>').addClass('frame').prop('src', nodes.$frameSrc.val()).appendTo('#stub');
         }else if($(this).val() === 'Remove frame'){
            evaluator.deleteFrame(nodes.frameParent);
            //$('#stub iframe').remove();
         }else if($(this).val() === 'Clone frame to stub (JQuery)'){
            evaluator.$load(nodes.frameParent, nodes.$frameSrc.val(), {});
         }else if($(this).val() === 'Clone frame to stub-HEAD'){
            evaluator.cloneFrame(nodes.frameParent, nodes.$frameSrc.val());
         }else if($(this).val() === 'Remove cloned'){
            evaluator.removeCloned(nodes.frameParent);
         }
      });
      
      /*
       * load body html button actions
       */
      $("form#bodyHtml legend").click(function(){
         $("form#bodyHtml div").slideToggle();
      });
      $("form#bodyHtml button, form#bodyHtml input[type='button']").click(function(event){
         if($(this).val() === 'Load'){
            var txt = '';
            var excl = nodes.$excludeNodes.val().split(/\s+|\s*,\s*|\s*;\s*|\s*\|\s*/);
            var $excl = $(document.body).contents().not('script');
            for(var i = 0; i < excl.length; i++)
               $excl = $($excl.not(document.getElementById(excl[i])));
            $excl.each(function(){
               txt += this.outerHTML;
            });
            $(event.target).siblings('textarea').val(txt);
            // deprecated
            //$(event.target).siblings('textarea').val(g3.utils.varInnerHTML(document.body, excl));
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('');
         }
      });
      
      /*
       * add/remove library button actions:
       * label's text will become the script's id and
       * input's value will become the script's path
       */
      $("form#addRemoveLib legend").click(function(){
         $("form#addRemoveLib div").slideToggle();
      });
      $("form#addRemoveLib button, form#addRemoveLib input[type='button']").click(function(event){
         if($(this).val() === 'Add'){
            var found = false;
            if(nodes.$name.val()){
               $('form#libraries label').each(function(){
                  if($(this).text() === nodes.$name.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  var id = g3.utils.randomString(5);
                  var txt = '<label class="label" for="' + id + '">' +
                            nodes.$name.val() +'</label><input type="checkbox" id="' +
                            id + '" value="' + nodes.$path.val() + '" /><br />';
                  $("#libraries fieldset").append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            var found = -1;
            if(nodes.$name.val()){
               $('form#libraries label').each(function(ndx){
                  if($(this).text() === nodes.$name.val()){
                     found = ndx;
                     return false;
                  }
               });
               if(found > -1){
                  $("form#libraries label").eq(found).next('input').addBack().next('br').addBack().remove();
               }
            }
         }
      });
      
      /*
       * library check box behaviours
       */
      $("#libraries input").prop('checked', false);
      $("#libraries").on('change', 'input', function(event){
         $("#libraries input").each(function(){
            //var $script = $('script[id=\'' + $(this).val() + '\']');
            //label's text is the script's id
            var $script = $(document.getElementById($(this).prev().text()));
            if($script.length === 0 && $(this).prop("checked")){
               //$("body").append($("<script />", {'id': $(this).prev().text(), 'src': $(this).val()}));
               var s = document.getElementsByTagName('body')[0].appendChild(document.createElement('script'));
               s.type = 'text/javascript';
               //input's value is the script's path
               s.src = $(this).val();
               //label's text is the script's id
               s.id = $(this).prev().text();
            }
            if($script.length > 0 && !$(this).prop( "checked" ))
               $script.remove();
         });
      }).change();
      
      /*
       * private variables for active panel, tab and data
       */
      var panelState = {
         $tabbedData: null, /*the active panel*/
         $tab: null, /*the active tab*/
         $data: null /*the data of the active tab*/
      };
      
      /*
       * state of common buttons 'save' and 'save as': 0-disabled, 1-enabled
       * and a handler 'apply()' that accepts a 'state' object as argument
       */
      var buttonState = {
         buttons: {
            save: null,
            saveAs: null
         },
         state: {
            save: 0,
            saveAs: 0
         },
         //apply/remove 'disabled' property on buttons
         apply: function(obj){
            if(obj){
               this.state.save = obj.save;
               this.state.saveAs = obj.saveAs;
            }
            if(this.state.save === 0)
               $(this.buttons.save).prop('disabled', 'disabled');
            else
               $(this.buttons.save).removeAttr('disabled');
            if(this.state.saveAs === 0)
               $(this.buttons.saveAs).prop('disabled', 'disabled');
            else
               $(this.buttons.saveAs).removeAttr('disabled');
            return this;
         },
         //create object references to actual buttons
         init: function(){
            var self = this;
            $("form#blackboard button, form#blackboard input[type='button']").each(function(){
               if($(this).val() === 'Save')
                  self.buttons.save = this;
               if($(this).val() === 'Save to a new tab')
                  self.buttons.saveAs = this;
            });
            return this;
         }
      };
      
      /*
       * equal board height check box behaviour
       */
      $("#boardHeights").prop('checked', false);
      $("#boardHeights").on('change', function(event){
         if($(this).prop('checked'))
            $('#boardWrapper > *').each(function(){
               $(this).addClass('height');            
            });
         else
            $('#boardWrapper > *').each(function(){
               $(this).removeClass('height');            
            });
      }).change();
      
      /*
       * disable buttons initially
       */
      if(!panelState.$tabbedData){
         buttonState.init().apply();
      }
      
      /*
       * blackboard button actions
       */
      $("form#blackboard button, form#blackboard input[type='button']").click(function(event){
         if($(this).val() === 'Execute!'){
            evaluator.console.pile = false;
            evalExpr($(event.target).siblings('textarea').val());
         }else if(panelState.$data && $(this).val() === 'Save'){
            if(!nodes.$title.val() || (nodes.$title.val() !== panelState.$tab.text())){
               nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \''+panelState.$tab.text()+'\' (click to load)</span></span>');
            }else
               panelState.$data.find('pre').text($(event.target).siblings('textarea').val());
         }else if(panelState.$tabbedData && ($(this).val() === 'Save to a new tab')){
            //find tab info at closest parent
            var titles = [], $tabs, length = 1;
            if(panelState.$tab)
               $tabs =  panelState.$tab.closest('.tabs');
            else
               $tabs = $('.tabs', panelState.$tabbedData).eq(0);
            $tabs.find('.tab').each(function(){
               titles.push($(this).text());
            });
            length += $('.tab', $tabs).length;
            if(!nodes.$title.val() || ($.inArray(nodes.$title.val(), titles) >= 0)){
               if(nodes.$title.next('#message').length == 0)
                  nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \'Tab '+length+'\' (click to load)</span></span>');
            }else{
               $tabs.append('<div class="tabBar"><div class="tab">' + nodes.$title.val() + '</div><div class="close">X</div></div>');
               var $newData;
               if(panelState.$data)
                  $newData = $('<div class="data"><pre></pre></div>').appendTo(panelState.$data.closest('.tabs'));
               else
                  $newData = $('<div class="data"><pre></pre></div>').appendTo($('.tabs', panelState.$tabbedData).eq(1));
               $('pre', $newData)
                  .html($(event.target).siblings('textarea').val());
               if(panelState.$tab)
                  $('pre', $newData).closest('.data').addClass('hide');
            }
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('');
         }
      });
      
      /*
       * console button actions
       */
       $("form#console button, form#console input[type='button']").click(function(event){
         if($(this).val() === 'Clear'){
            nodes.$console.html('');
         }
      });
      
      /*
       * add/remove panel button actions:
       * label's text will become the script's id and
       * input's value will become the script's path
       */
      $("form#addRemovePanel legend").click(function(){
         $("form#addRemovePanel div").slideToggle();
      });
      $("form#addRemovePanel button, form#addRemovePanel input[type='button']").click(function(event){
         if($(this).val() === 'Add'){
            var found = false;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(){
                  if($(this).text() === nodes.$panel.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  var txt = '<div class="gridTabbedData"><div class="tabbedData"><div class="titleBar"><p class="title">' +
                  nodes.$panel.val() + '</p><p class="load">Load tab</p></div><div class="tabs"></div><div class="tabs"></div></div></div>';
                  $('#tabbedDataWrapper').append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            var found = -1;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(ndx){
                  if($(this).text() === nodes.$panel.val()){
                     $(this).closest('.tabbedData').closest('.gridTabbedData').remove();
                     return false;
                  }
               });
            }
         }
      });
      
      /*
       * next to title error message behaviour
       */
      $('form#blackboard').on('click', 'span#suggestedTitle', function(){
            var tmp = $(this).text().match(/'(.*)'/);
            $('form#blackboard input#title').val(tmp[1]);
            $('form#blackboard #message').remove();
      });
      
      /*
       * equal panel height check box behaviour
       */
      $("#panelHeights").prop('checked', false);
      $("#panelHeights").on('change', function(event){
         if($(this).prop('checked'))
            $('.tabbedData').each(function(){
               $(this).addClass('height');            
            });
         else
            $('.tabbedData').each(function(){
               $(this).removeClass('height');            
            });
      }).change();
      
      /*
       * panel title behaviour: '.tabbedData .titleBar .title'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData' variable
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .title', function(event){
         //repeated clicks on panel title
         if(panelState.$tabbedData && (panelState.$tabbedData.find('.titleBar .title').is($(this))))
            return false;
         //enable 'save as' button
         buttonState.apply({saveAs: 1});
         $newTabbedData = $(this).closest('.tabbedData');
         //disable 'save' button and all panel title on first click (this title is set after)
         if(!panelState.$tabbedData){
            buttonState.apply({save: 0});
            $('.tabbedData .titleBar .title').removeClass('enabled');
         //disable 'save' button, previous panel title and tab title when a new panel is activated
         }else if(!$newTabbedData.is(panelState.$tabbedData)){
            buttonState.apply({save: 0});
            panelState.$tabbedData.find('.titleBar .title').removeClass('enabled');
            //panelState.$tabbedData.find('.titleBar .title').addClass('visited');
            //if a tab title fired this event, let private 'panelState.$tab' and 'panelState.$data' to 
            //be handled by it's handler else, nullify them here
            if(panelState.$tab && !event.tabbedData){
               panelState.$tab.removeClass('enabled');
               //panelState.$tab.addClass('visited');
               panelState.$tab = null;
               panelState.$data = null;
            }
         }
         //enable panel's title
         $(this).addClass('enabled');
         //define new private 'panelState.$tabbedData'
         panelState.$tabbedData = $newTabbedData;
      });
      
      /*
       * load to blackboard behaviour: '.tabbedData .titleBar .load'
       * delegator on '.tabbedDataWrapper'
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .load', function(){
         if(panelState.$tabbedData){
            var tmp = '';
            panelState.$tabbedData.find('.tabs .data').each(function(){
               if(!$(this).hasClass('hide'))
                  tmp += $(this).find('pre').text();
            });
            nodes.$blackboard.val(tmp);
            if(panelState.$tab)
               $('input#title').val(panelState.$tab.text());
         }
      });
      
      /*
       * tab title behaviours: '.tabbedData .tabs .tabBar .tab'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData', 'panelState.$tab' and 'panelState.$data' variables
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .tab', function(event){
         var $newTab = $(this);
         //toggle tab title and data on repeated clicks, also, if no tab is enabled 
         //then, nullify variables 'panelState.$tab' and 'panelState.$data' and disable 'save' button
         if(panelState.$tab && panelState.$tab.is($newTab)){
            panelState.$tab.toggleClass('enabled');
            if(panelState.$tab.hasClass('enabled')){
               $('.data', panelState.$tab.closest('.tabbedData')).each(function(){
                  if(panelState.$data.is($(this)))
                     panelState.$data.removeClass('hide');
                  else
                     $(this).addClass('hide');
               });
            }else{
               $('.data', panelState.$tab.closest('.tabbedData')).each(function(){
                  $(this).removeClass('hide');
               });
               buttonState.apply({save: 0});
               panelState.$tab = null;
               panelState.$data = null;
            }
            return false;
         }
         //trigger present panel title behaviour that defines new private 'panelState.$tabbedData'
         // $(this) === $(event.target);
         $newTab.closest('.tabbedData').find('.titleBar .title').trigger({
            type: 'click',
            tabbedData: 'custom'
         });
         //toggle tab title
         if(panelState.$tab){
            panelState.$tab.removeClass('enabled');
            //panelState.$tab.addClass('visited');
         }
         //define new private 'panelState.$tab'
         panelState.$tab = $newTab;
         panelState.$tab.addClass('enabled');
         //panelState.$tab.removeClass('visited');
         //enable buttons
         buttonState.apply({save: 1, saveAs: 1});
         //find tab index in closest parent
         var $tabs = $newTab.closest('.tabs');
         var tab;
         $('.tab', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //show relevant content at that index
         $('.data', panelState.$tabbedData).each(function(ndx){
            if(ndx === tab){
               //define new private 'panelState.$data'
               panelState.$data = $(this);
               panelState.$data.removeClass('hide');
            }else
               $(this).addClass('hide');
         });
      });
      
      /*
       * tab close behaviours: '.tabbedData .tabs .tabBar .close'
       * delegators on '.tabs' (do not alter private 'panelState.$tabbedData' variable)
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .close', function(event){
         //nullify sibling panelState.$tab and connected panelState.$data
         if($(this).siblings('.tab').is(panelState.$tab)){
            buttonState.apply({save: 0});
            panelState.$tab = null;
            panelState.$data = null;
         }
         //find tab index in closest parent
         var $tabs = $(this).closest('.tabs');
         var tab;
         $('.close', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //remove relevant data at that index
         $('.data', $tabs.closest('.tabbedData')).each(function(ndx){
            if(ndx === tab){
               $(this).remove();
               return false;
            }
         });
         //remove tab bar
         $(this).closest('.tabBar').remove();
      });
      
      var clonedOnce = false;
      var cloned = [];
      evaluator = {
         /*
          * generic console object with log function
          */
         console: {
            pile: false, //pile writing
            log: function(value, n, force){
               //IE8 returns form with id="console"!
               if(console && console.log)
                  console.log(value);
               if(!this.pile)
                  nodes.$console.html('');
               this.pile = true;
               //if(value && (typeof value === 'object'))
                  nodes.$console.html(nodes.$console.html() + g3.debug(value, n, force).toHtml());
               //else
               //   nodes.$console.html(nodes.$console.html() + value + '<br />');
               return this;
            }
         },
         $load: function(selector, url, data, complete){
            $(selector).load(url, data, complete).removeClass('hide');
            return this;
         },
         loadFrame: function(selector, src){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.loadFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            $('<iframe>').addClass('frame').prop('src', src).appendTo(node);
            $(node).removeClass('hide');
            return this;
         },
         //deletes only iframes
         deleteFrame: function(selector){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.deleteFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            $(node).children('iframe').remove();
            return this;
         },
         //deletes everything except iframes
         removeCloned: function(selector){
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.removeCloned() failed to find a node for passed selector: ' + selector);
               return this;
            }
            if(clonedOnce){
               for(var i = 0; i < cloned.length; i++)
                  $(cloned[i]).remove();
               cloned = [];
               clonedOnce = false;
            }
            $(node).contents().filter(function(){
               if(this.nodeName && this.nodeName.toLowerCase() === 'iframe')
                  return false;
               else
                  return true;
            }).remove();
            return this;
         },
         //once we clone, we can't re-clone before removing the cloned ones!
         cloneFrame: function(selector, src){
            if(clonedOnce){
               alert('Attention: delete cloned in stub-HEAD before re-cloning!');
               return this;
            }
            clonedOnce = true;
            var node = $(selector).get(0);
            if(!node){
               alert('Error in evaluator.cloneFrame() failed to find a node for passed selector: ' + selector);
               return this;
            }
            //Attention: nodes.frameParent instead of node is used by this.calledFromFrame() method
            nodes.frameParent = node;
            $('<iframe>').addClass('frame').prop('src', src).appendTo(node);
            return this;
         },
         //can't do anything before calling this.cloneFrame() method!
         //http://stackoverflow.com/questions/251420/invoking-javascript-code-in-an-iframe-from-the-parent-page
         calledFromFrame: function(){
            if(!clonedOnce)
               return this;
            var framewin = $(nodes.frameParent).children('iframe').get(0).contentWindow,
                head = document.getElementsByTagName('head')[0],
                frameHead = framewin.document.getElementsByTagName('head')[0];
            //copy all frame's body child nodes except scripts because aren't simple nodes:
            //all browsers fail when scripts from frame's body are added to a node!
            //$(framewin.document.body).contents().appendTo(nodes.frameParent);
            $(framewin.document.body).contents().filter(function(){
               if(this.nodeName && this.nodeName.toLowerCase() === 'script')
                  return false;
               else
                  return true;
            }).appendTo(nodes.frameParent);
            //now, copy scripts
            $(framewin.document.body).children().filter(function(){
               if(this.nodeName && this.nodeName.toLowerCase() === 'script')
                  return true;
               else
                  return false;
            }).each(function(){
               /* deprecated
               var args = {'text': $(this).html(), 'tag': nodes.frameParent, 'src': this.src, 'type': this.type, 'id': this.id};
               cloned.push(g3.utils.createScriptNode(args));
               */
               //attention: error in FF if an empty src is set!
               var tmp = (this.src)? $('<script>' + $(this).html() + '</script>').attr({'src': this.src, 'type': this.type, 'id': this.id}).appendTo(nodes.frameParent).get(0) : $('<script>' + $(this).html() + '</script>').attr({'type': this.type, 'id': this.id}).appendTo(nodes.frameParent).get(0);
               cloned.push(tmp);
            });
            //copy frame's head
            $(frameHead).children().each(function(){
               //copy styles
               if(this.nodeName.toLowerCase() === 'style'){
                  /* deprecated
                  var args = {'cssText': $(this).html(), 'tag': 'head', 'media': this.media, 'type': this.type, 'id': this.id};
                  cloned.push(g3.utils.createStyleNode(args));
                  */
                  cloned.push($('<style>' + $(this).html() + '</style>').attr({'media': this.media, 'id': this.id, 'type': this.type}).appendTo(document.getElementsByTagName('head')[0]).get(0));
               }
               //copy links
               if(this.nodeName.toLowerCase() === 'link'){
                  /* deprecated
                  var args = {'tag': 'head', 'media': this.media, 'type': this.type, 'id': this.id, 'rel': this.rel, 'href': this.href};
                  cloned.push(g3.utils.createLinkNode(args));
                  */
                  cloned.push($('<link></link>').attr({'media': this.media, 'id': this.id, 'type': this.type, 'rel': this.rel, 'href': this.href}).appendTo(document.getElementsByTagName('head')[0]).get(0));
               }
               //copy scripts: IE8 error when this.text() is used!
               if(this.nodeName.toLowerCase() === 'script'){
                  /* deprecated
                  var args = {'text': $(this).html(), 'tag': 'head', 'src': this.src, 'type': this.type, 'id': this.id};
                  cloned.push(g3.utils.createScriptNode(args));
                  */
                  var tmp = (this.src)? $('<script>' + $(this).html() + '</script>').attr({'src': this.src, 'type': this.type, 'id': this.id}).appendTo(document.getElementsByTagName('head')[0]).get(0) : $('<script>' + $(this).html() + '</script>').attr({'type': this.type, 'id': this.id}).appendTo(document.getElementsByTagName('head')[0]).get(0);
                  cloned.push(tmp);
               }
            });
            this.deleteFrame(nodes.frameParent);
            $('#stub').removeClass('hide');
         }
      };
      return evaluator;
   }
   return {
      getInstance: function(){
         if(evaluator)
            return evaluator;
         else
            return init();
      }
   };
})();
}(window.g3 = window.g3 || {}, jQuery, window, document));