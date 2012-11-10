// provide console.debug in IE 10
if (self.console && !self.console.debug) { self.console.debug = self.console.info; }

/*
 * Courtesy Allen Wirfs-Brock
 * http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
 */
// emulate legacy getter/setter API using ES5 APIs
try {
   if (!Object.prototype.__defineGetter__ &&
        Object.defineProperty({},"x",{get: function(){return true}}).x) {
      Object.defineProperty(Object.prototype, "__defineGetter__",
         {enumerable: false, configurable: true,
          value: function(name,func)
             {Object.defineProperty(this,name,
                 {get:func,enumerable: true,configurable: true});
      }});
      Object.defineProperty(Object.prototype, "__defineSetter__",
         {enumerable: false, configurable: true,
          value: function(name,func)
             {Object.defineProperty(this,name,
                 {set:func,enumerable: true,configurable: true});
      }});
   }
} catch(defPropException) {/*Do nothing if an exception occurs*/};

try {
   if (!String.prototype.trimLeft) {
       String.prototype.trimLeft = function () {
           var s = '' + this;

           return s.replace(/^\s*/, '');
       };
   }
} catch(e) {/*Do nothing if an exception occurs*/};

try {
   if (!String.prototype.trimRight) {
       String.prototype.trimRight = function () {
           var s = '' + this;

           return s.replace(/\s*$/, '');
       };
   }
} catch(e) {/*Do nothing if an exception occurs*/};
