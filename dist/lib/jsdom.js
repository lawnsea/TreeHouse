
define('util',[],function () {
    function extend(target, source) {
        source = source || {};

        for (var k in source) {
            if (!target.hasOwnProperty(k)) {
                target[k] = source[k];
            }
        }
    }

    return {
        augment: function (target, source) {
            var k;

            for (k in source) {
                if (source.hasOwnProperty(k)) {
                    Object.defineProperty(target, k, Object.getOwnPropertyDescriptor(source, k));
                }
            }
        },

        // core.DOMException.prototype.__proto__ = Error.prototype;
        inherit: function (ctor, base, props) {
            var descriptors = {};
            var k;

            for (k in props) {
                if (props.hasOwnProperty(k)) {
                    descriptors[k] = Object.getOwnPropertyDescriptor(props, k);
                }
            }

            ctor.prototype = Object.create(base, descriptors);
            ctor.prototype.constructor = ctor;

        },

        updateProperty: function (obj, prop, descriptor) {
            extend(descriptor, Object.getOwnPropertyDescriptor(obj, prop));
            extend(descriptor, { enumerable: true, configurable: true });

            Object.defineProperty(obj, prop, descriptor);
        }
    };
});

define('jsdom/level1/core',['../../util'], function (util) {
    var exports = {};

    /*
      ServerJS Javascript DOM Level 1
    */
    var core = {

      mapper: function(parent, filter, recursive) {
        return function() {
          return core.mapDOMNodes(parent, recursive !== false, filter);
        };
      },

      // Returns Array
      mapDOMNodes : function(parent, recursive, callback) {
        function visit(parent, result) {
          return parent.childNodes.toArray().reduce(reducer, result);
        }

        function reducer(array, child) {
          if (callback(child)) {
            array.push(child);
          }
          if (recursive && child._childNodes) {
            visit(child, array);
          }
          return array;
        }

        return visit(parent, []);
      },

      visitTree: function(root, callback) {
        var cur = root; // TODO: Unroll this.

        function visit(el) {
          if (el) {
            callback(el);
            if (el._childNodes) {
              var i        = 0,
                  children = el._childNodes,
                  l        = children.length;

              for (i; i<l; i++) {
                visit(children[i]);
              }
            }
          }
        }
        visit(root);
      },

      markTreeReadonly: function(node) {
        function markLevel(el) {
          el._readonly = true;
          // also mark attributes and their children read-only
          if (el.attributes) {
            var attributes = el.attributes, l = attributes.length, i=0;
            attributes._readonly = true;

            for (i; i<l; i++) {
              core.visitTree(attributes[i], markLevel);
            }
          }
        }

        core.visitTree(node, markLevel);
      }
    };

    // ExceptionCode
    var INDEX_SIZE_ERR              = core.INDEX_SIZE_ERR              = 1,
        DOMSTRING_SIZE_ERR          = core.DOMSTRING_SIZE_ERR          = 2,
        HIERARCHY_REQUEST_ERR       = core.HIERARCHY_REQUEST_ERR       = 3,
        WRONG_DOCUMENT_ERR          = core.WRONG_DOCUMENT_ERR          = 4,
        INVALID_CHARACTER_ERR       = core.INVALID_CHARACTER_ERR       = 5,
        NO_DATA_ALLOWED_ERR         = core.NO_DATA_ALLOWED_ERR         = 6,
        NO_MODIFICATION_ALLOWED_ERR = core.NO_MODIFICATION_ALLOWED_ERR = 7,
        NOT_FOUND_ERR               = core.NOT_FOUND_ERR               = 8,
        NOT_SUPPORTED_ERR           = core.NOT_SUPPORTED_ERR           = 9,
        INUSE_ATTRIBUTE_ERR         = core.INUSE_ATTRIBUTE_ERR         = 10,

    // Node Types
        ELEMENT_NODE                = 1,
        ATTRIBUTE_NODE              = 2,
        TEXT_NODE                   = 3,
        CDATA_SECTION_NODE          = 4,
        ENTITY_REFERENCE_NODE       = 5,
        ENTITY_NODE                 = 6,
        PROCESSING_INSTRUCTION_NODE = 7,
        COMMENT_NODE                = 8,
        DOCUMENT_NODE               = 9,
        DOCUMENT_TYPE_NODE          = 10,
        DOCUMENT_FRAGMENT_NODE      = 11,
        NOTATION_NODE               = 12;

    var messages = core.exceptionMessages = { };
    messages[INDEX_SIZE_ERR]              = "Index size error";
    messages[DOMSTRING_SIZE_ERR]          = "DOMString size error";
    messages[HIERARCHY_REQUEST_ERR]       = "Hierarchy request error";
    messages[WRONG_DOCUMENT_ERR]          = "Wrong document";
    messages[INVALID_CHARACTER_ERR]       = "Invalid character";
    messages[NO_DATA_ALLOWED_ERR]         = "No data allowed";
    messages[NO_MODIFICATION_ALLOWED_ERR] = "No modification allowed";
    messages[NOT_FOUND_ERR]               = "Not found";
    messages[NOT_SUPPORTED_ERR]           = "Not supported";
    messages[INUSE_ATTRIBUTE_ERR]         = "Attribute in use";

    core.DOMException = function(code, message) {
      this.code = code;
      Error.call(this, core.exceptionMessages[code]);
      this.message = core.exceptionMessages[code];
      if(message) this.message = this.message + ": " + message;
      if(Error.captureStackTrace) Error.captureStackTrace(this, core.DOMException);
    };

    core.DOMException.INDEX_SIZE_ERR              = INDEX_SIZE_ERR;
    core.DOMException.DOMSTRING_SIZE_ERR          = DOMSTRING_SIZE_ERR;
    core.DOMException.HIERARCHY_REQUEST_ERR       = HIERARCHY_REQUEST_ERR;
    core.DOMException.WRONG_DOCUMENT_ERR          = WRONG_DOCUMENT_ERR;
    core.DOMException.INVALID_CHARACTER_ERR       = INVALID_CHARACTER_ERR;
    core.DOMException.NO_DATA_ALLOWED_ERR         = NO_DATA_ALLOWED_ERR;
    core.DOMException.NO_MODIFICATION_ALLOWED_ERR = NO_MODIFICATION_ALLOWED_ERR;
    core.DOMException.NOT_FOUND_ERR               = NOT_FOUND_ERR;
    core.DOMException.NOT_SUPPORTED_ERR           = NOT_SUPPORTED_ERR;
    core.DOMException.INUSE_ATTRIBUTE_ERR         = INUSE_ATTRIBUTE_ERR;

    util.inherit(core.DOMException, Error.prototype, {
      INDEX_SIZE_ERR              : INDEX_SIZE_ERR,
      DOMSTRING_SIZE_ERR          : DOMSTRING_SIZE_ERR,
      HIERARCHY_REQUEST_ERR       : HIERARCHY_REQUEST_ERR,
      WRONG_DOCUMENT_ERR          : WRONG_DOCUMENT_ERR,
      INVALID_CHARACTER_ERR       : INVALID_CHARACTER_ERR,
      NO_DATA_ALLOWED_ERR         : NO_DATA_ALLOWED_ERR,
      NO_MODIFICATION_ALLOWED_ERR : NO_MODIFICATION_ALLOWED_ERR,
      NOT_FOUND_ERR               : NOT_FOUND_ERR,
      NOT_SUPPORTED_ERR           : NOT_SUPPORTED_ERR,
      INUSE_ATTRIBUTE_ERR         : INUSE_ATTRIBUTE_ERR
    });

    core.NodeList = function NodeList(element, query) {
      this._element = element;
      this._query = query;
      this._version = -1;
      this.update();
    };
    core.NodeList.prototype = {
      update: function() {
        if (this._element && this._version < this._element._version) {
          for (var i = 0; i < this._length; i++) {
            this[i] = undefined;
          }
          var nodes = this._snapshot = this._query();
          this._length = nodes.length;
          for (var i = 0; i < nodes.length; i++) {
            this[i] = nodes[i];
          }
          this._version = this._element._version;
        }
        return this._snapshot;
      },
      toArray: function() {
        return this.update() || [];
      },
      get length() {
        this.update();
        return this._length || 0;
      },
      item: function(index) {
        this.update();
        return this[index] || null;
      },
      toString: function() {
        return '[ jsdom NodeList ]: contains ' + this.length + ' items';
      },
      indexOf: function(node) {
        var len = this.update().length;

        for (var i = 0; i < len; i++) {
          if (this[i] == node) {
            return i;
          }
        }

        return -1; // not found
      }
    };

    core.DOMImplementation = function DOMImplementation(doc, /* Object */ features) {
      this._ownerDocument = doc;
      this._features = {};

      if (features) {
        for (var feature in features) {
          if (features.hasOwnProperty(feature)) {
            this.addFeature(feature.toLowerCase(), features[feature]);
          }
        }
      }
    };

    core.DOMImplementation.prototype = {
      get ownerDocument() { return this._ownerDocument },
      removeFeature : function(feature, version) {
        feature = feature.toLowerCase();
        if (this._features[feature]) {
          if (version) {
            var j        = 0,
                versions = this._features[feature],
                l        = versions.length;

            for (j; j<l; j++) {
              if (versions[j] === version) {
                versions.splice(j,1);
                return;
              }
            }
          } else {
            delete this._features[feature];
          }
        }
      },

      addFeature: function(feature, version) {
        feature = feature.toLowerCase();

        if (version) {

          if (!this._features[feature]) {
            this._features[feature] = [];
          }

          if (version instanceof Array) {
            Array.prototype.push.apply(this._features[feature], version);
          } else {
            this._features[feature].push(version);
          }
        }
      },

      hasFeature: function(/* string */ feature, /* string */ version) {
        feature = (feature) ? feature.toLowerCase() : '';
        var versions = (this._features[feature]) ?
                        this._features[feature]  :
                        false;

        if (!version && versions.length && versions.length > 0) {
          return true;
        } else if (typeof versions === 'string') {
          return versions === version;
        } else if (versions.indexOf && versions.length > 0) {
           return versions.indexOf(version) !== -1;
        } else {
          return false;
        }
      }
    };


    var attrCopy = function(src, dest, fn) {
      if (src.attributes) {
        var attrs = src.attributes, i, l = attrs.length, attr, copied;
        for (i=0;i<l;i++) {
          attr = attrs[i];
          // skip over default attributes
          if (!attr.specified) {
            continue;
          }
          // TODO: consider duplicating this code and moving it into level2/core
          if (attr.namespaceURI) {
            dest.setAttributeNS(attr.namespaceURI,
                                         attr.nodeName,
                                         attr.nodeValue);
            var localName = attr.nodeName.split(':').pop();
            copied = dest.getAttributeNodeNS(attr.namespaceURI, localName);
          } else {
            dest.setAttribute(attr.nodeName, attr.nodeValue);
            copied = dest.getAttributeNode(attr.nodeName);
          }
          if (typeof fn == "function") {
            fn(attr, copied);
          }

        }
      }
      return dest;
    };

    core.Node = function Node(ownerDocument) {
      var self = this;

      this._childNodes = [];
      this._ownerDocument = ownerDocument;
      this._attributes = new core.AttrNodeMap(ownerDocument, this);

      this._childrenList = new core.NodeList(this, function() {
        return self._childNodes.filter(function(node) {
          return node.tagName;
        });
      });

      this._childNodesList = new core.NodeList(this, function() {
        return self._childNodes;
      });

      this._version = 0;
      this._nodeValue = null;
      this._parentNode = null;
      this._nodeName = null;
      this._readonly = false;
    };

    core.Node.ELEMENT_NODE                = ELEMENT_NODE;
    core.Node.ATTRIBUTE_NODE              = ATTRIBUTE_NODE;
    core.Node.TEXT_NODE                   = TEXT_NODE;
    core.Node.CDATA_SECTION_NODE          = CDATA_SECTION_NODE;
    core.Node.ENTITY_REFERENCE_NODE       = ENTITY_REFERENCE_NODE;
    core.Node.ENTITY_NODE                 = ENTITY_NODE;
    core.Node.PROCESSING_INSTRUCTION_NODE = PROCESSING_INSTRUCTION_NODE;
    core.Node.COMMENT_NODE                = COMMENT_NODE;
    core.Node.DOCUMENT_NODE               = DOCUMENT_NODE;
    core.Node.DOCUMENT_TYPE_NODE          = DOCUMENT_TYPE_NODE;
    core.Node.DOCUMENT_FRAGMENT_NODE      = DOCUMENT_FRAGMENT_NODE;
    core.Node.NOTATION_NODE               = NOTATION_NODE;

    core.Node.prototype = {
      _childNodes: null,
      _childNodesList: null,
      _childrenList: null,
      _version: 0,
      _nodeValue: null,
      _parentNode: null,
      _ownerDocument: null,
      _attributes: null,
      _nodeName: null,
      _readonly: false,
      style: null,
      ELEMENT_NODE                : ELEMENT_NODE,
      ATTRIBUTE_NODE              : ATTRIBUTE_NODE,
      TEXT_NODE                   : TEXT_NODE,
      CDATA_SECTION_NODE          : CDATA_SECTION_NODE,
      ENTITY_REFERENCE_NODE       : ENTITY_REFERENCE_NODE,
      ENTITY_NODE                 : ENTITY_NODE,
      PROCESSING_INSTRUCTION_NODE : PROCESSING_INSTRUCTION_NODE,
      COMMENT_NODE                : COMMENT_NODE,
      DOCUMENT_NODE               : DOCUMENT_NODE,
      DOCUMENT_TYPE_NODE          : DOCUMENT_TYPE_NODE,
      DOCUMENT_FRAGMENT_NODE      : DOCUMENT_FRAGMENT_NODE,
      NOTATION_NODE               : NOTATION_NODE,

      get children() {
        return this._childrenList;
      },
      get nodeValue() {
        return this._nodeValue;
      },
      set nodeValue(value) {
        // readonly
        if (this._readonly === true) {
            throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR,
                                        'Attempting to modify a read-only node');
        }

        this._nodeValue = value;
      },
      get parentNode() { return this._parentNode;},

      get nodeName() {
        var name = this._nodeName || this._tagName;
        if (this.nodeType === ELEMENT_NODE &&
            this._ownerDocument                  &&
            this._ownerDocument._doctype          &&
            this._ownerDocument._doctype.name.toLowerCase().indexOf("html") !== -1)
        {
          return name.toUpperCase();
        }
        return name;
      },
      set nodeName(value) { throw new core.DOMException();},
      get attributes() { return this._attributes;},
      get firstChild() {
        return this._childNodes.length > 0 ? this._childNodes[0] : null;
      },
      set firstChild(value) { throw new core.DOMException();},
      get ownerDocument() { return this._ownerDocument;},
      get readonly() { return this._readonly;},

      get lastChild() {
        var len = this._childNodes.length;
        return len > 0 ? this._childNodes[len -1] : null;
      },
      set lastChild(value) { throw new core.DOMException();},

      get childNodes() {
        return this._childNodesList;
      },
      set childNodes(value) { throw new core.DOMException();},

      _indexOf: function(/*Node*/ child) {
        if (!this._childNodes ||
        !this._childNodes.length) {
          return -1;
        }

        var currentNode, index = 0, children = this._childNodes;

        while ((currentNode = children[index])) {
          if (currentNode == child) {
            break;
          }
          index++;
        }

        if (currentNode == child) {
          return index;
        }
        return -1;
      },

      get nextSibling() {
        // find this node's index in the parentNode, add one and call it a day
        if (!this._parentNode || !this._parentNode._indexOf) {
          return null;
        }

        var index = this._parentNode._indexOf(this);

        if (index == -1 || index+1 >= this._parentNode._childNodes.length) {
          return null;
        }

        return this._parentNode._childNodes[index+1] || null;
      },
      set nextSibling(value) { throw new core.DOMException();},

      get previousSibling() {
        if (!this._parentNode || !this._parentNode._indexOf) {
          return null;
        }

        var index = this._parentNode._indexOf(this);

        if (index == -1 || index-1 < 0) {
          return null;
        }

        return this._parentNode._childNodes[index-1] || null;
      },
      set previousSibling(value) { throw new core.DOMException();},

      /* returns Node */
      insertBefore :  function(/* Node */ newChild, /* Node*/ refChild) {
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR, 'Attempting to modify a read-only node');
        }

        // Adopt unowned children, for weird nodes like DocumentType
        if (!newChild._ownerDocument) newChild._ownerDocument = this._ownerDocument;

        // TODO - if (!newChild) then?
        if (newChild._ownerDocument !== this._ownerDocument) {
          throw new core.DOMException(WRONG_DOCUMENT_ERR);
        }

        if (newChild.nodeType && newChild.nodeType === ATTRIBUTE_NODE) {
          throw new core.DOMException(HIERARCHY_REQUEST_ERR);
        }

        // search for parents matching the newChild
        var current = this;
        do {
          if (current === newChild) {
            throw new core.DOMException(HIERARCHY_REQUEST_ERR);
          }
        } while((current = current._parentNode));

        // fragments are merged into the element
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var tmpNode;
          while (newChild._childNodes.length > 0) {
            tmpNode = newChild.removeChild(newChild.firstChild);
            this.insertBefore(tmpNode, refChild);
          }
        } else {
          // if the newChild is already in the tree elsewhere, remove it first
          if (newChild._parentNode) {
            newChild._parentNode.removeChild(newChild);
          }

          if (refChild == null) {
            var refChildIndex = this._childNodes.length;
          } else {
            var refChildIndex = this._indexOf(refChild);
            if (refChildIndex == -1) {
              throw new core.DOMException(NOT_FOUND_ERR);
            }
          }

          this._childNodes.splice(refChildIndex, 0, newChild);
          newChild._parentNode = this;
          if (newChild._addIds) {
            newChild._addIds();
          }

          this._modified();
        }

        return newChild;
      }, // raises(DOMException);

      _modified: function() {
        this._version++;
        if (this._ownerDocument) {
          this._ownerDocument._version++;
        }

        this._childrenList.update();
        this._childNodesList.update();
      },

      /* returns Node */
      replaceChild : function(/* Node */ newChild, /* Node */ oldChild){
        this.insertBefore(newChild, oldChild);
        return this.removeChild(oldChild);
      }, //raises(DOMException);

      /* returns void */
      _addIds : function(){
        if (this.id) {
          if (this._ownerDocument._ids) {
            this._ownerDocument._ids[this.id] = this;
          }
        }
        for (var i=0;i<this._childNodes.length;i++) {
          if (this._childNodes[i]._addIds) {
           this._childNodes[i]._addIds();
          }
        }
      },
      /* returns void */
      _removeIds : function(){
        if (this.id) {
          if (this._ownerDocument._ids) {
            this._ownerDocument._ids[this.id] = null;
            delete this._ownerDocument._ids[this.id];
          }
        }
        for (var i=0;i<this._childNodes.length;i++) {
          this._childNodes[i]._removeIds();
        }
      },

      /* returns Node */
      removeChild : function(/* Node */ oldChild){
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        // TODO - if (!oldChild) then?
        var oldChildIndex = this._indexOf(oldChild);
        if (oldChildIndex == -1) {
          throw new core.DOMException(NOT_FOUND_ERR);
        }

        this._childNodes.splice(oldChildIndex, 1);
        oldChild._parentNode = null;
        this._modified();
        oldChild._removeIds();
        return oldChild;
      }, // raises(DOMException);

      /* returns Node */
      appendChild : function(/* Node */ newChild) {
        return this.insertBefore(newChild, null);
      }, // raises(DOMException);

      /* returns boolean */
      hasChildNodes : function() {
        return this._childNodes.length > 0;
      },

      /* returns Node */
      cloneNode : function(/* bool */ deep, fn) {

        var object = null;
        switch (this.nodeType) {

          case this.ELEMENT_NODE:
            object = attrCopy(this,this._ownerDocument.createElement(this.tagName), fn);
          break;

          case this.TEXT_NODE:
            object = attrCopy(this,this._ownerDocument.createTextNode(this.tagName));
            object.nodeValue = this.nodeValue;
          break;
          case this.CDATA_SECTION_NODE:
            object = this._ownerDocument.createCDATASection(this.tagName);
            object.nodeValue = this.nodeValue;
          break;
          case this.ENTITY_REFERENCE_NODE:
            var name = (this._entity) ? this._entity.name : this._entityName,
                ref  = this._ownerDocument.createEntityReference(name);

            object = attrCopy(this, ref);
            object.nodeValue = this.nodeValue;
          break;
          case this.ATTRIBUTE_NODE:
            object = this._ownerDocument.createAttribute(this.name);
          break;
          case this.ENTITY_NODE:
            var entity = this._ownerDocument.createEntityNode(this.name);
            object = attrCopy(this, entity);
            object.nodeValue = this.nodeValue;
            object._publicId = this._publicId;
            object._systemId = this._systemId;
            object._notationName = this.notationName;
          break;
          case this.PROCESSING_INSTRUCTION_NODE:
            var pi = this._ownerDocument.createProcessingInstruction(this._target,
                                                                    this._data);
            object = attrCopy(this, pi);
            object.nodeValue = this.nodeValue;
          break;
          case this.COMMENT_NODE:
            object = this._ownerDocument.createComment(this.tagName);
            object.nodeValue = this.nodeValue;
          break;
          case this.DOCUMENT_NODE:
            object = attrCopy(this, new core.Document());
            // TODO: clone the doctype/entities/notations/etc?
          break;
          case this.DOCUMENT_TYPE_NODE:
            object = attrCopy(this, new core.DocumentType());
            object.nodeValue = this.nodeValue;
          break;
          case this.DOCUMENT_FRAGMENT_NODE:
            object = this._ownerDocument.createDocumentFragment();
          break;
          case this.NOTATION_NODE:
            object = this._ownerDocument.createNotationNode(this._name,
                                                           this._publicId,
                                                           this._systemId);
            object = attrCopy(this,object);
            object.nodeValue = this.nodeValue;
          break;
          default:
            throw new core.DOMException(NOT_FOUND_ERR);
          break;
        }

        if (typeof fn === "function") {
          fn(this, object);
        }

        if (deep || this.nodeType === ATTRIBUTE_NODE) {
          var clone = null;
          for (var i=0,len=this._childNodes.length;i<len;i++)
          {
            clone = this._childNodes[i].cloneNode(true);
            if (clone.nodeType === ATTRIBUTE_NODE) {
              object.setAttributeNode(clone);
            } else {
              var readonly = object._readonly;
              object._readonly = false;
              object.appendChild(clone);
              object._readonly = readonly;
            }
          }
        }

        return object;
      },

      /* returns void */
      normalize: function() {
        var prevChild, child, attr,i;

        if (this._attributes && this._attributes.length) {
          for (i=0;i<this._attributes.length;i++)
          {
            if (this._attributes.item(i)) {
              attr = this._attributes.item(i).normalize();
            }
          }
        }

        for (i=0;i<this._childNodes.length;i++)
        {
          child = this._childNodes[i];

          if (child.normalize) {
            child.normalize();
          }

          // Level2/core clean off empty nodes
          if (child.value === "") {
            this.removeChild(child);
            i--;
            continue;
          }

          if (i>0) {
            prevChild = this._childNodes[i-1];

            if (child.nodeType === TEXT_NODE &&
                prevChild.nodeType === TEXT_NODE)
            {

              // remove the child and decrement i
              prevChild.appendData(child.value);

              this.removeChild(child);
              i--;
            }
          }
        }
      },
      toString: function() {
        var id = '';
        if (this.id) {
            id = '#' + this.id;
        }
        if (this.className) {
            var classes = this.className.split(/\s+/);
        for (var i = 0, len = classes.length; i < len; i++) {
            id += '.' + classes[i];
        }
        }
        return '[ ' + this.tagName + id + ' ]';
      },
      trigger: function(type, message, data) {
        var text = type + ": " + message;

        if (data) {
          text += " - More:\n" + data.toString();

        }

        if (type === "error") {
          if (!this.errors) {
            this.errors = [];
          }
          // TODO: consider using actual `Error` objects or `DOMException`s even..
          var err = {
            type    : type,
            message : message || "No message",
            data    : data || null
          };

          this.errors.push(err);

          if (this._ownerDocument        &&
              this._ownerDocument.trigger &&
              this !== this._ownerDocument)
          {
            this._ownerDocument.trigger(type, message, data);
          }
        }

        console.log(text);
      }
    };
    // Safari chokes if _attributes is a property of the object assigned above,
    // reporting an unexpected comma several lines down.
    core.Node.prototype._attributes = null;


    core.NamedNodeMap = function NamedNodeMap(doc) {
      this._nodes = {};
      this._nsStore = {};
      this.length = 0;
      this._ownerDocument = doc;
      this._readonly = false;
    };
    core.NamedNodeMap.prototype = {
      get readonly() { return this._readonly;},
      get ownerDocument() { this._ownerDocument;},

      exists : function(name) {
        return (this._nodes[name] || this._nodes[name] === null) ? true : false;
      },

      /* returns Node */
      getNamedItem: function(/* string */ name) {
        return this._nodes[name] || null;
      },

      /* returns Node */
      setNamedItem: function(/* Node */ arg) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        // arg is from a different document
        if (arg && arg._ownerDocument !== this._ownerDocument) {
          throw new core.DOMException(WRONG_DOCUMENT_ERR);
        }

        // if this argument is already in use..
        if (arg && arg._parentNode) {
          throw new core.DOMException(INUSE_ATTRIBUTE_ERR);
        }

        var ret;
        if (!this._nodes[arg.name] || this._nodes[arg.name] === null) {
          this.length++;
          ret = null;
        } else {
          ret = this._nodes[arg.name];
        }
        arg._specified = true;
        this._nodes[arg.name] = arg;
        return ret;
      }, // raises: function(DOMException) {},

      /* returns Node */
      removeNamedItem: function(/* string */ name) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        if (!this._nodes.hasOwnProperty(name)) {
            throw new core.DOMException(NOT_FOUND_ERR);
        }

        var prev = this._nodes[name] || null;
        this._nodes[name] = null;
        delete this._nodes[name];

        this.length--;
        return prev;
      }, // raises: function(DOMException) {},

      /* returns Node */
      item: function(/* int */ index) {
        var current = 0;
        for (var member in this._nodes) {
          if (this._nodes.hasOwnProperty(member)) {
            if (current === index && this._nodes[member]) {
              return this._nodes[member];
            }
            current++;
          }
        }
        return null;
      }
    };

    core.AttrNodeMap = function AttrNodeMap(doc, parentNode) {
      core.NamedNodeMap.call(this, doc);
      this._parentNode = parentNode;
    };

    util.inherit(core.AttrNodeMap, core.NamedNodeMap.prototype, {
      get parentNode() { return this._parentNode;},

      /* returns Node */
      setNamedItem: function(/* Node */ arg) {
        var prev = core.NamedNodeMap.prototype.setNamedItem.call(this, arg);

        arg._parentNode = this._parentNode;
        this._parentNode._modified();
        return prev;
      },

      /* returns Node */
      removeNamedItem: function(/* string */ name) {

        var prev = core.NamedNodeMap.prototype.removeNamedItem.call(this, name);
        prev._parentNode = null;
        this._parentNode._modified();

        var doc = this._ownerDocument;

        // set default value if available
        if (doc && doc._doctype && doc._doctype.name.toLowerCase() !== "html") {
          var defaultValue = false,
              elem         = doc._doctype._attributes
                                         .getNamedItem(this._parentNode.nodeName);

          if (elem) {
            var defaultValue = elem.attributes.getNamedItem(name);

            if (defaultValue) {
              var attr = doc.createAttribute(name);
              attr.value = defaultValue.value;
              attr._specified = false;
              this._nodes[name] = attr;
              this.length++;
            }
          }
        }
        return prev;
      }, // raises: function(DOMException) {},
    });

    core.NotationNodeMap = function NotationNodeMap(doc) {
      core.NamedNodeMap.call(this, doc);
      this._readonly = false;
      for (var i=1;i<arguments.length;i++) {
        this.setNamedItem(arguments[i]);
      }
      this._readonly = true;
    };
    util.inherit(core.NotationNodeMap, core.NamedNodeMap.prototype, {});

    core.EntityNodeMap = function EntityNodeMap(doc) {
      core.NamedNodeMap.call(this,doc);
      this._readonly = false;
      var i = 1, l = arguments.length;

      for (i=1; i<l; i++) {
        this.setNamedItem(arguments[i]);
      }
      core.markTreeReadonly(this);
    };
    util.inherit(core.EntityNodeMap, core.NamedNodeMap.prototype, {});

    core.Element = function Element(doc, tagName) {
      this._ownerDocument = doc;
      core.Node.call(this, doc);
      this._nodeName = tagName;
      this._tagName = tagName;
    };

    util.inherit(core.Element, core.Node.prototype, {

      get nodeValue() { return null;},
      set nodeValue(value) { /* do nothing */ },
      get tagName() {
        if (this.nodeType === ELEMENT_NODE &&
            this._ownerDocument                  &&
            this._ownerDocument._doctype          &&
            this._ownerDocument._doctype.name.toLowerCase().indexOf("html") !== -1)
        {
          return this.nodeName.toUpperCase();
        }
        return this.nodeName;
      },
      nodeType : ELEMENT_NODE,
      get attributes() {
        for(var i=0; i<this._attributes.length; i++) {
          this._attributes[i] = this._attributes.item(i);
        }
        return this._attributes;
      },

      get name() { return this.nodeName;},
      /* returns string */
      getAttribute: function(/* string */ name) {
        var attribute = this._attributes.getNamedItem(name);
        if (attribute) {
          return attribute.value;
        }
        return "";
      },

      /* returns string */
      setAttribute: function(/* string */ name, /* string */ value) {
        // Check for inline event handlers.
        // We can't set these like other attributes then look it up in
        // dispatchEvent() because that would create 2 'traditional' event handlers
        // in the case where there's an inline event handler attribute, plus one
        // set using element.on* in a script.
        if ((name.length > 2) && (name[0] == 'o') && (name[1] == 'n')) {
            var self = this;
            self[name] = function () {
                // The handler code probably refers to functions declared in the
                // window context, so we need to call run().
                if (self.run != undefined) {
                    // We're the window. This can happen because inline handlers
                    // on the body are proxied to the window.
                    self.run(value);
                } else {
                    // We're an element.
                    self._ownerDocument.parentWindow.run(value);
                }
            };
            return;
        }
        if (this._ownerDocument) {
          var attr = this._ownerDocument.createAttribute(name);
          attr.value = value;
          attr._ownerElement = this;

          this._attributes.setNamedItem(attr);
        }

        if (name === 'id') {
            if (this._addIds) {
                this._addIds();
            }
        }
      }, //raises: function(DOMException) {},

      /* returns string */
      removeAttribute: function(/* string */ name) {
        if (!this._attributes.exists(name)) {
          return;
        }

        this._attributes.removeNamedItem(name);
      }, // raises: function(DOMException) {},

      /* returns Attr */
      getAttributeNode: function(/* string */ name) {
        return this._attributes.getNamedItem(name);
      },

      /* returns Attr */
      setAttributeNode: function(/* Attr */ newAttr) {
        var prevNode = this._attributes.getNamedItem(newAttr.name);
        if (prevNode) {
          prevNode._parentNode = null;
        }

        this._attributes.setNamedItem(newAttr);

        return (prevNode && prevNode.specified) ? prevNode : null;
      }, //  raises: function(DOMException) {},

      /* returns Attr */
      removeAttributeNode: function(/* Attr */ oldAttr) {
        var existingAttr = this._attributes.getNamedItem(oldAttr.name);

        if (this._attributes && existingAttr === oldAttr) {
          this._attributes.removeNamedItem(oldAttr.name);
          return oldAttr;
        }

        throw new core.DOMException(NOT_FOUND_ERR);
      }, //raises: function(DOMException) {},

      /* returns NodeList */
      getElementsByTagName: function(/* string */ name) {
        name = name.toLowerCase();

        function filterByTagName(child) {
          child = (child.nodeType === ENTITY_REFERENCE_NODE) ?
                   child._entity                             :
                   child;

          if (child.nodeName && child.nodeType === ELEMENT_NODE) {
            return name === "*" || (child.nodeName.toLowerCase() === name);
          }

          return false;
        }
        return new core.NodeList(this._ownerDocument || this, core.mapper(this, filterByTagName, true));
      },
    });

    core.DocumentFragment = function DocumentFragment(doc) {
      core.Node.call(this, doc);
      this._nodeName = this._tagName = "#document-fragment";
    };
    util.inherit(core.DocumentFragment, core.Node.prototype, {
      nodeType : DOCUMENT_FRAGMENT_NODE,
      get nodeValue() { return null;},
      set nodeValue(value) { /* do nothing */ },
      get attributes() { return null;}
    });

    core.ProcessingInstruction = function ProcessingInstruction(doc, target, data) {
      this._ownerDocument = doc;
      core.Node.call(this, doc);
      this._nodeName = target;
      this._tagName = target;
      this._target = target;
      this._nodeValue = data;
    }
    util.inherit(core.ProcessingInstruction, core.Node.prototype, {
      nodeType : PROCESSING_INSTRUCTION_NODE,
      get target() { return this._target;},
      set target(value) { throw new core.DOMException(1);},
      get nodeValue() { return this._nodeValue;},
      set nodeValue(value) { this._nodeValue = value},
      get data()   { return this._nodeValue;},
      set data(value)   { throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);},
      get attributes() { return null;}

    });

    core.Document = function Document(options) {
      if (!options) {
        options = {};
      }
      else if (typeof options == 'string') {
        options = {
          name: options
        };
      }
      core.Node.call(this, "#document");
      this._nodeName = this._tagName = "#document";
      this._contentType = options.contentType || "text/xml";
      this._doctype = options._doctype;
      this._implementation = options.implementation || new (core.DOMImplementation)();
      this._documentElement = null;
      this._ids = {};
      this._ownerDocument = this;
      this._readonly = false;
    };


    var tagRegEx = /[^\w:\d_\.-]+/i;
    var entRegEx = /[^\w\d_\-&;]+/;
    var invalidAttrRegEx = /[^\w:\d_\.-]+/;

    util.inherit(core.Document, core.Node.prototype, {
      nodeType : DOCUMENT_NODE,
      _elementBuilders : {
        canvas : function(doc, tagName) {
          var element = new core.Element(doc, tagName),
              canvas;

          throw 'Canvas is not supported'
          // require node-canvas and catch the error if it blows up
          try {
            /*
            canvas = new (require('canvas'))(0,0);
            for (attr in element) {
              if (!canvas[attr]) {
                canvas[attr] = element[attr];
              }
            }
            return canvas;
            */
          } catch (e) {
            return element;
          }
        }
      },
      _defaultElementBuilder: function(doc, tagName) {
        return new core.Element(doc, tagName);
      },
      get contentType() { return this._contentType;},
      get doctype() { return this._doctype || null;},
      set doctype(doctype) { this._doctype = doctype;},
      get documentElement() {
        if (this._documentElement) {
          return this._documentElement;
        } else {
          var children = this._childNodes, len = this._childNodes.length, i=0;
          for (i;i<len;i++) {
            if (children[i].nodeType === ELEMENT_NODE) {
              this._documentElement = children[i];
              return children[i];
            }
          }
          return null;
        }
      },

      get implementation() { return this._implementation;},
      set implementation(implementation) { this._implementation = implementation;},
      get nodeName() { return '#document'; },
      get tagName() {
        return null;
      },
      get nodeValue() { return null; },
      set nodeValue(value) { /* noop */ },
      get attributes() { return null;},
      get ownerDocument() { return null;},
      get readonly() { return this._readonly;},
      /* returns Element */
      createElement: function(/* string */ tagName) {
        var c = [], lower = tagName.toLowerCase(), element;

        if (!tagName || !tagName.match || (c = tagName.match(tagRegEx))) {
          throw new core.DOMException(INVALID_CHARACTER_ERR, 'Invalid character in tag name: ' + c.pop());
        }

        element = (this._elementBuilders[lower] || this._defaultElementBuilder)(this, tagName);

        // Check for and introduce default elements
        if (this._doctype && this._doctype._attributes && this._doctype.name.toLowerCase() !== "html") {
          var attrElement = this._doctype._attributes.getNamedItem(tagName);
          if (attrElement && attrElement._childNodes) {

            attrs = attrElement.attributes;
            var attr, len = attrs.length, defaultAttr;
            for (var i = 0; i < len; i++) {
              defaultAttr = attrs.item(i);
              if (defaultAttr) {
                attr = this.createAttribute(defaultAttr.name);
                attr.value = defaultAttr.value;
                element.setAttributeNode(attr);
                attr._specified = false;
              }
            }
          }
        }

        element._created = true;
        return element;
      }, //raises: function(DOMException) {},

      /* returns DocumentFragment */
      createDocumentFragment: function() {
        return new core.DocumentFragment(this);
      },

      /* returns Text */
      createTextNode: function(/* string */ data) {
        return new core.Text(this,data);
      },

      /* returns Comment */
      createComment: function(/* string */ data) {
        return new core.Comment(this,data);
      },

      /* returns CDATASection */
      createCDATASection: function(/* string */ data) {
        if (this._doctype && this._doctype.name === "html") {
          throw new core.DOMException(NOT_SUPPORTED_ERR);
        }

        return new core.CDATASection(this,data);
      }, // raises: function(DOMException) {},

      /* returns ProcessingInstruction */
      createProcessingInstruction: function(/* string */ target,/* string */ data) {

        if (this._doctype && this._doctype.name === "html") {
          throw new core.DOMException(NOT_SUPPORTED_ERR);
        }

        if (target.match(tagRegEx) || !target || !target.length) {
          throw new core.DOMException(INVALID_CHARACTER_ERR);
        }

        return new core.ProcessingInstruction(this, target, data);
      }, // raises: function(DOMException) {},

      /* returns Attr */
      createAttribute: function(/* string */ name) {
        if (!name || !name.length || name.match(invalidAttrRegEx) ) {
          throw new core.DOMException(INVALID_CHARACTER_ERR, "attribute name: " + name);
        }
        return new core.Attr(this, name,false);
      }, // raises: function(DOMException) {},

      /* returns EntityReference */
      createEntityReference: function(/* string */ name) {

        if (this._doctype && this._doctype.name === "html") {
          throw new core.DOMException(NOT_SUPPORTED_ERR);
        }

        name = name.replace(/[&;]/g,"");
        if (!name || !name.length) {
          throw new core.DOMException(INVALID_CHARACTER_ERR);
        }

        if (name.match(tagRegEx)) {
          throw new core.DOMException(INVALID_CHARACTER_ERR);
        }

        var entity;
        if (this._doctype && this._doctype.entities) {
          entity = this._doctype.entities.getNamedItem(name);
        } else {
          entity = null;
        }

        var ref    = new core.EntityReference(this, entity);

        ref._entityName = name;

        return ref;
      }, //raises: function(DOMException) {},

      /* returns Entity */
      createEntityNode : function(/* string */ name)
      {

        if (name.match(entRegEx) || !name || !name.length) {
          throw new core.DOMException(INVALID_CHARACTER_ERR);
        }

        var ret = new core.Entity(this, name);
        ret._readonly = false;// TODO: fix me please.

        for (var i=1;i<arguments.length;i++)
        {
          ret.appendChild(arguments[i]);
        }

        core.markTreeReadonly(ret);

        return ret;
      },

      /* returns Notation */
      createNotationNode : function(/* string */ name,/* string */ publicId,/* string */ systemId)
      {

        if (name.match(entRegEx) || !name || !name.length) {
          throw new core.DOMException(INVALID_CHARACTER_ERR);
        }

        var ret = new core.Notation(this, name, publicId, systemId);
        ret._readonly = false;// TODO: fix me please.

        for (var i=3;i<arguments.length;i++)
        {
          ret.appendChild(arguments[i]);
        }

        core.markTreeReadonly(ret);

        return ret;
      },

      appendChild : function(/* Node */ arg) {
        if (this.documentElement && arg.nodeType == ELEMENT_NODE) {
          throw new core.DOMException(HIERARCHY_REQUEST_ERR);
        }
        return core.Node.prototype.appendChild.call(this, arg);
      },

      removeChild : function(/* Node */ arg) {
        var ret = core.Node.prototype.removeChild.call(this, arg);
        if (arg == this._documentElement) {
          this._documentElement = null;// force a recalculation
        }
        return ret;
      },

      /* returns NodeList */
      getElementsByTagName: function(/* string */ name) {
        function filterByTagName(child) {
          if (child.nodeType && child.nodeType === ENTITY_REFERENCE_NODE)
          {
            child = child._entity;
          }

          if (child.nodeName && child.nodeType === ELEMENT_NODE)
          {
            if (name === "*") {
              return true;

            // case insensitivity for html
            } else if (child._ownerDocument && child._ownerDocument._doctype &&
                       //child._ownerDocument._doctype.name === "html" &&
                       child.nodeName.toLowerCase() === name.toLowerCase())
            {
              return true;
            } else if (child.nodeName.toLowerCase() === name.toLowerCase()) {
              return true;
            }
          }
          return false;
        }
        return new core.NodeList(this.documentElement || this, core.mapper(this, filterByTagName, true));
      }
    });

    core.CharacterData = function CharacterData(doc, value) {
      core.Node.call(this, doc);

      this._nodeValue = (value) ? value + "" : "";
    };
    util.inherit(core.CharacterData, core.Node.prototype, {

      get data() { return this._nodeValue;},
      set data(data) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        this._nodeValue = data;
      },

      /* returns int */
      get length() { return this._nodeValue.length || 0;},

      /* returns string */
      substringData: function(/* int */ offset, /* int */ count) {

        if (count < 0 || offset < 0 || offset > this._nodeValue.length) {
          throw new core.DOMException(INDEX_SIZE_ERR);
        }

        return (this._nodeValue.length < offset + count) ?
                this._nodeValue.substring(offset) :
                this._nodeValue.substring(offset, offset+count);

      }, // raises: function(DOMException) {},

      /* returns string */
      appendData: function(/* string */ arg) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        this._nodeValue+=arg;
        return this._nodeValue;
      }, // raises: function(DOMException) {},

      /* returns string */
      insertData: function(/* int */ offset, /* string */ arg) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        if (offset < 0 || offset > this._nodeValue.length) {
          throw new core.DOMException(INDEX_SIZE_ERR);
        }

        var start = this._nodeValue.substring(0,offset);
        var end = this._nodeValue.substring(offset);

        this._nodeValue = start + arg + end;

      }, //raises: function(DOMException) {},

      /* returns void */
      deleteData: function(/* int */ offset, /* int */ count) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        if (offset       < 0                     ||
            offset       > this._nodeValue.length ||
            count        < 0)
        {
          throw new core.DOMException(INDEX_SIZE_ERR);
        }

        var start = this._nodeValue.substring(0,offset);

        this._nodeValue = (offset+count<this._nodeValue.length) ?
                         start + this._nodeValue.substring(offset+count) :
                         start;
      }, // raises: function(DOMException) {},

      /* returns void */
      replaceData: function(/* int */ offset, /* int */ count, /* string */ arg) {

        // readonly
        if (this._readonly === true) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        count = (offset+count > this._nodeValue.length) ?
                 this.nodeValue.length-offset           :
                 count;

        if (offset       < 0                     ||
            offset       > this._nodeValue.length ||
            count        < 0                     /*||
            offset+count > this._nodeValue.length*/)
        {
          throw new core.DOMException(INDEX_SIZE_ERR);
        }

        var start = this._nodeValue.substring(0,offset);
        var end = this._nodeValue.substring(offset+count);

        this._nodeValue = start + arg + end;
      } // raises: function(DOMException) {},
    });

    core.Attr = function Attr(doc, name, value) {
      core.Node.call(this, doc);
      this._nodeValue = value;
      this._name = name;
      this._specified = (value) ? true : false;
      this._tagName   = name;
      this._nodeName  = name;
    };
    util.inherit(core.Attr, core.Node.prototype, {
      nodeType : ATTRIBUTE_NODE,
      get nodeValue() {
        var val = '';
        for (var i=0,len=this._childNodes.length;i<len;i++) {
          var child = this._childNodes[i];
          if (child.nodeType === ENTITY_REFERENCE_NODE) {
            val += child.childNodes.toArray().reduce(function(prev, c) {
              return prev += (c.nodeValue || c);
            }, '');
          } else {
            val += child.nodeValue;
          }
        }
        return val;
      },
      set nodeValue(value) {
        // readonly
        if (this._readonly) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        this._childNodes.length = 0;
        this._childNodes.push(this._ownerDocument.createTextNode(value));
        this._modified();
        this._specified = true;
        this._nodeValue = value;
      },
      get name() { return this._name;},
      get specified() { return this._specified },
      get value() {
        return this.nodeValue;
      },
      set value(value) {
        this.nodeValue = value;
      },
      get parentNode() { return null;},
      get attributes() { return null;},

      insertBefore : function(/* Node */ newChild, /* Node*/ refChild){
        if (newChild.nodeType === CDATA_SECTION_NODE ||
            newChild.nodeType === ELEMENT_NODE)
        {
          throw new core.DOMException(HIERARCHY_REQUEST_ERR);
        }

        return core.Node.prototype.insertBefore.call(this, newChild, refChild);
      },

      appendChild : function(/* Node */ arg) {

        if (arg.nodeType === CDATA_SECTION_NODE ||
            arg.nodeType === ELEMENT_NODE)
        {
          throw new core.DOMException(HIERARCHY_REQUEST_ERR);
        }

        return core.Node.prototype.appendChild.call(this, arg);
      }

    });

    core.Text = function Text(doc, text, readonly) {
        core.CharacterData.call(this, doc, text);
        this._nodeName = "#text";
        this._readonly = readonly ? true : false
    };
    util.inherit(core.Text, core.CharacterData.prototype, {
      nodeType : TEXT_NODE,
      get attributes() { return null;},
      get value() { return this._nodeValue;},
      set value(value) { this.nodeValue = value;},

      /* returns Text */
      splitText: function(offset) {

        // readonly
        if (this._readonly) {
          throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        if (offset < 0 || offset > this._nodeValue.length) {
          throw new core.DOMException(INDEX_SIZE_ERR);
        }

        var newText = this._nodeValue.substring(offset);
        this._nodeValue = this._nodeValue.substring(0, offset);
        var newNode = this._ownerDocument.createTextNode(newText);

        if(this._parentNode.lastChild === this) {
          this._parentNode.appendChild(newNode);
        } else {
          this._parentNode.insertBefore(newNode, this.nextSibling);
        }

        return newNode;
      }, //raises: function(DOMException) {},
      toString: function() {
        return this.nodeName;
      }
    });

    core.Comment = function Comment(doc, text) {
      core.Text.call(this, doc, text);
      this._nodeName = "#comment";
      this._tagName  = "#comment";
    };
    util.inherit(core.Comment, core.Text.prototype, {
      nodeType : COMMENT_NODE
    });

    core.CDATASection = function CDATASection(doc, value) {
      core.Text.call(this, doc, value);
      this._nodeName = "#cdata-section";
    };
    util.inherit(core.CDATASection, core.Text.prototype, {
      nodeType : CDATA_SECTION_NODE
    });

    core.DocumentType = function DocumentType(doc, name, entities, notations, attributes) {
      core.Node.call(this, doc);
      this._name = name;
      this._tagName = name;
      this._nodeName = name;
      this._entities = entities || new core.EntityNodeMap(doc);
      this._notations = notations || new core.NotationNodeMap(doc);

      core.markTreeReadonly(this._notations);

      this._attributes = attributes || new core.AttrNodeMap(doc);
    };
    util.inherit(core.DocumentType, core.Node.prototype, {
      nodeType : DOCUMENT_TYPE_NODE,
      get nodeValue() { return null;},
      set nodeValue(value) { /* do nothing */ },
      get name() { return this._name;},
      get entities() { return this._entities;},
      get notations() { return this._notations;},
      get attributes() { return null;}
    });

    core.Notation = function Notation(doc, name, publicId, systemId){
      core.Node.call(this, doc);
      this._name = name;
      this._nodeName = name;
      this._publicId = publicId || null;
      this._systemId = systemId || null;
      this._nodeValue = null;
    };
    util.inherit(core.Notation, core.Node.prototype, {
      nodeType : NOTATION_NODE,
      get publicId() { return this._publicId;},
      get systemId() { return this._systemId;},
      get name() { return this._name || this._nodeName;},
      get attributes() { /* as per spec */ return null;},
      set nodeValue(value) { /* intentionally left blank */ },
      get nodeValue() { return this._nodeValue;},
    });

    core.Entity = function Entity(doc, name) {
      core.Node.call(this, doc);
      this._name = name;
      this._nodeName = name;
      this._tagName = name;
      this._publicId = null;
      this._systemId = null;
      this._notationName = null;
      this._readonly = true;
    };
    util.inherit(core.Entity, core.Node.prototype, {
      nodeType : ENTITY_NODE,
      get nodeValue() { return null;},
      set nodeValue(value) {
        // readonly
        if (this._readonly === true) {
          // TODO: is this needed?
          // throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }
        /* do nothing */
      },
      get name() { return this._name },
      get publicId() { return this._publicId;},
      get systemId() { return this._systemId;},

      set publicId(publicId) { this._publicId = publicId;},
      set systemId(systemId) { this._systemId = systemId;},
      set notationName(notationName) { this._notationName = notationName;},

      get notationName() { return this._notationName;},
      get attributes() { return null;},

    });

    core.EntityReference = function EntityReference(doc, entity) {
      core.Node.call(this, doc);
      this._entity = entity;
      this._nodeName = (entity) ? entity.name : null;
      this._readonly = true;
    };
    util.inherit(core.EntityReference, core.Node.prototype, {
      nodeType : ENTITY_REFERENCE_NODE,
      get nodeValue() { return (this._entity) ? this._entity.nodeValue : null;},
      set nodeValue(value) {
        // readonly
        if (this._readonly === true) {
          // TODO: is this needed?
          //throw new DOMException(NO_MODIFICATION_ALLOWED_ERR);
        }

        /* do nothing */
      },
      get attributes() { return null;},

      // Proxy to the entity
      get nodeName() { return this._entityName;},
      get firstChild() { return this._entity.firstChild || null;},
      get childNodes() { return this._entity.childNodes;},
      get lastChild() { return this._entity.lastChild || null;},

    });

    exports.dom = { "level1" : { "core" : core }};

    return exports;
});

define('jsdom/level2/core',[
    '../level1/core', '../../util'
],
function (_core, util) {
    var exports = {};
    var core                     = _core.dom.level1.core,
        INVALID_STATE_ERR        = core.INVALID_STATE_ERR        = 11,
        SYNTAX_ERR               = core.SYNTAX_ERR               = 12,
        INVALID_MODIFICATION_ERR = core.INVALID_MODIFICATION_ERR = 13,
        NAMESPACE_ERR            = core.NAMESPACE_ERR            = 14,
        INVALID_ACCESS_ERR       = core.INVALID_ACCESS_ERR       = 15,
        ns = {
          validate : function(ns, URI) {
            if (!ns) {
              throw new core.DOMException(core.INVALID_CHARACTER_ERR, "namespace is undefined");
            }

            if(ns.match(/[^0-9a-z\.:\-_]/i) !== null) {
              throw new core.DOMException(core.INVALID_CHARACTER_ERR, ns);
            }

            var msg = false, parts = ns.split(':');
            if (ns === 'xmlns'                          &&
                URI !== "http://www.w3.org/2000/xmlns/")
            {
              msg = "localName is 'xmlns' but the namespaceURI is invalid";

            } else if (ns === "xml"                                   &&
                       URI !== "http://www.w3.org/XML/1998/namespace")
            {
              msg = "localName is 'xml' but the namespaceURI is invalid";

            } else if (ns[ns.length-1] === ':') {
              msg = "Namespace seperator found with no localName";

            } else if (ns[0] === ':') {
              msg = "Namespace seperator found, without a prefix";

            } else if (parts.length > 2) {
              msg = "Too many namespace seperators";

            }

            if (msg) {
              throw new core.DOMException(NAMESPACE_ERR, msg + " (" + ns + "@" + URI + ")");
            }
          }
        };

    core.exceptionMessages['NAMESPACE_ERR'] = "Invalid namespace";

    core.DOMImplementation.prototype.createDocumentType = function(/* String */ qualifiedName,
                                                                   /* String */ publicId,
                                                                   /* String */ systemId)
    {
      ns.validate(qualifiedName);
      var doctype = new core.DocumentType(null, qualifiedName);
      doctype._publicId = publicId ? publicId : '';
      doctype._systemId = systemId ? systemId : '';
      return doctype;
    };

    /**
      Creates an XML Document object of the specified type with its document element.
      HTML-only DOM implementations do not need to implement this method.
    */
    core.DOMImplementation.prototype.createDocument = function(/* String */       namespaceURI,
                                                               /* String */       qualifiedName,
                                                               /* DocumentType */ doctype)
    {
      if (qualifiedName || namespaceURI) {
        ns.validate(qualifiedName, namespaceURI);
      }

      if (doctype && doctype._ownerDocument !== null) {
        throw new core.DOMException(core.WRONG_DOCUMENT_ERR);
      }

      if (qualifiedName && qualifiedName.indexOf(':') > -1 && !namespaceURI) {
        throw new core.DOMException(NAMESPACE_ERR);
      }

      var doc = new core.Document();
      
      if (doctype) {
        doc.doctype = doctype;
        doctype._ownerDocument = doc;
        doc.appendChild(doctype);
      } else {
        doc.doctype = null;
      }

      if (doctype && !doctype.entities) {
        doctype.entities = new dom.EntityNodeMap();
      }

      doc._ownerDocument = doc;

      if (qualifiedName) {
        var docElement = doc.createElementNS(namespaceURI, qualifiedName);
        doc.appendChild(docElement);
      }

      return doc;
    };

    util.updateProperty(core.Node.prototype, "ownerDocument", {
        get: function() {
          return this._ownerDocument || null;
        }
    });

    core.Node.prototype.isSupported = function(/* string */ feature,
                                               /* string */ version)
    {
      return this._ownerDocument.implementation.hasFeature(feature, version);
    };

    core.Node.prototype._namespaceURI = null;

    util.updateProperty(core.Node.prototype, "namespaceURI", {
        get: function() {
          return this._namespaceURI || null;
        },
        set: function(value) {
          this._namespaceURI = value;
        }
    });

    util.updateProperty(core.Node.prototype, "prefix", {
        get: function() {
          return this._prefix || null;
        },
        set: function(value) {

          if (this.readonly) {
            throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
          }

          ns.validate(value, this._namespaceURI);

          if ((this._created && !this._namespaceURI)  ||
              this._prefix === "xmlns"                ||
              (!this._prefix && this._created))
          {
            throw new core.DOMException(core.NAMESPACE_ERR);
          }

          if (this._localName) {
            this._nodeName = value + ':' + this._localName;
          }

          this._prefix = value;
        }
    });

    util.updateProperty(core.Node.prototype, "localName", {
        get: function() {
          return this._localName || null;
        }
    });

    /* return boolean */
    core.Node.prototype.hasAttributes = function() {
      return (this.nodeType === this.ELEMENT_NODE &&
              this._attributes                    &&
              this._attributes.length > 0);
    };

    core.NamedNodeMap.prototype.getNamedItemNS = function(/* string */ namespaceURI,
                                                          /* string */ localName)
    {
      if (this._nsStore[namespaceURI] && this._nsStore[namespaceURI][localName]) {
        return this._nsStore[namespaceURI][localName];
      }
      return null;
    };

    core.AttrNodeMap.prototype.setNamedItemNS = function(/* Node */ arg) {
      if (arg.nodeType !== this._ownerDocument.ATTRIBUTE_NODE) {
        throw new core.DOMException(core.HIERARCHY_REQUEST_ERR);
      }

      return core.NamedNodeMap.prototype.setNamedItemNS.call(this, arg);
    };

    var prevSetNamedItem = core.AttrNodeMap.prototype.setNamedItem;

    core.AttrNodeMap.prototype.setNamedItem = function(/* Node */ arg) {
      if (arg.nodeType !== this._ownerDocument.ATTRIBUTE_NODE) {
        throw new core.DOMException(core.HIERARCHY_REQUEST_ERR);
      }

      return prevSetNamedItem.call(this, arg);
    };


    core.NamedNodeMap.prototype.setNamedItemNS = function(/* Node */ arg)
    {
      if (this._readonly) {
        throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
      }

      var owner = this._ownerDocument;
      if (this._parentNode &&
          this._parentNode._parentNode &&
          this._parentNode._parentNode.nodeType === owner.ENTITY_NODE)
      {
        throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
      }

      if (this._ownerDocument !== arg.ownerDocument) {
        throw new core.DOMException(core.WRONG_DOCUMENT_ERR);
      }

      if (arg._parentNode) {
        throw new core.DOMException(core.INUSE_ATTRIBUTE_ERR);
      }

      // readonly
      if (this._readonly === true) {
        throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
      }


      if (!this._nsStore[arg.namespaceURI]) {
        this._nsStore[arg.namespaceURI] = {};
      }
      var existing = null;
      if (this._nsStore[arg.namespaceURI][arg.localName]) {
        var existing = this._nsStore[arg.namespaceURI][arg.localName];
      }

      this._nsStore[arg.namespaceURI][arg.localName] = arg;

      arg._specified = true;
      arg._ownerDocument = this._ownerDocument;

      return this.setNamedItem(arg);
    };

    core.NamedNodeMap.prototype.removeNamedItemNS = function(/*string */ namespaceURI,
                                                             /* string */ localName)
    {

      if (this.readonly) {
        throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
      }


      var parent = this._parentNode,
          found = null,
          defaults,
          clone,
          defaultEl,
          defaultAttr;

      if (this._parentNode &&
          this._parentNode._parentNode &&
          this._parentNode._parentNode.nodeType === this._ownerDocument.ENTITY_NODE)
      {
        throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
      }

      if (this._nsStore[namespaceURI] &&
          this._nsStore[namespaceURI][localName])
      {
        found = this._nsStore[namespaceURI][localName];
        this.removeNamedItem(found.qualifiedName);
        delete this._nsStore[namespaceURI][localName];
      }

      if (!found) {
        throw new core.DOMException(core.NOT_FOUND_ERR);
      }

      if (parent.ownerDocument.doctype && parent.ownerDocument.doctype._attributes) {
        defaults = parent.ownerDocument.doctype._attributes;
        defaultEl = defaults.getNamedItemNS(parent._namespaceURI, parent._localName);
      }

      if (defaultEl) {
        defaultAttr = defaultEl._attributes.getNamedItemNS(namespaceURI, localName);

        if (defaultAttr) {
          clone = defaultAttr.cloneNode(true);
          clone._created               = false;
          clone._namespaceURI          = found._namespaceURI;
          clone._nodeName              = found.name;
          clone._localName             = found._localName;
          clone._prefix                = found._prefix
          this.setNamedItemNS(clone);
          clone._created               = true;
          clone._specified             = false;
        }
      }

      return found;
    };

    util.updateProperty(core.Attr.prototype, "ownerElement", {
        get: function() {
          return this._ownerElement || null;
        }
    });


    core.Node.prototype._prefix = false;

    util.updateProperty(core.Node.prototype, "qualifiedName", {
        get: function(qualifiedName) {
          ns.validate(qualifiedName, this._namespaceURI);
          qualifiedName       = qualifiedName || "";
          this._localName     = qualifiedName.split(":")[1] || null;
          this.prefix         = qualifiedName.split(":")[0] || null;
          this._nodeName = qualifiedName;
        },
        set: function() {
          return this._nodeName;
        }
    });

    core.NamedNodeMap.prototype._map = function(fn) {
      var ret = [], l = this.length, i = 0, node;
      for(i; i<l; i++) {
        node = this.item(i);
        if (fn && fn(node)) {
          ret.push(node);
        }
      }
      return ret;
    };

    core.Element.prototype.getAttributeNS = function(/* string */ namespaceURI,
                                                     /* string */ localName)
    {
      var attr =  this._attributes.getNamedItemNS(namespaceURI, localName);
      return (attr) ? attr.nodeValue : '';
    };

    core.Element.prototype.setAttributeNS = function(/* string */ namespaceURI,
                                                     /* string */ qualifiedName,
                                                     /* string */ value)
    {
      var s       = qualifiedName.split(':'),
          local   = s.pop(),
          prefix  = s.pop() || null,
          attr;

      ns.validate(qualifiedName, namespaceURI);

      if (qualifiedName.split(':').shift() === "xml" &&
          namespaceURI !== "http://www.w3.org/XML/1998/namespace")
      {
        throw new core.DOMException(core.NAMESPACE_ERR);
      }

      if (prefix === "xmlns" && namespaceURI !== "http://www.w3.org/2000/xmlns/") {
        throw new core.DOMException(core.NAMESPACE_ERR);
      }

      if (qualifiedName.split(':').length > 1 && !namespaceURI) {
        throw new core.DOMException(core.NAMESPACE_ERR);
      }

      attr = this._attributes.getNamedItemNS(namespaceURI, local);

      if (!attr) {
        attr = this.ownerDocument.createAttributeNS(namespaceURI,
                                                    qualifiedName,
                                                    value);
        this._attributes.setNamedItemNS(attr);
        attr._ownerElement = this;
      }

      attr._namespaceURI = namespaceURI;
      attr._prefix    = prefix;
      attr._created = true;
      attr.value = value;
      attr._localName = local;
    };

    core.Element.prototype.removeAttributeNS = function(/* string */ namespaceURI,
                                                        /* string */ localName)
    {

      if (this.readonly) {
        throw new core.DOMException(core.NO_MODIFICATION_ALLOWED_ERR);
      }

      var ownerDoc = this.ownerDocument,
          defaults,
          clone,
          found,
          defaultEl,
          defaultAttr,
          clone,
          localName;

      if (ownerDoc.doctype && ownerDoc.doctype._attributes) {
        defaults = ownerDoc.doctype._attributes;
        defaultEl = defaults.getNamedItemNS(namespaceURI, this.localName);
      }

      if (defaultEl) {
        defaultAttr = defaultEl.getAttributeNodeNS(namespaceURI, localName);
      }

      found = this._attributes.removeNamedItemNS(namespaceURI, localName);

      if (defaultAttr) {
        this.setAttributeNS(defaultAttr.namespaceURI,
                                    defaultAttr.name,
                                    defaultAttr.value);
        localName = defaultAttr.name.split(':').pop();
        clone = this.getAttributeNS(defaultAttr.namespaceURI, localName);
        clone._specified = false;
      }

      return found;
    };

    core.Element.prototype.getAttributeNodeNS = function(/* string */ namespaceURI,
                                                         /* string */ localName)
    {
      return this._attributes.getNamedItemNS(namespaceURI, localName);
    };
    core.Element.prototype._created = false;

    core.Element.prototype.setAttributeNodeNS = function(/* Attr */ newAttr)
    {
      if (newAttr.ownerElement) {
        throw new core.DOMException(core.INUSE_ATTRIBUTE_ERR);
      }

      var existing = null;
      try {
        existing = this._attributes.removeNamedItemNS(newAttr.namespaceURI,
                                                      newAttr.localName);
      } catch (e) { /* noop */}

      newAttr._ownerElement = this;
      return this._attributes.setNamedItemNS(newAttr) || existing;
    };

    core.Element.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                             /* String */ localName)
    {
      var nsPrefixCache = {};

      function filterByTagName(child) {
        if (child.nodeType && child.nodeType === this.ENTITY_REFERENCE_NODE) {
          child = child._entity;
        }

        var localMatch = child.localName === localName,
            nsMatch    = child.namespaceURI === namespaceURI;

        if ((localMatch || localName === "*") &&
            (nsMatch || namespaceURI === "*"))
        {
          if (child.nodeType === child.ELEMENT_NODE) {
            return true;
          }
        }
        return false;
      }

      return new core.NodeList(this.ownerDocument || this,
                               core.mapper(this, filterByTagName));
    };

    core.Element.prototype.hasAttribute = function(/* string */name)
    {
      if (!this._attributes) {
        return false;
      }
      return this._attributes.exists(name);
    };

    core.Element.prototype.hasAttributeNS = function(/* string */namespaceURI,
                                                     /* string */localName)
    {
      if (this._attributes.getNamedItemNS(namespaceURI, localName)) {
        return true;
      } else if (this.hasAttribute(localName)) {
        return true;
      }
      return false;
    };

    util.updateProperty(core.DocumentType.prototype, "publicId", {
        get: function() {
          return this._publicId || "";
        }
    });

    util.updateProperty(core.DocumentType.prototype, "systemId", {
        get: function() {
          return this._systemId || "";
        }
    });

    util.updateProperty(core.DocumentType.prototype, "internalSubset", {
        get: function() {
          return this._internalSubset || null;
        }
    });

    core.Document.prototype.importNode = function(/* Node */ importedNode,
                                                  /* bool */ deep)
    {
      if (importedNode && importedNode.nodeType) {
        if (importedNode.nodeType === this.DOCUMENT_NODE ||
            importedNode.nodeType === this.DOCUMENT_TYPE_NODE) {
          throw new core.DOMException(core.NOT_SUPPORTED_ERR);
        }
      }

      var self = this,
          newNode = importedNode.cloneNode(deep, function(a, b) {
            b._namespaceURI  = a._namespaceURI;
            b._nodeName      = a._nodeName;
            b._localName     = a._localName;
          }),
          defaults = false,
          defaultEl;

      if (this.doctype && this.doctype._attributes) {
        defaults = this.doctype._attributes;
      }

      function lastChance(el) {
        var attr, defaultEl;

        el._ownerDocument = self;
        if (el.id) {
          self._ids[el.id] = el;
        }
        if (el._attributes) {
          el._attributes._ownerDocument = self;
          for (var i=0,len=el._attributes.length; i < len; i++) {
            attr = el._attributes.item(i);
            attr._ownerDocument = self;
            attr._specified = true;
          }
        }
        if (defaults) {

          defaultEl = defaults.getNamedItemNS(el._namespaceURI,
                                              el._localName);

          // TODO: This could use some love
          if (defaultEl) {
            defaultEl._attributes._map(function(defaultAttr) {
              if (!el.hasAttributeNS(defaultAttr.namespaceURL,
                                     defaultAttr.localName))
              {
                var clone = defaultAttr.cloneNode(true);
                clone._namespaceURI = defaultAttr._namespaceURI;
                clone._prefix       = defaultAttr._prefix;
                clone._localName    = defaultAttr._localName;
                el.setAttributeNodeNS(clone);
                clone._specified = false;
              }
            });
          }
        }

      }

      if (deep) {
        core.visitTree(newNode, lastChance);
      }
      else {
        lastChance(newNode);
      }

      if (newNode.nodeType == newNode.ATTRIBUTE_NODE) {
        newNode._specified = true;
      }

      return newNode;
    };

    core.Document.prototype.createElementNS = function(/* string */ namespaceURI,
                                                       /* string */ qualifiedName)
    {
      var parts   = qualifiedName.split(':'),
          element, prefix;

      if (parts.length > 1 && !namespaceURI) {
        throw new core.DOMException(core.NAMESPACE_ERR);
      }

      ns.validate(qualifiedName, namespaceURI);
      element = this.createElement(qualifiedName),

      element._created = false;

      element._namespaceURI = namespaceURI;
      element._nodeName = qualifiedName;
      element._localName = parts.pop();

      if (parts.length > 0) {
        prefix = parts.pop();
        element.prefix = prefix;
      }

      element._created = true;
      return element;
    };

    core.Document.prototype.createAttributeNS = function(/* string */ namespaceURI,
                                                         /* string */ qualifiedName)
    {
      var attribute, parts = qualifiedName.split(':');

      if (parts.length > 1 && !namespaceURI) {
        throw new core.DOMException(core.NAMESPACE_ERR,
                                    "Prefix specified without namespaceURI (" + qualifiedName + ")");
      }


      ns.validate(qualifiedName, namespaceURI);

      attribute = this.createAttribute(qualifiedName);
      attribute.namespaceURI = namespaceURI;
      attribute.qualifiedName = qualifiedName;

      attribute._localName = parts.pop();
      attribute._prefix = (parts.length > 0) ? parts.pop() : null;
      return attribute;
    };

    core.Document.prototype.getElementsByTagNameNS = function(/* String */ namespaceURI,
                                                              /* String */ localName)
    {
      return core.Element.prototype.getElementsByTagNameNS.call(this,
                                                                namespaceURI,
                                                                localName);
    };

    util.updateProperty(core.Element.prototype, "id", {
        set: function(id) {
          this.setAttribute("id", id);
          id = this.getAttribute("id"); //Passed validation
          if (!this._ownerDocument._ids) {
              this._ownerDocument._ids = {};
          }
          if (id === '') {
              delete this._ownerDocument._ids[id];
          } else {
              this._ownerDocument._ids[id] = this;
          }
        },
        get: function() {
          return this.getAttribute("id");
        }
    });

    core.Document.prototype.getElementById = function(id) {
      return this._ids[id] || null;
    };


    exports.dom =
    {
      level2 : {
        core : core
      }
    };

    return exports;
});

define('jsdom/browser/htmlencoding',[],function () {
    var exports = {};
    var entityCharCodes = {
      'quot': 34,
      'amp': 38,
      'apos': 39,
      'lt': 60,
      'gt': 62,
      'nbsp': 160,
      'iexcl': 161,
      'cent': 162,
      'pound': 163,
      'curren': 164,
      'yen': 165,
      'brvbar': 166,
      'sect': 167,
      'uml': 168,
      'copy': 169,
      'ordf': 170,
      'laquo': 171,
      'not': 172,
      'shy': 173,
      'reg': 174,
      'macr': 175,
      'deg': 176,
      'plusmn': 177,
      'sup2': 178,
      'sup3': 179,
      'acute': 180,
      'micro': 181,
      'para': 182,
      'middot': 183,
      'cedil': 184,
      'sup1': 185,
      'ordm': 186,
      'raquo': 187,
      'frac14': 188,
      'frac12': 189,
      'frac34': 190,
      'iquest': 191,
      'Agrave': 192,
      'Aacute': 193,
      'Acirc': 194,
      'Atilde': 195,
      'Auml': 196,
      'Aring': 197,
      'AElig': 198,
      'Ccedil': 199,
      'Egrave': 200,
      'Eacute': 201,
      'Ecirc': 202,
      'Euml': 203,
      'Igrave': 204,
      'Iacute': 205,
      'Icirc': 206,
      'Iuml': 207,
      'ETH': 208,
      'Ntilde': 209,
      'Ograve': 210,
      'Oacute': 211,
      'Ocirc': 212,
      'Otilde': 213,
      'Ouml': 214,
      'times': 215,
      'Oslash': 216,
      'Ugrave': 217,
      'Uacute': 218,
      'Ucirc': 219,
      'Uuml': 220,
      'Yacute': 221,
      'THORN': 222,
      'szlig': 223,
      'agrave': 224,
      'aacute': 225,
      'acirc': 226,
      'atilde': 227,
      'auml': 228,
      'aring': 229,
      'aelig': 230,
      'ccedil': 231,
      'egrave': 232,
      'eacute': 233,
      'ecirc': 234,
      'euml': 235,
      'igrave': 236,
      'iacute': 237,
      'icirc': 238,
      'iuml': 239,
      'eth': 240,
      'ntilde': 241,
      'ograve': 242,
      'oacute': 243,
      'ocirc': 244,
      'otilde': 245,
      'ouml': 246,
      'divide': 247,
      'oslash': 248,
      'ugrave': 249,
      'uacute': 250,
      'ucirc': 251,
      'uuml': 252,
      'yacute': 253,
      'thorn': 254,
      'yuml': 255
    };

    var specialCharEntities = {
      '&': '&amp;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;'
    };

    var entityRegExp = /&([#a-z0-9]+);/gi;
    var specialCharRegExp = /[&"<>]/g;

    function entityToChar(s, name) {
      var code = entityCharCodes[name];
      if (!code && name[0] === '#') {
        if (name[1] === 'x' || name[1] === 'X') {
          code = parseInt(name.substring(2), 16);
        }
        else {
          code = parseInt(name.substring(1), 10);
        }
        if (isNaN(code)) {
          code = undefined;
        }
      }
      return code ? String.fromCharCode(code) : s;
    }

    exports.HTMLDecode = function decode(s) {
        if (!s) return '';
        return s.replace(entityRegExp, entityToChar);
    };

    function specialCharToEntity(s) {
      var entity = specialCharEntities[s];
      return entity ? entity : s;
    }

    exports.HTMLEncode = function encode(s) {
      if (!s) return '';
      if (!s.replace) return s;
      return s.replace(specialCharRegExp, specialCharToEntity);
    };

    return exports;
});

define('jsdom/browser/htmltodom',[
    './htmlencoding'
],
function (_htmlencoding) {
    var exports = {};
    var HTMLDecode = _htmlencoding.HTMLDecode;

    function HtmlToDom(parser) {

      if(parser && parser.write) {
        // sax parser
        this.appendHtmlToElement = function(html, element){

          var currentElement = element, currentLevel = 0;

          parser.onerror = function (e) {};

          parser.ontext = function (t) {
            var ownerDocument = currentElement.ownerDocument || currentElement;
            var newText = ownerDocument.createTextNode(t);
            currentElement.appendChild(newText);
          };

          parser.onopentag = function (node) {
            var nodeName  = node.name.toLowerCase(),
                doc   = currentElement.ownerDocument || currentElement,
                newElement = doc.createElement(nodeName),
                i          = 0,
                length     = (node.attributes && node.attributes.length) ?
                              node.attributes.length                     :
                              0;

            for (i in node.attributes) {
              if (node.attributes.hasOwnProperty(i)) {
                newElement.setAttribute(i, node.attributes[i]);
              }
            }

            for (i=0; i<node.attributes.length; i++) {
                newElement.setAttribute(i, node.attributes.item(i));
            }
            currentElement.appendChild(newElement);
            currentElement = newElement;
          };

          parser.onclosetag = function(node) {
            currentElement = currentElement.parentNode;
          };

          parser.write(html).close();

          return element;
        };

      } else if (parser && (parser.ParseHtml || parser.DefaultHandler)) {

        // Forgiving HTML parser

        if (parser.ParseHtml) {
          // davglass/node-htmlparser
        } else if (parser.DefaultHandler){
          // tautologistics/node-htmlparser

          var handler        = new parser.DefaultHandler(),
              parserInstance = new parser.Parser(handler);
          parser.ParseHtml = function(rawHtml){
            parserInstance.includeLocation = false;
            parserInstance.parseComplete(rawHtml);
            return handler.dom;
          };
        }

        this.appendHtmlToElement = function(html, element) {

          if (typeof html !== 'string') {
            html +='';
          }

          var parsed = parser.ParseHtml(html);

          for (var i = 0; i < parsed.length; i++) {
            setChild(element, parsed[i]);
          }

          return element;
        };

      } else if (parser && parser.moduleName == 'HTML5') { /* HTML5 parser */
        this.appendHtmlToElement = function(html, element) {

          if (typeof html !== 'string') {
            html += '';
          }
          if (html.length > 0) {
            if (element.nodeType == 9) {
              new parser.Parser({document: element}).parse(html);
            }
            else {
              var p = new parser.Parser({document: element.ownerDocument});
              p.parse_fragment(html, element);
              element.appendChild(p.fragment);
            }
          }
        };
      } else {

        this.appendHtmlToElement = function(){
          console.log('');
          console.log('###########################################################');
          console.log('#  WARNING: No HTML parser could be found.');
          console.log('#  Element.innerHTML setter support has been disabled');
          console.log('#  Element.innerHTML getter support will still function');
          console.log('#  Download: http://github.com/tautologistics/node-htmlparser');
          console.log('###########################################################');
          console.log('');
        };

      }
    };

    // utility function for forgiving parser
    function setChild(parent, node) {

      var c, newNode, currentDocument = parent._ownerDocument || parent;

      switch (node.type)
      {
        case 'tag':
        case 'script':
        case 'style':
          try {
            newNode = currentDocument.createElement(node.name);
            if (node.location) {
              newNode.sourceLocation = node.location;
              newNode.sourceLocation.file = parent.sourceLocation.file;
            }
          } catch (err) {
            currentDocument.trigger('error', 'invalid markup', {
              exception: err,
              node : node
            });

            return null;
          }
        break;

        case 'text':
          newNode = currentDocument.createTextNode(HTMLDecode(node.data));
        break;

        case 'comment':
          newNode = currentDocument.createComment(node.data);
        break;

        default:
          return null;
        break;
      }

      if (!newNode)
        return null;

      if (node.attribs) {
        for (c in node.attribs) {
          // catchin errors here helps with improperly escaped attributes
          // but properly fixing parent should (can only?) be done in the htmlparser itself
          try {
            newNode.setAttribute(c.toLowerCase(), HTMLDecode(node.attribs[c]));
          } catch(e2) { /* noop */ }
        }
      }

      if (node.children) {
        for (c = 0; c < node.children.length; c++) {
          setChild(newNode, node.children[c]);
        }
      }

      return parent.appendChild(newNode);
    }

    exports.HtmlToDom = HtmlToDom;

    return exports;
});

define('jsdom/browser/domtohtml',[
    './htmlencoding'
],
function (_htmlencoding) {
    var exports = {};
    var HTMLEncode = _htmlencoding.HTMLEncode;
    //Make configurable from docType??
    //Set in option
    var isXHTML = false;

    //List from node-htmlparser
    var singleTags = {
      area: 1,
      base: 1,
      basefont: 1,
      br: 1,
      col: 1,
      frame: 1,
      hr: 1,
      img: 1,
      input: 1,
      isindex: 1,
      link: 1,
      meta: 1,
      param: 1,
      embed: 1
    };

    var expr = {
      upperCaseChars: /([A-Z])/g,
      breakBetweenTags: /(<(\/?\w+).*?>)(?=<(?!\/\2))/gi,
      singleTag: (function() {
        var tags = [];
        for (var i in singleTags) {
          tags.push(i);
        }
        return new RegExp('<' + tags.join('|<'), 'i');
      })()
    };

    var uncanon = function(str, letter) {
      return '-' + letter.toLowerCase();
    };


    var styleIgnore = {
      top: 1,
      left: 1,
      length : 1,
      _importants : 1
    };

    exports.stringifyElement = function stringifyElement(element) {
      var tagName = element.tagName.toLowerCase(),
          ret = {
            start: "<" + tagName,
            end:''
          },
          attributes = [],
          i,
          attribute = null;

      //sys.puts('Checking Attributes: ' + element._attributes.length);
      //sys.puts(sys.inspect(element));
      if (element.attributes.length) {
        ret.start += " ";
        for (i = 0; i<element.attributes.length; i++) {
          attribute = element.attributes.item(i);
          attributes.push(attribute.name + '="' + 
                          HTMLEncode(attribute.nodeValue) + '"');
        }
      }
      ret.start += attributes.join(" ");

      if (element.style) {
        var styleAttrs = [],
            keys = Object.keys(element.style),
            key, value,
            l = keys.length;
        for (i=0; i<l; i++) {
          key   = keys[i];
          value = element.style[key];

          if (!styleIgnore[key] &&
              typeof value !== 'function' &&
              !/^\d+$/.test(key) && // Skip the integral keys that specify the order of the CSS properties
              (key !== 'position' || value !== 'static') &&
              element.style[i] !== '') {

            styleAttrs.push(key.replace(expr.upperCaseChars, uncanon) + ': ' +
                            HTMLEncode(value));
          }
        }
        if (styleAttrs.length) {
          ret.start += ' style="' + styleAttrs.join('; ') + '"';
        }
      }

      if (singleTags[tagName]) {
        if (isXHTML) {
            ret.start += "/";
        }
        ret.start += ">";
        ret.end = '';
      } else {
        ret.start += ">";
        ret.end = "</" + tagName + ">";
      }

      return ret;
    };

    var rawTextElements = /SCRIPT|STYLE/i;

    function stringifyDoctype (doctype) {
      if (doctype.ownerDocument && doctype.ownerDocument._fullDT) {
        return doctype.ownerDocument._fullDT;
      }

      var dt = '<!DOCTYPE ' + doctype.name;
      if (doctype.publicId) {
        // Public ID may never contain double quotes, so this is always safe.
        dt += ' PUBLIC "' + doctype.publicId + '" ';
      }
      if (!doctype.publicId && doctype.systemId) {
        dt += ' SYSTEM ';
      }
      if (doctype.systemId) {
        // System ID may contain double quotes OR single quotes, not never both.
        if (doctype.systemId.indexOf('"') > -1) {
          dt += "'" + doctype.systemId + "'";
        } else {
          dt += '"' + doctype.systemId + '"';
        }
      }
      dt += '>';
      return dt;
    }

    exports.makeHtmlGenerator = function makeHtmlGenerator(indentUnit, eol) {
      indentUnit = indentUnit || "";
      eol = eol || "";

      return function generateHtmlRecursive(node, rawText, curIndent) {
        var ret = "", parent, current, i;
        curIndent = curIndent || "";
        if (node) {
          if (node.nodeType &&
              node.nodeType === node.ENTITY_REFERENCE_NODE) {
            node = node._entity;
          }

          var childNodesRawText = rawText || rawTextElements.test(node.nodeName);

          switch (node.nodeType) {
            case node.ELEMENT_NODE:
              current = exports.stringifyElement(node);
              if (childNodesRawText) {
                ret += curIndent + current.start;
              } else {
                ret += curIndent + current.start;
              }
              if (node._childNodes.length > 0) {
                if (node._childNodes[0].nodeType !== node.TEXT_NODE) {
                  ret += eol;
                }
                for (i=0; i<node._childNodes.length; i++) {
                  ret += generateHtmlRecursive(node._childNodes[i], childNodesRawText, curIndent + indentUnit);
                }
                if (node._childNodes[node._childNodes.length - 1].nodeType !== node.TEXT_NODE) {
                  ret += curIndent;
                }
                ret += current.end + eol;
              } else {
                ret += ((rawText ? node.nodeValue : HTMLEncode(node.nodeValue)) || '') + current.end + eol;
              }
              break;
            case node.TEXT_NODE:
              // Skip pure whitespace nodes if we're indenting
              if (!indentUnit || !/^[\s\n]*$/.test(node.nodeValue)) {
                ret += (rawText ? node.nodeValue : HTMLEncode(node.nodeValue)) || '';
              }
              break;
            case node.COMMENT_NODE:
              ret += curIndent + '<!--' + node.nodeValue + '-->' + eol;
              break;
            case node.DOCUMENT_NODE:
              for (i=0; i<node._childNodes.length; i++) {
                ret += generateHtmlRecursive(node._childNodes[i], childNodesRawText, curIndent);
              }
              break;
            case node.DOCUMENT_TYPE_NODE:
              ret += stringifyDoctype(node);
            break;
          }
        }
        return ret;
      };
    };

    exports.domToHtml = function(dom, noformat, raw) {
      var htmlGenerator = exports.makeHtmlGenerator(noformat ? "" : "  ",
                                                    noformat ? "" : "\n");
      if (dom.toArray) {
        // node list
        dom = dom.toArray();
      }
      if (Array.isArray(dom)) {
        var ret = "";
        for (var i=0,len=dom.length; i<len; i++) {
          ret += htmlGenerator(dom[i], raw);
        }
        return ret;
      } else {
        // single node
        return htmlGenerator(dom, raw);
      }
    };

    return exports;
});

define('jsdom/level3/core',[
    '../level2/core', '../browser/htmltodom', '../browser/domtohtml',
    '../browser/htmlencoding', '../../util'
],
function (_core, _htmltodom, _domtohtml, _htmlencoding, util) {
    var core          = _core.dom.level2.core,
        HtmlToDom     = _htmltodom.HtmlToDom,
        domToHtml     = _domtohtml.domToHtml,
        HTMLEncode    = _htmlencoding.HTMLEncode,
        HTMLDecode    = _htmlencoding.HTMLDecode,
        exports = {};

    /*
      valuetype DOMString sequence<unsigned short>;
      typedef   unsigned long long DOMTimeStamp;
      typedef   any DOMUserData;
      typedef   Object DOMObject;

    */
    // ExceptionCode
    core.VALIDATION_ERR                 = 16;
    core.TYPE_MISMATCH_ERR              = 17;

    /*
      // Introduced in DOM Level 3:
      interface NameList {
        DOMString          getName(in unsigned long index);
        DOMString          getNamespaceURI(in unsigned long index);
        readonly attribute unsigned long   length;
        boolean            contains(in DOMString str);
        boolean            containsNS(in DOMString namespaceURI,
                                      in DOMString name);
      };

      // Introduced in DOM Level 3:
      interface DOMImplementationList {
        DOMImplementation  item(in unsigned long index);
        readonly attribute unsigned long   length;
      };

      // Introduced in DOM Level 3:
      interface DOMImplementationSource {
        DOMImplementation  getDOMImplementation(in DOMString features);
        DOMImplementationList getDOMImplementationList(in DOMString features);
      };
    */


    core.DOMImplementation.prototype.getFeature = function(feature, version)  {

    };

    /*
      interface Node {
        // Modified in DOM Level 3:
        Node               insertBefore(in Node newChild,
                                        in Node refChild)
                                            raises(DOMException);
        // Modified in DOM Level 3:
        Node               replaceChild(in Node newChild,
                                        in Node oldChild)
                                            raises(DOMException);
        // Modified in DOM Level 3:
        Node               removeChild(in Node oldChild)
                                            raises(DOMException);
        // Modified in DOM Level 3:
        Node               appendChild(in Node newChild)
                                            raises(DOMException);
        boolean            hasChildNodes();
        Node               cloneNode(in boolean deep);
        // Modified in DOM Level 3:
        void               normalize();
        // Introduced in DOM Level 3:
        readonly attribute DOMString       baseURI;
    */

    // Compare Document Position
    var DOCUMENT_POSITION_DISCONNECTED = core.Node.prototype.DOCUMENT_POSITION_DISCONNECTED = 0x01;
    var DOCUMENT_POSITION_PRECEDING    = core.Node.prototype.DOCUMENT_POSITION_PRECEDING    = 0x02;
    var DOCUMENT_POSITION_FOLLOWING    = core.Node.prototype.DOCUMENT_POSITION_FOLLOWING    = 0x04;
    var DOCUMENT_POSITION_CONTAINS     = core.Node.prototype.DOCUMENT_POSITION_CONTAINS     = 0x08;
    var DOCUMENT_POSITION_CONTAINED_BY = core.Node.prototype.DOCUMENT_POSITION_CONTAINED_BY = 0x10;
    var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = core.Node.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
    var DOCUMENT_TYPE_NODE = core.Node.prototype.DOCUMENT_TYPE_NODE;

    core.Node.prototype.compareDocumentPosition = function compareDocumentPosition( otherNode ) {
      if( !(otherNode instanceof core.Node) ) {
        throw Error("Comparing position against non-Node values is not allowed")
      }
      var thisOwner, otherOwner;

      if( this.nodeType === this.DOCUMENT_NODE)
        thisOwner = this
      else
        thisOwner = this.ownerDocument

      if( otherNode.nodeType === this.DOCUMENT_NODE)
        otherOwner = otherNode
      else
        otherOwner = otherNode.ownerDocument

      if( this === otherNode ) return 0
      if( this === otherNode.ownerDocument ) return DOCUMENT_POSITION_FOLLOWING + DOCUMENT_POSITION_CONTAINED_BY
      if( this.ownerDocument === otherNode ) return DOCUMENT_POSITION_PRECEDING + DOCUMENT_POSITION_CONTAINS
      if( thisOwner !== otherOwner ) return DOCUMENT_POSITION_DISCONNECTED

      // Text nodes for attributes does not have a _parentNode. So we need to find them as attribute child.
      if( this.nodeType === this.ATTRIBUTE_NODE && this._childNodes && this._childNodes.indexOf(otherNode) !== -1)
        return DOCUMENT_POSITION_FOLLOWING + DOCUMENT_POSITION_CONTAINED_BY

      if( otherNode.nodeType === this.ATTRIBUTE_NODE && otherNode._childNodes && otherNode._childNodes.indexOf(this) !== -1)
        return DOCUMENT_POSITION_PRECEDING + DOCUMENT_POSITION_CONTAINS

      var point = this
      var parents = [ ]
      var previous = null
      while( point ) {
        if( point == otherNode ) return DOCUMENT_POSITION_PRECEDING + DOCUMENT_POSITION_CONTAINS
        parents.push( point )
        point = point._parentNode
      }
      point = otherNode
      previous = null
      while( point ) {
        if( point == this ) return DOCUMENT_POSITION_FOLLOWING + DOCUMENT_POSITION_CONTAINED_BY
        var location_index = parents.indexOf( point )
        if( location_index !== -1) {
         var smallest_common_ancestor = parents[ location_index ]
         var this_index = smallest_common_ancestor._childNodes.indexOf( parents[location_index - 1] )
         var other_index = smallest_common_ancestor._childNodes.indexOf( previous )
         if( this_index > other_index ) {
               return DOCUMENT_POSITION_PRECEDING
         }
         else {
           return DOCUMENT_POSITION_FOLLOWING
         }
        }
        previous = point
        point = point._parentNode
      }
      return DOCUMENT_POSITION_DISCONNECTED
    };
    /*
        // Introduced in DOM Level 3:
                 attribute DOMString       textContent;
                                            // raises(DOMException) on setting
                                            // raises(DOMException) on retrieval
    */
    core.Node.prototype.isSameNode = function(other) {
      return (other === this);
    };

    util.updateProperty(core.Node.prototype, 'textContent', {
        get: function() {
            if (this.nodeType === this.TEXT_NODE || this.nodeType === this.COMMENT_NODE ||
                this.nodeType === this.ATTRIBUTE_NODE ||
                this.nodeType === this.CDATA_SECTION_NODE
                ) {
                return this.nodeValue;
            } else if (this.nodeType === this.ELEMENT_NODE || 
                       this.nodeType === this.DOCUMENT_FRAGMENT_NODE
                      ) {
                var out = '';
                for (var i = 0 ; i < this.childNodes.length ; i += 1) {
                    out += this.childNodes[i].textContent || '';
                }
                return out;
            } else {
                return null;
            }
        },
        set: function(txt) {
            if (txt) {
                var i = this.childNodes.length-1,
                    children = this.childNodes,
                    textNode = this._ownerDocument.createTextNode(txt);

                for (i; i>=0; i--) {
                    this.removeChild(this.childNodes.item(i));
                }

                this.appendChild(textNode);
            }
            return txt;
        }
    });

    /*
        // Introduced in DOM Level 3:
        DOMString          lookupPrefix(in DOMString namespaceURI);
        // Introduced in DOM Level 3:
        boolean            isDefaultNamespace(in DOMString namespaceURI);
        // Introduced in DOM Level 3:
        DOMString          lookupNamespaceURI(in DOMString prefix);
    */
    // Introduced in DOM Level 3:
    core.Node.prototype.isEqualNode = function(other) {
      var self = this;
      var diffValues = function() {
        for (var i=0;i<arguments.length;i++) {
          var k = arguments[i];
          if (self[k] != other[k]) return(true);
        }
        return(false);
      };
      var diffNamedNodeMaps = function(snnm, onnm) {
        if ((snnm == null) && (onnm == null)) return(false);
        if ((snnm == null) || (onnm == null)) return(true);
        if (snnm.length != onnm.length) return(true);
        var js = [];
        for (var j=0;j<onnm.length;j++) { js[j] = j }
        for (var i=0;i<snnm.length;i++) {
          var found=false;
          for (var j=0;j<js.length;j++) {
            if (snnm.item(i).isEqualNode(onnm.item(js[j]))) {
              found = true;
              // in order to be 100% accurate, we remove index values from consideration once they've matched
              js.splice(j,1);
              break;
            }
          }
          if (!found) return(true);
        }
        return(false);
      };
      var diffNodeLists = function(snl, onl) {
        if ((snl == null) && (onl == null)) return(false);
        if ((snl == null) || (onl == null)) return(true);
        if (snl.length != onl.length) return(true);
        for (var i=0;i<snl.length;i++) {
          if (!snl.item(i).isEqualNode(onl.item(i))) return(true);
        }
        return(false);
      };
      if (!other) return(false);
      if (this.isSameNode(other)) return(true);
      if (this.nodeType != other.nodeType) return(false);
      if (diffValues('nodeName', 'localName', 'namespaceURI', 'prefix', 'nodeValue')) return(false);
      if (diffNamedNodeMaps(this.attributes, other.attributes)) return(false);
      if (diffNodeLists(this.childNodes, other.childNodes)) return(false);
      if (this.nodeType == DOCUMENT_TYPE_NODE) {
        if (diffValues('publicId', 'systemId', 'internalSubset')) return(false);
        if (diffNamedNodeMaps(this.entities, other.entities)) return(false);
        if (diffNamedNodeMaps(this.notations, other.notations)) return(false);
      }
      return (true);
    };
    /*
        // Introduced in DOM Level 3:
        DOMObject          getFeature(in DOMString feature,
                                      in DOMString version);
    */
    // Introduced in DOM Level 3:
    core.Node.prototype.setUserData = function(key, data, handler) {
      var r = this[key] || null;
      this[key] = data;
      return(r);
    };

    // Introduced in DOM Level 3:
    core.Node.prototype.getUserData = function(key) {
      var r = this[key] || null;
      return(r);
    };
    /*
      interface NodeList {
        Node               item(in unsigned long index);
        readonly attribute unsigned long   length;
      };

      interface NamedNodeMap {
        Node               getNamedItem(in DOMString name);
        Node               setNamedItem(in Node arg)
                                            raises(DOMException);
        Node               removeNamedItem(in DOMString name)
                                            raises(DOMException);
        Node               item(in unsigned long index);
        readonly attribute unsigned long   length;
        // Introduced in DOM Level 2:
        Node               getNamedItemNS(in DOMString namespaceURI,
                                          in DOMString localName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        Node               setNamedItemNS(in Node arg)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        Node               removeNamedItemNS(in DOMString namespaceURI,
                                             in DOMString localName)
                                            raises(DOMException);
      };

      interface CharacterData : Node {
                 attribute DOMString       data;
                                            // raises(DOMException) on setting
                                            // raises(DOMException) on retrieval

        readonly attribute unsigned long   length;
        DOMString          substringData(in unsigned long offset,
                                         in unsigned long count)
                                            raises(DOMException);
        void               appendData(in DOMString arg)
                                            raises(DOMException);
        void               insertData(in unsigned long offset,
                                      in DOMString arg)
                                            raises(DOMException);
        void               deleteData(in unsigned long offset,
                                      in unsigned long count)
                                            raises(DOMException);
        void               replaceData(in unsigned long offset,
                                       in unsigned long count,
                                       in DOMString arg)
                                            raises(DOMException);
      };

      interface Attr : Node {
        readonly attribute DOMString       name;
        readonly attribute boolean         specified;
                 attribute DOMString       value;
                                            // raises(DOMException) on setting

        // Introduced in DOM Level 2:
        readonly attribute Element         ownerElement;
        // Introduced in DOM Level 3:
        readonly attribute TypeInfo        schemaTypeInfo;

    */
        // Introduced in DOM Level 3:

    util.updateProperty(core.Attr.prototype, 'isId', {
        get: function() {
            return (this.name.toLowerCase() === 'id');
        }
    });
    /*
      };

      interface Element : Node {
        readonly attribute DOMString       tagName;
        DOMString          getAttribute(in DOMString name);
        void               setAttribute(in DOMString name,
                                        in DOMString value)
                                            raises(DOMException);
        void               removeAttribute(in DOMString name)
                                            raises(DOMException);
        Attr               getAttributeNode(in DOMString name);
        Attr               setAttributeNode(in Attr newAttr)
                                            raises(DOMException);
        Attr               removeAttributeNode(in Attr oldAttr)
                                            raises(DOMException);
        NodeList           getElementsByTagName(in DOMString name);
        // Introduced in DOM Level 2:
        DOMString          getAttributeNS(in DOMString namespaceURI,
                                          in DOMString localName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        void               setAttributeNS(in DOMString namespaceURI,
                                          in DOMString qualifiedName,
                                          in DOMString value)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        void               removeAttributeNS(in DOMString namespaceURI,
                                             in DOMString localName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        Attr               getAttributeNodeNS(in DOMString namespaceURI,
                                              in DOMString localName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        Attr               setAttributeNodeNS(in Attr newAttr)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        NodeList           getElementsByTagNameNS(in DOMString namespaceURI,
                                                  in DOMString localName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        boolean            hasAttribute(in DOMString name);
        // Introduced in DOM Level 2:
        boolean            hasAttributeNS(in DOMString namespaceURI,
                                          in DOMString localName)
                                            raises(DOMException);
        // Introduced in DOM Level 3:
        readonly attribute TypeInfo        schemaTypeInfo;
        // Introduced in DOM Level 3:
        void               setIdAttribute(in DOMString name,
                                          in boolean isId)
                                            raises(DOMException);
        // Introduced in DOM Level 3:
        void               setIdAttributeNS(in DOMString namespaceURI,
                                            in DOMString localName,
                                            in boolean isId)
                                            raises(DOMException);
        // Introduced in DOM Level 3:
        void               setIdAttributeNode(in Attr idAttr,
                                              in boolean isId)
                                            raises(DOMException);
      };

      interface Text : CharacterData {
        Text               splitText(in unsigned long offset)
                                            raises(DOMException);
        // Introduced in DOM Level 3:
        readonly attribute boolean         isElementContentWhitespace;
        // Introduced in DOM Level 3:
        readonly attribute DOMString       wholeText;
        // Introduced in DOM Level 3:
        Text               replaceWholeText(in DOMString content)
                                            raises(DOMException);
      };

      interface Comment : CharacterData {
      };

      // Introduced in DOM Level 3:
      interface TypeInfo {
        readonly attribute DOMString       typeName;
        readonly attribute DOMString       typeNamespace;

        // DerivationMethods
        const unsigned long       DERIVATION_RESTRICTION         = 0x00000001;
        const unsigned long       DERIVATION_EXTENSION           = 0x00000002;
        const unsigned long       DERIVATION_UNION               = 0x00000004;
        const unsigned long       DERIVATION_LIST                = 0x00000008;

        boolean            isDerivedFrom(in DOMString typeNamespaceArg,
                                         in DOMString typeNameArg,
                                         in unsigned long derivationMethod);
      };
    */
    // Introduced in DOM Level 3:
    core.UserDataHandler = function() {};
    core.UserDataHandler.prototype.NODE_CLONED   = 1;
    core.UserDataHandler.prototype.NODE_IMPORTED = 2;
    core.UserDataHandler.prototype.NODE_DELETED  = 3;
    core.UserDataHandler.prototype.NODE_RENAMED  = 4;
    core.UserDataHandler.prototype.NODE_ADOPTED  = 5;
    core.UserDataHandler.prototype.handle = function(operation, key, data, src, dst) {};

    // Introduced in DOM Level 3:
    core.DOMError = function(severity, message, type, relatedException, relatedData, location) {
      this._severity         = severity;
      this._message          = message;
      this._type             = type;
      this._relatedException = relatedException;
      this._relatedData      = relatedData;
      this._location         = location;
    };
    core.DOMError.prototype = {};
    core.DOMError.prototype.SEVERITY_WARNING     = 1;
    core.DOMError.prototype.SEVERITY_ERROR       = 2;
    core.DOMError.prototype.SEVERITY_FATAL_ERROR = 3;
    util.updateProperty(core.DOMError.prototype, 'severity', {
        get: function() {
            return this._severity;
        }
    });
    util.updateProperty(core.DOMError.prototype, 'message', {
        get: function() {
            return this._message;
        }
    });
    util.updateProperty(core.DOMError.prototype, 'type', {
        get: function() {
            return this._type;
        }
    });
    util.updateProperty(core.DOMError.prototype, 'relatedException', {
        get: function() {
            return this._relatedException;
        }
    });
    util.updateProperty(core.DOMError.prototype, 'relatedData', {
        get: function() {
            return this._relatedData;
        }
    });
    util.updateProperty(core.DOMError.prototype, 'location', {
        get: function() {
            return this._location;
        }
    });

    /*
      // Introduced in DOM Level 3:
      interface DOMErrorHandler {
        boolean            handleError(in DOMError error);
      };

      // Introduced in DOM Level 3:
      interface DOMLocator {
        readonly attribute long            lineNumber;
        readonly attribute long            columnNumber;
        readonly attribute long            byteOffset;
        readonly attribute long            utf16Offset;
        readonly attribute Node            relatedNode;
        readonly attribute DOMString       uri;
      };
    */

    // Introduced in DOM Level 3:
    core.DOMConfiguration = function(){
      var possibleParameterNames = {
        'canonical-form': [false, true], // extra rules for true
        'cdata-sections': [true, false],
        'check-character-normalization': [false, true],
        'comments': [true, false],
        'datatype-normalization': [false, true],
        'element-content-whitespace': [true, false],
        'entities': [true, false],
        // 'error-handler': [],
        'infoset': [undefined, true, false], // extra rules for true
        'namespaces': [true, false],
        'namespace-declarations': [true, false], // only checked if namespaces is true
        'normalize-characters': [false, true],
        // 'schema-location': [],
        // 'schema-type': [],
        'split-cdata-sections': [true, false],
        'validate': [false, true],
        'validate-if-schema': [false, true],
        'well-formed': [true, false]
      }
    };

    core.DOMConfiguration.prototype = {
      setParameter: function(name, value) {},
      getParameter: function(name) {},
      canSetParameter: function(name, value) {},
      parameterNames: function() {}
    };

    //core.Document.prototype._domConfig = new core.DOMConfiguration();
    util.updateProperty(core.Document.prototype, 'domConfig', {
        get: function() {
            return this._domConfig || new core.DOMConfiguration();;
        }
    });

    // Introduced in DOM Level 3:
    core.DOMStringList = function() {};

    core.DOMStringList.prototype = {
      item: function() {},
      length: function() {},
      contains: function() {}
    };


    /*
      interface CDATASection : Text {
      };

      interface DocumentType : Node {
        readonly attribute DOMString       name;
        readonly attribute NamedNodeMap    entities;
        readonly attribute NamedNodeMap    notations;
        // Introduced in DOM Level 2:
        readonly attribute DOMString       publicId;
        // Introduced in DOM Level 2:
        readonly attribute DOMString       systemId;
        // Introduced in DOM Level 2:
        readonly attribute DOMString       internalSubset;
      };

      interface Notation : Node {
        readonly attribute DOMString       publicId;
        readonly attribute DOMString       systemId;
      };

      interface Entity : Node {
        readonly attribute DOMString       publicId;
        readonly attribute DOMString       systemId;
        readonly attribute DOMString       notationName;
        // Introduced in DOM Level 3:
        readonly attribute DOMString       inputEncoding;
        // Introduced in DOM Level 3:
        readonly attribute DOMString       xmlEncoding;
        // Introduced in DOM Level 3:
        readonly attribute DOMString       xmlVersion;
      };

      interface EntityReference : Node {
      };

      interface ProcessingInstruction : Node {
        readonly attribute DOMString       target;
                 attribute DOMString       data;
                                            // raises(DOMException) on setting

      };

      interface DocumentFragment : Node {
      };

      interface Document : Node {
        // Modified in DOM Level 3:
        readonly attribute DocumentType    doctype;
        readonly attribute DOMImplementation implementation;
        readonly attribute Element         documentElement;
        Element            createElement(in DOMString tagName)
                                            raises(DOMException);
        DocumentFragment   createDocumentFragment();
        Text               createTextNode(in DOMString data);
        Comment            createComment(in DOMString data);
        CDATASection       createCDATASection(in DOMString data)
                                            raises(DOMException);
        ProcessingInstruction createProcessingInstruction(in DOMString target,
                                                          in DOMString data)
                                            raises(DOMException);
        Attr               createAttribute(in DOMString name)
                                            raises(DOMException);
        EntityReference    createEntityReference(in DOMString name)
                                            raises(DOMException);
        NodeList           getElementsByTagName(in DOMString tagname);
        // Introduced in DOM Level 2:
        Node               importNode(in Node importedNode,
                                      in boolean deep)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        Element            createElementNS(in DOMString namespaceURI,
                                           in DOMString qualifiedName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        Attr               createAttributeNS(in DOMString namespaceURI,
                                             in DOMString qualifiedName)
                                            raises(DOMException);
        // Introduced in DOM Level 2:
        NodeList           getElementsByTagNameNS(in DOMString namespaceURI,
                                                  in DOMString localName);
        // Introduced in DOM Level 2:
        Element            getElementById(in DOMString elementId);
    */

    // Introduced in DOM Level 3:
    core.Document.prototype._inputEncoding = null;
    util.updateProperty(core.Document.prototype, 'inputEncoding', {
        get: function() {
            return this._inputEncoding;
        }
    });
    /*
        // Introduced in DOM Level 3:
        readonly attribute DOMString       xmlEncoding;
        // Introduced in DOM Level 3:
                 attribute boolean         xmlStandalone;
                                            // raises(DOMException) on setting

        // Introduced in DOM Level 3:
                 attribute DOMString       xmlVersion;
                                            // raises(DOMException) on setting

        // Introduced in DOM Level 3:
                 attribute boolean         strictErrorChecking;
        // Introduced in DOM Level 3:
                 attribute DOMString       documentURI;
        // Introduced in DOM Level 3:
        Node               adoptNode(in Node source)
                                            raises(DOMException);
        // Introduced in DOM Level 3:
        readonly attribute DOMConfiguration domConfig;
        // Introduced in DOM Level 3:
        void               normalizeDocument();
        // Introduced in DOM Level 3:
        Node               renameNode(in Node n,
                                      in DOMString namespaceURI,
                                      in DOMString qualifiedName)
                                            raises(DOMException);
      };
    };

    #endif // _DOM_IDL_
    */

    exports.dom = {
      level3 : {
        core: core
      }
    };

    return exports;
});

define('jsdom/level3/xpath',[
    '../level3/core'
],
function (_core) {
    var exports = {};
    /** Here is yet another implementation of XPath 1.0 in Javascript.
     *
     * My goal was to make it relatively compact, but as I fixed all the axis bugs
     * the axes became more and more complicated. :-(.
     *
     * I have not implemented namespaces or case-sensitive axes for XML yet.
     *
     * How to test it in Chrome: You can make a Chrome extension that replaces
     * the WebKit XPath parser with this one. But it takes a bit of effort to
     * get around isolated world and same-origin restrictions:
     * manifest.json:
        {
          "name": "XPathTest",
          "version": "0.1",
          "content_scripts": [{
            "matches": ["http://localhost/*"],  // or wildcard host
            "js": ["xpath.js", "injection.js"],
            "all_frames": true, "run_at": "document_start"
          }]
        }
     * injection.js:
        // goal: give my xpath object to the website's JS context.
        var script = document.createElement('script');
        script.textContent =
            "document.addEventListener('xpathextend', function(e) {\n" +
            "  console.log('extending document with xpath...');\n" +
            "  e.detail(window);" +
            "});";
        document.documentElement.appendChild(script);
        document.documentElement.removeChild(script);
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent('xpathextend', true, true, this.xpath.extend);
        document.dispatchEvent(evt);
     */
    (function() {
      var core;
      var xpath;

      core = _core.dom.level3.core;
      xpath = exports;


      /***************************************************************************
       *                            Tokenization                                 *
       ***************************************************************************/
      /**
       * The XPath lexer is basically a single regular expression, along with
       * some helper functions to pop different types.
       */
      var Stream = xpath.Stream = function Stream(str) {
        this.original = this.str = str;
        this.peeked = null;
        // TODO: not really needed, but supposedly tokenizer also disambiguates
        // a * b vs. node test *
        this.prev = null;  // for debugging
        this.prevprev = null;
      }
      Stream.prototype = {
        peek: function() {
          if (this.peeked) return this.peeked;
          var m = this.re.exec(this.str);
          if (!m) return null;
          this.str = this.str.substr(m[0].length);
          return this.peeked = m[1];
        },
        /** Peek 2 tokens ahead. */
        peek2: function() {
          this.peek();  // make sure this.peeked is set
          var m = this.re.exec(this.str);
          if (!m) return null;
          return m[1];
        },
        pop: function() {
          var r = this.peek();
          this.peeked = null;
          this.prevprev = this.prev;
          this.prev = r;
          return r;
        },
        trypop: function(tokens) {
          var tok = this.peek();
          if (tok === tokens) return this.pop();
          if (Array.isArray(tokens)) {
            for (var i = 0; i < tokens.length; ++i) {
              var t = tokens[i];
              if (t == tok) return this.pop();;
            }
          }
        },
        trypopfuncname: function() {
          var tok = this.peek();
          if (!this.isQnameRe.test(tok))
            return null;
          switch (tok) {
            case 'comment': case 'text': case 'processing-instruction': case 'node':
              return null;
          }
          if ('(' != this.peek2()) return null;
          return this.pop();
        },
        trypopaxisname: function() {
          var tok = this.peek();
          switch (tok) {
            case 'ancestor': case 'ancestor-or-self': case 'attribute':
            case 'child': case 'descendant': case 'descendant-or-self':
            case 'following': case 'following-sibling': case 'namespace':
            case 'parent': case 'preceding': case 'preceding-sibling': case 'self':
              if ('::' == this.peek2()) return this.pop();
          }
          return null;
        },
        trypopnametest: function() {
          var tok = this.peek();
          if ('*' === tok || this.startsWithNcNameRe.test(tok)) return this.pop();
          return null;
        },
        trypopliteral: function() {
          var tok = this.peek();
          if (null == tok) return null;
          var first = tok.charAt(0);
          var last = tok.charAt(tok.length - 1);
          if ('"' === first && '"' === last ||
              "'" === first && "'" === last) {
            this.pop();
            return tok.substr(1, tok.length - 2);
          }
        },
        trypopnumber: function() {
          var tok = this.peek();
          if (this.isNumberRe.test(tok)) return parseFloat(this.pop());
          else return null;
        },
        trypopvarref: function() {
          var tok = this.peek();
          if (null == tok) return null;
          if ('$' === tok.charAt(0)) return this.pop().substr(1);
          else return null;
        },
        position: function() {
          return this.original.length - this.str.length;
        }
      };
      (function() {
        // http://www.w3.org/TR/REC-xml-names/#NT-NCName
        var nameStartCharsExceptColon =
            'A-Z_a-z\xc0-\xd6\xd8-\xf6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF' +
            '\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF' +
            '\uFDF0-\uFFFD';  // JS doesn't support [#x10000-#xEFFFF]
        var nameCharExceptColon = nameStartCharsExceptColon +
            '\\-\\.0-9\xb7\u0300-\u036F\u203F-\u2040';
        var ncNameChars = '[' + nameStartCharsExceptColon +
            '][' + nameCharExceptColon + ']*'
        // http://www.w3.org/TR/REC-xml-names/#NT-QName
        var qNameChars = ncNameChars + '(?::' + ncNameChars + ')?';
        var otherChars = '\\.\\.|[\\(\\)\\[\\].@,]|::';  // .. must come before [.]
        var operatorChars =
            'and|or|mod|div|' +
            '//|!=|<=|>=|[*/|+\\-=<>]';  // //, !=, <=, >= before individual ones.
        var literal = '"[^"]*"|' + "'[^']*'";
        var numberChars = '[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+';
        var variableReference = '\\$' + qNameChars;
        var nameTestChars = '\\*|' + ncNameChars + ':\\*|' + qNameChars;
        var optionalSpace = '[ \t\r\n]*';  // stricter than regexp \s.
        var nodeType = 'comment|text|processing-instruction|node';
        var re = new RegExp(
            // numberChars before otherChars so that leading-decimal doesn't become .
            '^' + optionalSpace + '(' + numberChars + '|' + otherChars + '|' +
            nameTestChars + '|' + operatorChars + '|' + literal + '|' +
            variableReference + ')'
            // operatorName | nodeType | functionName | axisName are lumped into
            // qName for now; we'll check them on pop.
        );
        Stream.prototype.re = re;
        Stream.prototype.startsWithNcNameRe = new RegExp('^' + ncNameChars);
        Stream.prototype.isQnameRe = new RegExp('^' + qNameChars + '$');
        Stream.prototype.isNumberRe = new RegExp('^' + numberChars + '$');
      })();

      /***************************************************************************
       *                               Parsing                                   *
       ***************************************************************************/
      var parse = xpath.parse = function parse(stream, a) {
        var r = orExpr(stream,a);
        var x, unparsed = [];
        while (x = stream.pop()) {
          unparsed.push(x);
        }
        if (unparsed.length)
          throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                   'Position ' + stream.position() +
                                   ': Unparsed tokens: ' + unparsed.join(' '));
        return r;
      }

      /**
       * binaryL  ::= subExpr
       *            | binaryL op subExpr
       * so a op b op c becomes ((a op b) op c)
       */
      function binaryL(subExpr, stream, a, ops) {
        var lhs = subExpr(stream, a);
        if (lhs == null) return null;
        var op;
        while (op = stream.trypop(ops)) {
          var rhs = subExpr(stream, a);
          if (rhs == null)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected something after ' + op);
          lhs = a.node(op, lhs, rhs);
        }
        return lhs;
      }
      /**
       * Too bad this is never used. If they made a ** operator (raise to power),
       ( we would use it.
       * binaryR  ::= subExpr
       *            | subExpr op binaryR
       * so a op b op c becomes (a op (b op c))
       */
      function binaryR(subExpr, stream, a, ops) {
        var lhs = subExpr(stream, a);
        if (lhs == null) return null;
        var op = stream.trypop(ops);
        if (op) {
          var rhs = binaryR(stream, a);
          if (rhs == null)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected something after ' + op);
          return a.node(op, lhs, rhs);
        } else {
          return lhs;// TODO
        }
      }
      /** [1] LocationPath::= RelativeLocationPath | AbsoluteLocationPath
       * e.g. a, a/b, //a/b
       */
      function locationPath(stream, a) {
        return absoluteLocationPath(stream, a) ||
               relativeLocationPath(null, stream, a);
      }
      /** [2] AbsoluteLocationPath::= '/' RelativeLocationPath? | AbbreviatedAbsoluteLocationPath
       *  [10] AbbreviatedAbsoluteLocationPath::= '//' RelativeLocationPath
       */
      function absoluteLocationPath(stream, a) {
        var op = stream.peek();
        if ('/' === op || '//' === op) {
          var lhs = a.node('Root');
          return relativeLocationPath(lhs, stream, a, true);
        } else {
          return null;
        }
      }
      /** [3] RelativeLocationPath::= Step | RelativeLocationPath '/' Step |
       *                            | AbbreviatedRelativeLocationPath
       *  [11] AbbreviatedRelativeLocationPath::= RelativeLocationPath '//' Step
       * e.g. p/a, etc.
       */
      function relativeLocationPath(lhs, stream, a, isOnlyRootOk) {
        if (null == lhs) {
          lhs = step(stream, a);
          if (null == lhs) return lhs;
        }
        var op;
        while (op = stream.trypop(['/', '//'])) {
          if ('//' === op) {
            lhs = a.node('/', lhs,
                         a.node('Axis', 'descendant-or-self', 'node', undefined));
          }
          var rhs = step(stream, a);
          if (null == rhs && '/' === op && isOnlyRootOk) return lhs;
          else isOnlyRootOk = false;
          if (null == rhs)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected step after ' + op);
          lhs = a.node('/', lhs, rhs);
        }
        return lhs;
      }
      /** [4] Step::= AxisSpecifier NodeTest Predicate* | AbbreviatedStep
       *  [12] AbbreviatedStep::= '.' | '..'
       * e.g. @href, self::p, p, a[@href], ., ..
       */
      function step(stream, a) {
        var abbrStep = stream.trypop(['.', '..']);
        if ('.' === abbrStep)  // A location step of . is short for self::node().
          return a.node('Axis', 'self', 'node');
        if ('..' === abbrStep)  // A location step of .. is short for parent::node()
          return a.node('Axis', 'parent', 'node');

        var axis = axisSpecifier(stream, a);
        var nodeType = nodeTypeTest(stream, a);
        var nodeName;
        if (null == nodeType) nodeName = nodeNameTest(stream, a);
        if (null == axis && null == nodeType && null == nodeName) return null;
        if (null == nodeType && null == nodeName)
            throw new XPathException(
                XPathException.INVALID_EXPRESSION_ERR,
                'Position ' + stream.position() +
                ': Expected nodeTest after axisSpecifier ' + axis);
        if (null == axis) axis = 'child';
        if (null == nodeType) {
          // When there's only a node name, then the node type is forced to be the
          // principal node type of the axis.
          // see http://www.w3.org/TR/xpath/#dt-principal-node-type
          if ('attribute' === axis) nodeType = 'attribute';
          else if ('namespace' === axis) nodeType = 'namespace';
          else nodeType = 'element';
        }
        var lhs = a.node('Axis', axis, nodeType, nodeName);
        var pred;
        while (null != (pred = predicate(lhs, stream, a))) {
          lhs = pred;
        }
        return lhs;
      }
      /** [5] AxisSpecifier::= AxisName '::' | AbbreviatedAxisSpecifier
       *  [6] AxisName::= 'ancestor' | 'ancestor-or-self' | 'attribute' | 'child'
       *                | 'descendant' | 'descendant-or-self' | 'following'
       *                | 'following-sibling' | 'namespace' | 'parent' |
       *                | 'preceding' | 'preceding-sibling' | 'self'
       *  [13] AbbreviatedAxisSpecifier::= '@'?
       */
      function axisSpecifier(stream, a) {
        var attr = stream.trypop('@');
        if (null != attr) return 'attribute';
        var axisName = stream.trypopaxisname();
        if (null != axisName) {
          var coloncolon = stream.trypop('::');
          if (null == coloncolon)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Should not happen. Should be ::.');
          return axisName;
        }
      }
      /** [7] NodeTest::= NameTest | NodeType '(' ')' | 'processing-instruction' '(' Literal ')'
       *  [38] NodeType::= 'comment' | 'text' | 'processing-instruction' | 'node'
       * I've split nodeTypeTest from nodeNameTest for convenience.
       */
      function nodeTypeTest(stream, a) {
        if ('(' !== stream.peek2()) {
          return null;
        }
        var type = stream.trypop(['comment', 'text', 'processing-instruction', 'node']);
        if (null != type) {
          if (null == stream.trypop('('))
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Should not happen.');
          var param = undefined;
          if (type == 'processing-instruction') {
            param = stream.trypopliteral();
          }
          if (null == stream.trypop(')'))
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected close parens.');
          return type
        }
      }
      function nodeNameTest(stream, a) {
        var name = stream.trypopnametest();
        if (name != null) return name;
        else return null;
      }
      /** [8] Predicate::= '[' PredicateExpr ']'
       *  [9] PredicateExpr::= Expr
       */
      function predicate(lhs, stream, a) {
        if (null == stream.trypop('[')) return null;
        var expr = orExpr(stream, a);
        if (null == expr)
          throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                   'Position ' + stream.position() +
                                   ': Expected expression after [');
        if (null == stream.trypop(']'))
          throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                   'Position ' + stream.position() +
                                   ': Expected ] after expression.');
        return a.node('Predicate', lhs, expr);
      }
      /** [14] Expr::= OrExpr
       */
      /** [15] PrimaryExpr::= VariableReference | '(' Expr ')' | Literal | Number | FunctionCall
       * e.g. $x,  (3+4),  "hi",  32,  f(x)
       */
      function primaryExpr(stream, a) {
        var x = stream.trypopliteral();
        if (null == x)
          x = stream.trypopnumber();
        if (null != x) {
          return x;
        }
        var varRef = stream.trypopvarref();
        if (null != varRef) return a.node('VariableReference', varRef);
        var funCall = functionCall(stream, a);
        if (null != funCall) {
          return funCall;
        }
        if (stream.trypop('(')) {
          var e = orExpr(stream, a);
          if (null == e)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected expression after (.');
          if (null == stream.trypop(')'))
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected ) after expression.');
          return e;
        }
        return null;
      }
      /** [16] FunctionCall::= FunctionName '(' ( Argument ( ',' Argument )* )? ')'
       *  [17] Argument::= Expr
       */
      function functionCall(stream, a) {
        var name = stream.trypopfuncname(stream, a);
        if (null == name) return null;
        if (null == stream.trypop('('))
          throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                   'Position ' + stream.position() +
                                   ': Expected ( ) after function name.');
        var params = [];
        var first = true;
        while (null == stream.trypop(')')) {
          if (!first && null == stream.trypop(','))
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected , between arguments of the function.');
          first = false;
          var param = orExpr(stream, a);
          if (param == null)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected expression as argument of function.');
          params.push(param);
        }
        return a.node('FunctionCall', name, params);
      }

      /** [18] UnionExpr::= PathExpr | UnionExpr '|' PathExpr
       */
      function unionExpr(stream, a) { return binaryL(pathExpr, stream, a, '|'); }
      /** [19] PathExpr ::= LocationPath
       *                  | FilterExpr
       *                  | FilterExpr '/' RelativeLocationPath
       *                  | FilterExpr '//' RelativeLocationPath
       * Unlike most other nodes, this one always generates a node because
       * at this point all reverse nodesets must turn into a forward nodeset
       */
      function pathExpr(stream, a) {
        // We have to do FilterExpr before LocationPath because otherwise
        // LocationPath will eat up the name from a function call.
        var filter = filterExpr(stream, a);
        if (null == filter) {
          var loc = locationPath(stream, a);
          if (null == loc) {
            throw new Error
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': The expression shouldn\'t be empty...');
          }
          return a.node('PathExpr', loc);
        }
        var rel = relativeLocationPath(filter, stream, a, false);
        if (filter === rel) return rel;
        else return a.node('PathExpr', rel);
      }
      /** [20] FilterExpr::= PrimaryExpr | FilterExpr Predicate
       * aka. FilterExpr ::= PrimaryExpr Predicate*
       */
      function filterExpr(stream, a) {
        var primary = primaryExpr(stream, a);
        if (primary == null) return null;
        var pred, lhs = primary;
        while (null != (pred = predicate(lhs, stream, a))) {
          lhs = pred;
        }
        return lhs;
      }

      /** [21] OrExpr::= AndExpr | OrExpr 'or' AndExpr
       */
      function orExpr(stream, a) {
        var orig = (stream.peeked || '') + stream.str
        var r = binaryL(andExpr, stream, a, 'or');
        var now = (stream.peeked || '') + stream.str;
        return r;
      }
      /** [22] AndExpr::= EqualityExpr | AndExpr 'and' EqualityExpr
       */
      function andExpr(stream, a) { return binaryL(equalityExpr, stream, a, 'and'); }
      /** [23] EqualityExpr::= RelationalExpr | EqualityExpr '=' RelationalExpr
       *                     | EqualityExpr '!=' RelationalExpr
       */
      function equalityExpr(stream, a) { return binaryL(relationalExpr, stream, a, ['=','!=']); }
      /** [24] RelationalExpr::= AdditiveExpr | RelationalExpr '<' AdditiveExpr
       *                       | RelationalExpr '>' AdditiveExpr
       *                       | RelationalExpr '<=' AdditiveExpr
       *                       | RelationalExpr '>=' AdditiveExpr
       */
      function relationalExpr(stream, a) { return binaryL(additiveExpr, stream, a, ['<','>','<=','>=']); }
      /** [25] AdditiveExpr::= MultiplicativeExpr
       *                     | AdditiveExpr '+' MultiplicativeExpr
       *                     | AdditiveExpr '-' MultiplicativeExpr
       */
      function additiveExpr(stream, a) { return binaryL(multiplicativeExpr, stream, a, ['+','-']); }
      /** [26] MultiplicativeExpr::= UnaryExpr
       *                           | MultiplicativeExpr MultiplyOperator UnaryExpr
       *                           | MultiplicativeExpr 'div' UnaryExpr
       *                           | MultiplicativeExpr 'mod' UnaryExpr
       */
      function multiplicativeExpr(stream, a) { return binaryL(unaryExpr, stream, a, ['*','div','mod']); }
      /** [27] UnaryExpr::= UnionExpr | '-' UnaryExpr
       */
      function unaryExpr(stream, a) {
        if (stream.trypop('-')) {
          var e = unaryExpr(stream, a);
          if (null == e)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Expected unary expression after -');
          return a.node('UnaryMinus', e);
        }
        else return unionExpr(stream, a);
      }
      var astFactory = {
        node: function() {return Array.prototype.slice.call(arguments);}
      };


      /***************************************************************************
       *                            Optimizations (TODO)                         *
       ***************************************************************************/
      /**
       * Some things I've been considering:
       * 1) a//b becomes a/descendant::b if there's no predicate that uses
       *    position() or last()
       * 2) axis[pred]: when pred doesn't use position, evaluate it just once per
       *    node in the node-set rather than once per (node, position, last).
       * For more optimizations, look up Gecko's optimizer:
       * http://mxr.mozilla.org/mozilla-central/source/content/xslt/src/xpath/txXPathOptimizer.cpp
       */
      // TODO
      function optimize(ast) {
      }

      /***************************************************************************
       *                           Evaluation: axes                              *
       ***************************************************************************/

      /**
       * Data types: For string, number, boolean, we just use Javascript types.
       * Node-sets have the form
       *    {nodes: [node, ...]}
       * or {nodes: [node, ...], pos: [[1], [2], ...], lasts: [[1], [2], ...]}
       *
       * Most of the time, only the node is used and the position information is
       * discarded. But if you use a predicate, we need to try every value of
       * position and last in case the predicate calls position() or last().
       */

      /**
       * The NodeMultiSet is a helper class to help generate
       * {nodes:[], pos:[], lasts:[]} structures. It is useful for the
       * descendant, descendant-or-self, following-sibling, and
       * preceding-sibling axes for which we can use a stack to organize things.
       */
      function NodeMultiSet(isReverseAxis) {
        this.nodes = [];
        this.pos = [];
        this.lasts = [];
        this.nextPos = [];
        this.seriesIndexes = [];  // index within nodes that each series begins.
        this.isReverseAxis = isReverseAxis;
        this._pushToNodes = isReverseAxis ? Array.prototype.unshift : Array.prototype.push;
      }
      NodeMultiSet.prototype = {
        pushSeries: function pushSeries() {
          this.nextPos.push(1);
          this.seriesIndexes.push(this.nodes.length);
        },
        popSeries: function popSeries() {
          console.assert(0 < this.nextPos.length, this.nextPos);
          var last = this.nextPos.pop() - 1,
              indexInPos = this.nextPos.length,
              seriesBeginIndex = this.seriesIndexes.pop(),
              seriesEndIndex = this.nodes.length;
          for (var i = seriesBeginIndex; i < seriesEndIndex; ++i) {
            console.assert(indexInPos < this.lasts[i].length);
            console.assert(undefined === this.lasts[i][indexInPos]);
            this.lasts[i][indexInPos] = last;
          }
        },
        finalize: function() {
          if (null == this.nextPos) return this;
          console.assert(0 === this.nextPos.length);
          for (var i = 0; i < this.lasts.length; ++i) {
            for (var j = 0; j < this.lasts[i].length; ++j) {
              console.assert(null != this.lasts[i][j], i + ',' + j + ':' + JSON.stringify(this.lasts));
            }
          }
          this.pushSeries = this.popSeries = this.addNode = function() {
            throw new Error('Already finalized.');
          };
          return this;
        },
        addNode: function addNode(node) {
          console.assert(node);
          this._pushToNodes.call(this.nodes, node)
          this._pushToNodes.call(this.pos, this.nextPos.slice());
          this._pushToNodes.call(this.lasts, new Array(this.nextPos.length));
          for (var i = 0; i < this.nextPos.length; ++i) this.nextPos[i]++;
        },
        simplify: function() {
          this.finalize();
          return {nodes:this.nodes, pos:this.pos, lasts:this.lasts};
        }
      };
      function eachContext(nodeMultiSet) {
        var r = [];
        for (var i = 0; i < nodeMultiSet.nodes.length; i++) {
          var node = nodeMultiSet.nodes[i];
          if (!nodeMultiSet.pos) {
            r.push({nodes:[node], pos: [[i + 1]], lasts: [[nodeMultiSet.nodes.length]]});
          } else {
            for (var j = 0; j < nodeMultiSet.pos[i].length; ++j) {
              r.push({nodes:[node], pos: [[nodeMultiSet.pos[i][j]]], lasts: [[nodeMultiSet.lasts[i][j]]]});
            }
          }
        }
        return r;
      }
      /** Matcher used in the axes.
       */
      function NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase) {
        this.nodeTypeNum = nodeTypeNum;
        this.nodeName = nodeName;
        this.shouldLowerCase = shouldLowerCase;
        this.nodeNameTest =
          null == nodeName ? this._alwaysTrue :
          shouldLowerCase ? this._nodeNameLowerCaseEquals :
          this._nodeNameEquals;
      }
      NodeMatcher.prototype = {
        matches: function matches(node) {
          return (0 === this.nodeTypeNum || node.nodeType === this.nodeTypeNum) &&
              this.nodeNameTest(node.nodeName);
        },
        _alwaysTrue: function(name) {return true;},
        _nodeNameEquals: function _nodeNameEquals(name) {
          return this.nodeName === name;
        },
        _nodeNameLowerCaseEquals: function _nodeNameLowerCaseEquals(name) {
          return this.nodeName === name.toLowerCase();
        }
      };

      function followingSiblingHelper(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, shift, peek, followingNode, andSelf, isReverseAxis) {
        var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
        var nodeMultiSet = new NodeMultiSet(isReverseAxis);
        while (0 < nodeList.length) {  // can be if for following, preceding
          var node = shift.call(nodeList);
          console.assert(node != null);
          node = followingNode(node);
          nodeMultiSet.pushSeries();
          var numPushed = 1;
          while (null != node) {
            if (! andSelf && matcher.matches(node))
              nodeMultiSet.addNode(node);
            if (node === peek.call(nodeList)) {
              shift.call(nodeList);
              nodeMultiSet.pushSeries();
              numPushed++;
            }
            if (andSelf && matcher.matches(node))
              nodeMultiSet.addNode(node);
            node = followingNode(node);
          }
          while (0 < numPushed--)
            nodeMultiSet.popSeries();
        }
        return nodeMultiSet;
      }

      /** Returns the next non-descendant node in document order.
       * This is the first node in following::node(), if node is the context.
       */
      function followingNonDescendantNode(node) {
        if (node.ownerElement) {
          if (node.ownerElement.firstChild)
            return node.ownerElement.firstChild;
          node = node.ownerElement;
        }
        do {
          if (node.nextSibling) return node.nextSibling;
        } while (node = node.parentNode);
        return null;
      }

      /** Returns the next node in a document-order depth-first search.
       * See the definition of document order[1]:
       *   1) element
       *   2) namespace nodes
       *   3) attributes
       *   4) children
       *   [1]: http://www.w3.org/TR/xpath/#dt-document-order
       */
      function followingNode(node) {
        if (node.ownerElement)  // attributes: following node of element.
          node = node.ownerElement;
        if (null != node.firstChild)
          return node.firstChild;
        do {
          if (null != node.nextSibling) {
            return node.nextSibling;
          }
          node = node.parentNode;
        } while (node);
        return null;
      }
      /** Returns the previous node in document order (excluding attributes
       * and namespace nodes).
       */
      function precedingNode(node) {
        if (node.ownerElement)
          return node.ownerElement;
        if (null != node.previousSibling) {
          node = node.previousSibling;
          while (null != node.lastChild) {
            node = node.lastChild;
          }
          return node;
        }
        if (null != node.parentNode) {
          return node.parentNode;
        }
        return null;
      }
      /** This axis is inefficient if there are many nodes in the nodeList.
       * But I think it's a pretty useless axis so it's ok. */
      function followingHelper(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
        var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
        var nodeMultiSet = new NodeMultiSet(false);
        var cursor = nodeList[0];
        var unorderedFollowingStarts = [];
        for (var i = 0; i < nodeList.length; i++) {
          var node = nodeList[i];
          var start = followingNonDescendantNode(node);
          if (start)
            unorderedFollowingStarts.push(start);
        }
        if (0 === unorderedFollowingStarts.length)
          return {nodes:[]};
        var pos = [], nextPos = [];
        var started = 0;
        while (cursor = followingNode(cursor)) {
          for (var i = unorderedFollowingStarts.length - 1; i >= 0; i--){
            if (cursor === unorderedFollowingStarts[i]) {
              nodeMultiSet.pushSeries();
              unorderedFollowingStarts.splice(i,i+1);
              started++;
            }
          }
          if (started && matcher.matches(cursor)) {
            nodeMultiSet.addNode(cursor);
          }
        }
        console.assert(0 === unorderedFollowingStarts.length);
        for (var i = 0; i < started; i++)
          nodeMultiSet.popSeries();
        return nodeMultiSet.finalize();
      }
      function precedingHelper(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
        var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
        var cursor = nodeList.pop();
        if (null == cursor) return {nodes:{}};
        var r = {nodes:[], pos:[], lasts:[]};
        var nextParents = [cursor.parentNode || cursor.ownerElement], nextPos = [1];
        while (cursor = precedingNode(cursor)) {
          if (cursor === nodeList[nodeList.length - 1]) {
            nextParents.push(nodeList.pop());
            nextPos.push(1);
          }
          var matches = matcher.matches(cursor);
          var pos, someoneUsed = false;
          if (matches)
            pos = nextPos.slice();

          for (var i = 0; i < nextParents.length; ++i) {
            if (cursor === nextParents[i]) {
              nextParents[i] = cursor.parentNode || cursor.ownerElement;
              if (matches) {
                pos[i] = null;
              }
            } else {
              if (matches) {
                pos[i] = nextPos[i]++;
                someoneUsed = true;
              }
            }
          }
          if (someoneUsed) {
            r.nodes.unshift(cursor);
            r.pos.unshift(pos);
          }
        }
        for (var i = 0; i < r.pos.length; ++i) {
          var lasts = [];
          r.lasts.push(lasts);
          for (var j = r.pos[i].length - 1; j >= 0; j--) {
            if (null == r.pos[i][j]) {
              r.pos[i].splice(j, j+1);
            } else {
              lasts.unshift(nextPos[j] - 1);
            }
          }
        }
        return r;
      }

      /** node-set, axis -> node-set */
      function descendantDfs(nodeMultiSet, node, remaining, matcher, andSelf, attrIndices, attrNodes) {
        while (0 < remaining.length && null != remaining[0].ownerElement) {
          var attr = remaining.shift();
          if (andSelf && matcher.matches(attr)) {
            attrNodes.push(attr);
            attrIndices.push(nodeMultiSet.nodes.length);
          }
        }
        if (null != node && !andSelf) {
          if (matcher.matches(node))
            nodeMultiSet.addNode(node);
        }
        var pushed = false;
        if (null == node) {
          if (0 === remaining.length) return;
          node = remaining.shift();
          nodeMultiSet.pushSeries();
          pushed = true;
        } else if (0 < remaining.length && node === remaining[0]) {
          nodeMultiSet.pushSeries();
          pushed = true;
          remaining.shift();
        }
        if (andSelf) {
          if (matcher.matches(node))
            nodeMultiSet.addNode(node);
        }
        // TODO: use optimization. Also try element.getElementsByTagName
        // var nodeList = 1 === nodeTypeNum && null != node.children ? node.children : node.childNodes;
        var nodeList = node.childNodes;
        for (var j = 0; j < nodeList.length; ++j) {
          var child = nodeList[j];
          descendantDfs(nodeMultiSet, child, remaining, matcher, andSelf, attrIndices, attrNodes);
        }
        if (pushed) {
          nodeMultiSet.popSeries();
        }
      }
      function descenantHelper(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, andSelf) {
        var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
        var nodeMultiSet = new NodeMultiSet(false);
        var attrIndices = [], attrNodes = [];
        while (0 < nodeList.length) {
          // var node = nodeList.shift();
          descendantDfs(nodeMultiSet, null, nodeList, matcher, andSelf, attrIndices, attrNodes);
        }
        nodeMultiSet.finalize();
        for (var i = attrNodes.length-1; i >= 0; --i) {
          nodeMultiSet.nodes.splice(attrIndices[i], attrIndices[i], attrNodes[i]);
          nodeMultiSet.pos.splice(attrIndices[i], attrIndices[i], [1]);
          nodeMultiSet.lasts.splice(attrIndices[i], attrIndices[i], [1]);
        }
        return nodeMultiSet;
      }
      /**
       */
      function ancestorHelper(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, andSelf) {
        var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
        var ancestors = []; // array of non-empty arrays of matching ancestors
        for (var i = 0; i < nodeList.length; ++i) {
          var node = nodeList[i];
          var isFirst = true;
          var a = [];
          while (null != node) {
            if (!isFirst || andSelf) {
              if (matcher.matches(node))
                a.push(node);
            }
            isFirst = false;
            node = node.parentNode || node.ownerElement;
          }
          if (0 < a.length)
            ancestors.push(a);
        }
        var lasts = [];
        for (var i = 0; i < ancestors.length; ++i) lasts.push(ancestors[i].length);
        var nodeMultiSet = new NodeMultiSet(true);
        var newCtx = {nodes:[], pos:[], lasts:[]};
        while (0 < ancestors.length) {
          var pos = [ancestors[0].length];
          var last = [lasts[0]];
          var node = ancestors[0].pop();
          for (var i = ancestors.length - 1; i > 0; --i) {
            if (node === ancestors[i][ancestors[i].length - 1]) {
              pos.push(ancestors[i].length);
              last.push(lasts[i]);
              ancestors[i].pop();
              if (0 === ancestors[i].length) {
                ancestors.splice(i, i+1);
                lasts.splice(i, i+1);
              }
            }
          }
          if (0 === ancestors[0].length) {
            ancestors.shift();
            lasts.shift();
          }
          newCtx.nodes.push(node);
          newCtx.pos.push(pos);
          newCtx.lasts.push(last);
        }
        return newCtx;
      }
      /** Helper function for sortDocumentOrder. Returns a list of indices, from the
       * node to the root, of positions within parent.
       * For convenience, the node is the first element of the array.
       */
      function addressVector(node) {
        var r = [node];
        if (null != node.ownerElement) {
          node = node.ownerElement;
          r.push(-1);
        }
        while (null != node) {
          var i = 0;
          while (null != node.previousSibling) {
            node = node.previousSibling;
            i++;
          }
          r.push(i);
          node = node.parentNode
        }
        return r;
      }
      function addressComparator(a, b) {
        var minlen = Math.min(a.length - 1, b.length - 1),  // not including [0]=node
            alen = a.length,
            blen = b.length;
        if (a[0] === b[0]) return 0;
        var c;
        for (var i = 0; i < minlen; ++i) {
          c = a[alen - i - 1] - b[blen - i - 1];
          if (0 !== c)
            break;
        }
        if (null == c || 0 === c) {
          // All equal until one of the nodes. The longer one is the descendant.
          c = alen - blen;
        }
        if (0 === c)
          c = a.nodeName - b.nodeName;
        if (0 === c)
          c = 1;
        return c;
      }
      var sortUniqDocumentOrder = xpath.sortUniqDocumentOrder = function(nodes) {
        var a = [];
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var v = addressVector(node);
          a.push(v);
        }
        a.sort(addressComparator);
        var b = [];
        for (var i = 0; i < a.length; i++) {
          if (0 < i && a[i][0] === a[i - 1][0])
            continue;
          b.push(a[i][0]);
        }
        return b;
      }
      /** Sort node multiset. Does not do any de-duping. */
      function sortNodeMultiSet(nodeMultiSet) {
        var a = [];
        for (var i = 0; i < nodeMultiSet.nodes.length; i++) {
          var v = addressVector(nodeMultiSet.nodes[i]);
          a.push({v:v, n:nodeMultiSet.nodes[i],
                  p:nodeMultiSet.pos[i], l:nodeMultiSet.lasts[i]});
        }
        a.sort(compare);
        var r = {nodes:[], pos:[], lasts:[]};
        for (var i = 0; i < a.length; ++i) {
          r.nodes.push(a[i].n);
          r.pos.push(a[i].p);
          r.lasts.push(a[i].l);
        }
        function compare(x, y) {
          return addressComparator(x.v, y.v);
        }
        return r;
      }
      /** Returns an array containing all the ancestors down to a node.
       * The array starts with document.
       */
      function nodeAndAncestors(node) {
        var ancestors = [node];
        var p = node;
        while (p = p.parentNode || p.ownerElement) {
          ancestors.unshift(p);
        }
        return ancestors;
      }
      function compareSiblings(a, b) {
        if (a === b) return 0;
        var c = a;
        while (c = c.previousSibling) {
          if (c === b)
            return 1;  // b < a
        }
        c = b;
        while (c = c.previousSibling) {
          if (c === a)
            return -1;  // a < b
        }
        throw new Error('a and b are not siblings: ' + xpath.stringifyObject(a) + ' vs ' + xpath.stringifyObject(b));
      }
      /** The merge in merge-sort.*/
      function mergeNodeLists(x, y) {
        var a, b, aanc, banc, r = [];
        if ('object' !== typeof x)
          throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                   'Invalid LHS for | operator ' +
                                   '(expected node-set): ' + x);
        if ('object' !== typeof y)
          throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                   'Invalid LHS for | operator ' +
                                   '(expected node-set): ' + y);
        while (true) {
          if (null == a) {
            a = x.shift();
            if (null != a)
              aanc = addressVector(a);
          }
          if (null == b) {
            b = y.shift();
            if (null != b)
              banc = addressVector(b);
          }
          if (null == a || null == b) break;
          var c = addressComparator(aanc, banc);
          if (c < 0) {
            r.push(a);
            a = null;
            aanc = null;
          } else if (c > 0) {
            r.push(b);
            b = null;
            banc = null;
          } else if (a.nodeName < b.nodeName) {  // attributes
            r.push(a);
            a = null;
            aanc = null;
          } else if (a.nodeName > b.nodeName) {  // attributes
            r.push(b);
            b = null;
            banc = null;
          } else if (a !== b) {
            // choose b arbitrarily
            r.push(b);
            b = null;
            banc = null;
          } else {
            console.assert(a === b, c);
            // just skip b without pushing it.
            b = null;
            banc = null;
          }
        }
        while (a) {
          r.push(a);
          a = x.shift();
        }
        while (b) {
          r.push(b);
          b = y.shift();
        }
        return r;
      }
      function comparisonHelper(test, x, y, isNumericComparison) {
        var coersion;
        if (isNumericComparison)
          coersion = fn.number;
        else coersion =
          'boolean' === typeof x || 'boolean' === typeof y ? fn['boolean'] :
          'number' === typeof x || 'number' === typeof y ? fn.number :
          fn.string;
        if ('object' === typeof x && 'object' === typeof y) {
          var aMap = {};
          for (var i = 0; i < x.nodes.length; ++i) {
            var xi = coersion({nodes:[x.nodes[i]]});
            for (var j = 0; j < y.nodes.length; ++j) {
              var yj = coersion({nodes:[y.nodes[j]]});
              if (test(xi, yj)) return true;
            }
          }
          return false;
        } else if ('object' === typeof x && x.nodes && x.nodes.length) {
          for (var i = 0; i < x.nodes.length; ++i) {
            var xi = coersion({nodes:[x.nodes[i]]}), yc = coersion(y);
            if (test(xi, yc))
              return true;
          }
          return false;
        } else if ('object' === typeof y && x.nodes && x.nodes.length) {
          for (var i = 0; i < x.nodes.length; ++i) {
            var yi = coersion({nodes:[y.nodes[i]]}), xc = coersion(x);
            if (test(xc, yi))
              return true;
          }
          return false;
        } else {
          var xc = coersion(x), yc = coersion(y);
          return test(xc, yc);
        }
      }
      var axes = xpath.axes = {
        'ancestor':
          function ancestor(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return ancestorHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, false);
          },
        'ancestor-or-self':
          function ancestorOrSelf(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return ancestorHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, true);
          },
        'attribute':
          function attribute(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            // TODO: figure out whether positions should be undefined here.
            var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
            var nodeMultiSet = new NodeMultiSet(false);
            if (null != nodeName) {
              // TODO: with namespace
              for (var i = 0; i < nodeList.length; ++i) {
                var node = nodeList[i];
                if (null == node.getAttributeNode)
                  continue;  // only Element has .getAttributeNode
                var attr = node.getAttributeNode(nodeName);
                if (null != attr && matcher.matches(attr)) {
                  nodeMultiSet.pushSeries();
                  nodeMultiSet.addNode(attr);
                  nodeMultiSet.popSeries();
                }
              }
            } else {
              for (var i = 0; i < nodeList.length; ++i) {
                var node = nodeList[i];
                if (null != node.attributes) {
                  nodeMultiSet.pushSeries();
                  for (var j = 0; j < node.attributes.length; j++) {  // all nodes have .attributes
                    var attr = node.attributes[j];
                    if (matcher.matches(attr))  // TODO: I think this check is unnecessary
                      nodeMultiSet.addNode(attr);
                  }
                  nodeMultiSet.popSeries();
                }
              }
            }
            return nodeMultiSet.finalize();
          },
        'child':
          function child(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
            var nodeMultiSet = new NodeMultiSet(false);
            for (var i = 0; i < nodeList.length; ++i) {
              var n = nodeList[i];
              if (n.ownerElement)  // skip attribute nodes' text child.
                continue;
              if (n.childNodes) {
                nodeMultiSet.pushSeries();
                var childList = 1 === nodeTypeNum && null != n.children ?
                    n.children : n.childNodes;
                for (var j = 0; j < childList.length; ++j) {
                  var child = childList[j];
                  if (matcher.matches(child)) {
                    nodeMultiSet.addNode(child);
                  }
                  // don't have to do de-duping because children have parent,
                  // which are current context.
                }
                nodeMultiSet.popSeries();
              }
            }
            nodeMultiSet.finalize();
            r = sortNodeMultiSet(nodeMultiSet);
            return r;
          },
        'descendant':
          function descenant(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return descenantHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, false);
          },
        'descendant-or-self':
          function descenantOrSelf(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return descenantHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase, true);
          },
        'following':
          function following(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return followingHelper(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase);
          },
        'following-sibling':
          function followingSibling(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return followingSiblingHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase,
              Array.prototype.shift, function() {return this[0];},
              function(node) {return node.nextSibling;});
          },
        'namespace':
          function namespace(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            // TODO
          },
        'parent':
          function parent(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
            var nodes = [], pos = [];
            for (var i = 0; i < nodeList.length; ++i) {
              var parent = nodeList[i].parentNode || nodeList[i].ownerElement;
              if (null == parent)
                continue;
              if (!matcher.matches(parent))
                continue;
              if (nodes.length > 0 && parent === nodes[nodes.length-1])
                continue;
              nodes.push(parent);
              pos.push([1]);
            }
            return {nodes:nodes, pos:pos, lasts:pos};
          },
        'preceding':
          function preceding(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return precedingHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase);
          },
        'preceding-sibling':
          function precedingSibling(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            return followingSiblingHelper(
              nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase,
              Array.prototype.pop, function() {return this[this.length-1];},
              function(node) {return node.previousSibling},
              false, true);
          },
        'self':
          function self(nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase) {
            var nodes = [], pos = [];
            var matcher = new NodeMatcher(nodeTypeNum, nodeName, shouldLowerCase);
            for (var i = 0; i < nodeList.length; ++i) {
              if (matcher.matches(nodeList[i])) {
                nodes.push(nodeList[i]);
                pos.push([1]);
              }
            }
            return {nodes: nodes, pos: pos, lasts: pos}
          }
      };

      /***************************************************************************
       *                         Evaluation: functions                           *
       ***************************************************************************/
      var fn = {
        'number': function number(optObject) {
          if ('number' === typeof optObject)
            return optObject;
          if ('string' === typeof optObject)
            return parseFloat(optObject);  // note: parseFloat(' ') -> NaN, unlike +' ' -> 0.
          if ('boolean' === typeof optObject)
            return +optObject;
          return fn.number(fn.string.call(this, optObject));  // for node-sets
        },
        'string': function string(optObject) {
          if (null == optObject)
            return fn.string(this);
          if ('string' === typeof optObject || 'boolean' === typeof optObject ||
              'number' === typeof optObject)
            return '' + optObject;
          if (0 == optObject.nodes.length) return '';
          if (null != optObject.nodes[0].textContent)
            return optObject.nodes[0].textContent;
          return optObject.nodes[0].nodeValue;
        },
        'boolean': function booleanVal(x) {
          return 'object' === typeof x ? x.nodes.length > 0 : !!x;
        },
        'last': function last() {
          console.assert(Array.isArray(this.pos));
          console.assert(Array.isArray(this.lasts));
          console.assert(1 === this.pos.length);
          console.assert(1 === this.lasts.length);
          console.assert(1 === this.lasts[0].length);
          return this.lasts[0][0];
        },
        'position': function position() {
          console.assert(Array.isArray(this.pos));
          console.assert(Array.isArray(this.lasts));
          console.assert(1 === this.pos.length);
          console.assert(1 === this.lasts.length);
          console.assert(1 === this.pos[0].length);
          return this.pos[0][0];
        },
        'count': function count(nodeSet) {
          if ('object' !== typeof nodeSet)
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Position ' + stream.position() +
                                     ': Function count(node-set) ' +
                                     'got wrong argument type: ' + nodeSet);
          return nodeSet.nodes.length;
        },
        'id': function id(object) {
          var r = {nodes: []};
          var doc = this.nodes[0].ownerDocument || this.nodes[0];
          console.assert(doc);
          var ids;
          if ('object' === typeof object) {
            // for node-sets, map id over each node value.
            ids = [];
            for (var i = 0; i < object.nodes.length; ++i) {
              var idNode = object.nodes[i];
              var idsString = fn.string({nodes:[idNode]});
              var a = idsString.split(/[ \t\r\n]+/g);
              Array.prototype.push.apply(ids, a);
            }
          } else {
            var idsString = fn.string(object);
            var a = idsString.split(/[ \t\r\n]+/g);
            ids = a;
          }
          for (var i = 0; i < ids.length; ++i) {
            var id = ids[i];
            if (0 === id.length)
              continue;
            var node = doc.getElementById(id);
            if (null != node)
              r.nodes.push(node);
          }
          r.nodes = sortUniqDocumentOrder(r.nodes);
          return r;
        },
        'local-name': function(nodeSet) {
          if (null == nodeSet)
            return fn.name(this);
          if (null == nodeSet.nodes) {
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'argument to name() must be a node-set. got ' + nodeSet);
          }
          // TODO: namespaced version
          return nodeSet.nodes[0].nodeName.toLowerCase();  // TODO: no toLowerCase for xml
        },
        'namespace-uri': function(nodeSet) {
          // TODO
          throw new Error('not implemented yet');
        },
        'name': function(nodeSet) {
          if (null == nodeSet)
            return fn.name(this);
          if (null == nodeSet.nodes) {
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'argument to name() must be a node-set. got ' + nodeSet);
          }
          return nodeSet.nodes[0].nodeName.toLowerCase();  // TODO: no toLowerCase for xml
        },
        'concat': function concat(x) {
          var l = [];
          for (var i = 0; i < arguments.length; ++i) {
            l.push(fn.string(arguments[i]));
          }
          return l.join('');
        },
        'starts-with': function startsWith(a, b) {
          var as = fn.string(a), bs = fn.string(b);
          return as.substr(0, bs.length) === bs;
        },
        'contains': function contains(a, b) {
          var as = fn.string(a), bs = fn.string(b);
          var i = as.indexOf(bs);
          if (-1 === i) return false;
          return true;
        },
        'substring-before': function substringBefore(a, b) {
          var as = fn.string(a), bs = fn.string(b);
          var i = as.indexOf(bs);
          if (-1 === i) return '';
          return as.substr(0, i);
        },
        'substring-after': function substringBefore(a, b) {
          var as = fn.string(a), bs = fn.string(b);
          var i = as.indexOf(bs);
          if (-1 === i) return '';
          return as.substr(i + bs.length);
        },
        'substring': function substring(string, start, optEnd) {
          if (null == string || null == start) {
            throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                     'Must be at least 2 arguments to string()');
          }
          var sString = fn.string(string),
              iStart = fn.round(start),
              iEnd = optEnd == null ? null : fn.round(optEnd);
          // Note that xpath string positions user 1-based index
          if (iEnd == null)
            return sString.substr(iStart - 1);
          else
            return sString.substr(iStart - 1, iEnd);
        },
        'string-length': function stringLength(optString) {
          return fn.string.call(this, optString).length;
        },
        'normalize-space': function normalizeSpace(optString) {
          var s = fn.string.call(this, optString);
          return s.replace(/[ \t\r\n]+/g, ' ').replace(/^ | $/g, '');
        },
        'translate': function translate(string, from, to) {
          var sString = fn.string.call(this, string),
              sFrom = fn.string(from),
              sTo = fn.string(to);
          var eachCharRe = [];
          var map = {};
          for (var i = 0; i < sFrom.length; ++i) {
            var c = sFrom.charAt(i);
            map[c] = sTo.charAt(i);  // returns '' if beyond length of sTo.
            // copied from goog.string.regExpEscape in the Closure library.
            eachCharRe.push(
              c.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
                replace(/\x08/g, '\\x08'));
          }
          var re = new RegExp(eachCharRe.join('|'), 'g');
          return sString.replace(re, function(c) {return map[c];});
        },
        /// Boolean functions
        'not': function not(x) {
          var bx = fn['boolean'](x);
          return !bx;
        },
        'true': function trueVal() { return true; },
        'false': function falseVal() { return false; },
        // TODO
        'lang': function lang(string) { throw new Error('Not implemented');},
        'sum': function sum(optNodeSet) {
          if (null == optNodeSet) return fn.sum(this);
          // for node-sets, map id over each node value.
          var sum = 0;
          for (var i = 0; i < optNodeSet.nodes.length; ++i) {
            var node = optNodeSet.nodes[i];
            var x = fn.number({nodes:[node]});
            sum += x;
          }
          return sum;
        },
        'floor': function floor(number) {
          return Math.floor(fn.number(number));
        },
        'ceiling': function ceiling(number) {
          return Math.ceil(fn.number(number));
        },
        'round': function round(number) {
          return Math.round(fn.number(number));
        }
      };
      /***************************************************************************
       *                         Evaluation: operators                           *
       ***************************************************************************/
      var more = {
        UnaryMinus: function(x) { return -fn.number(x); },
        '+': function(x, y) { return fn.number(x) + fn.number(y); },
        '-': function(x, y) { return fn.number(x) - fn.number(y); },
        '*': function(x, y) { return fn.number(x) * fn.number(y); },
        'div': function(x, y) { return fn.number(x) / fn.number(y); },
        'mod': function(x, y) { return fn.number(x) % fn.number(y); },
        '<': function(x, y) {
          return comparisonHelper(function(x, y) { return fn.number(x) < fn.number(y);}, x, y, true);
        },
        '<=': function(x, y) {
          return comparisonHelper(function(x, y) { return fn.number(x) <= fn.number(y);}, x, y, true);
        },
        '>':  function(x, y) {
          return comparisonHelper(function(x, y) { return fn.number(x) > fn.number(y);}, x, y, true);
        },
        '>=': function(x, y) {
          return comparisonHelper(function(x, y) { return fn.number(x) >= fn.number(y);}, x, y, true);
        },
        'and': function(x, y) { return fn['boolean'](x) && fn['boolean'](y); },
        'or': function(x, y) { return fn['boolean'](x) || fn['boolean'](y); },
        '|': function(x, y) { return {nodes: mergeNodeLists(x.nodes, y.nodes)}; },
        '=': function(x, y) {
          // optimization for two node-sets case: avoid n^2 comparisons.
          if ('object' === typeof x && 'object' === typeof y) {
            var aMap = {};
            for (var i = 0; i < x.nodes.length; ++i) {
              var s = fn.string({nodes:[x.nodes[i]]});
              aMap[s] = true;
            }
            for (var i = 0; i < y.nodes.length; ++i) {
              var s = fn.string({nodes:[y.nodes[i]]});
              if (aMap[s]) return true;
            }
            return false;
          } else {
            return comparisonHelper(function(x, y) {return x === y;}, x, y);
          }
        },
        '!=': function(x, y) {
          // optimization for two node-sets case: avoid n^2 comparisons.
          if ('object' === typeof x && 'object' === typeof y) {
            if (0 === x.nodes.length || 0 === y.nodes.length) return false;
            var aMap = {};
            for (var i = 0; i < x.nodes.length; ++i) {
              var s = fn.string({nodes:[x.nodes[i]]});
              aMap[s] = true;
            }
            for (var i = 0; i < y.nodes.length; ++i) {
              var s = fn.string({nodes:[y.nodes[i]]});
              if (!aMap[s]) return true;
            }
            return false;
          } else {
            return comparisonHelper(function(x, y) {return x !== y;}, x, y);
          }
        }
      };
      var nodeTypes = xpath.nodeTypes = {
        'node': 0,
        'attribute': 2,
        'comment': 8, // this.doc.COMMENT_NODE,
        'text': 3, // this.doc.TEXT_NODE,
        'processing-instruction': 7, // this.doc.PROCESSING_INSTRUCTION_NODE,
        'element': 1  //this.doc.ELEMENT_NODE
      };
      /** For debugging and unit tests: returnjs a stringified version of the
       * argument. */
      var stringifyObject = xpath.stringifyObject = function stringifyObject(ctx) {
        var seenKey = 'seen' + Math.floor(Math.random()*1000000000);
        return JSON.stringify(helper(ctx));

        function helper(ctx) {
          if (Array.isArray(ctx)) {
            return ctx.map(function(x) {return helper(x);});
          }
          if ('object' !== typeof ctx) return ctx;
          if (null == ctx) return ctx;
        //  if (ctx.toString) return ctx.toString();
          if (null != ctx.outerHTML) return ctx.outerHTML;
          if (null != ctx.nodeValue) return ctx.nodeName + '=' + ctx.nodeValue;
          if (ctx[seenKey]) return '[circular]';
          ctx[seenKey] = true;
          var nicer = {};
          for (var key in ctx) {
            if (seenKey === key)
              continue;
            try {
              nicer[key] = helper(ctx[key]);
            } catch (e) {
              nicer[key] = '[exception: ' + e.message + ']';
            }
          }
          delete ctx[seenKey];
          return nicer;
        }
      }
      var Evaluator = xpath.Evaluator = function Evaluator(doc) {
        this.doc = doc;
      }
      Evaluator.prototype = {
        val: function val(ast, ctx) {
          console.assert(ctx.nodes);

          if ('number' === typeof ast || 'string' === typeof ast) return ast;
          if (more[ast[0]]) {
            var evaluatedParams = [];
            for (var i = 1; i < ast.length; ++i) {
              evaluatedParams.push(this.val(ast[i], ctx));
            }
            var r = more[ast[0]].apply(ctx, evaluatedParams);
            return r;
          }
          switch (ast[0]) {
            case 'Root': return {nodes: [this.doc]};
            case 'FunctionCall':
              var functionName = ast[1], functionParams = ast[2];
              if (null == fn[functionName])
                throw new XPathException(XPathException.INVALID_EXPRESSION_ERR,
                                         'Unknown function: ' + functionName);
              var evaluatedParams = [];
              for (var i = 0; i < functionParams.length; ++i) {
                evaluatedParams.push(this.val(functionParams[i], ctx));
              }
              var r = fn[functionName].apply(ctx, evaluatedParams);
              return r;
            case 'Predicate':
              var lhs = this.val(ast[1], ctx);
              var ret = {nodes: []};
              var contexts = eachContext(lhs);
              for (var i = 0; i < contexts.length; ++i) {
                var singleNodeSet = contexts[i];
                var rhs = this.val(ast[2], singleNodeSet);
                var success;
                if ('number' === typeof rhs) {
                  success = rhs === singleNodeSet.pos[0][0];
                } else {
                  success = fn['boolean'](rhs);
                }
                if (success) {
                  var node = singleNodeSet.nodes[0];
                  ret.nodes.push(node);
                  // skip over all the rest of the same node.
                  while (i+1 < contexts.length && node === contexts[i+1].nodes[0]) {
                    i++;
                  }
                }
              }
              return ret;
            case 'PathExpr':
              // turn the path into an expressoin; i.e., remove the position
              // information of the last axis.
              var x = this.val(ast[1], ctx);
              // Make the nodeset a forward-direction-only one.
              if (x.finalize) {  // it is a NodeMultiSet
                for (var i = 0; i < x.nodes.length; ++i) {
                  console.assert(null != x.nodes[i].nodeType);
                }
                return {nodes: x.nodes};
              } else {
                return x;
              }
            case '/':
              // TODO: don't generate '/' nodes, just Axis nodes.
              var lhs = this.val(ast[1], ctx);
              console.assert(null != lhs);
              var r = this.val(ast[2], lhs);
              console.assert(null != r);
              return r;
            case 'Axis':
              // All the axis tests from Step. We only get AxisSpecifier NodeTest,
              // not the predicate (which is applied later)
              var axis = ast[1],
                  nodeType = ast[2],
                  nodeTypeNum = nodeTypes[nodeType],
                  shouldLowerCase = true,  // TODO: give option
                  nodeName = ast[3] && shouldLowerCase ? ast[3].toLowerCase() : ast[3];
              nodeName = nodeName === '*' ? null : nodeName;
              if ('object' !== typeof ctx) return {nodes:[], pos:[]};
              var nodeList = ctx.nodes.slice();  // TODO: is copy needed?
              var r = axes[axis](nodeList  /*destructive!*/, nodeTypeNum, nodeName, shouldLowerCase);
              return r;
          }
        }
      };
      var evaluate = xpath.evaluate = function evaluate(expr, doc, context) {
        //var astFactory = new AstEvaluatorFactory(doc, context);
        var stream = new Stream(expr);
        var ast = parse(stream, astFactory);
        var val = new Evaluator(doc).val(ast, {nodes: [context]});
        return val;
      }

      /***************************************************************************
       *                           DOM interface                                 *
       ***************************************************************************/
      var XPathException = xpath.XPathException = function XPathException(code, message) {
        var e = new Error(message);
        this.__proto__ = e;
        this.name = 'XPathException';
        this.code = code;
      }
      XPathException.prototype = Error.prototype;
      XPathException.prototype.__proto__ = XPathException;
      XPathException.INVALID_EXPRESSION_ERR = 51;
      XPathException.TYPE_ERR = 52;


      var XPathEvaluator = xpath.XPathEvaluator = function XPathEvaluator() {}
      XPathEvaluator.prototype = {
        createExpression: function(expression, resolver) {
          return new XPathExpression(expression, resolver);
        },
        createNSResolver: function(nodeResolver) {
          // TODO
        },
        evaluate: function evaluate(expression, contextNode, resolver, type, result) {
          var expr = new XPathExpression(expression, resolver);
          return expr.evaluate(contextNode, type, result);
        }
      };


      var XPathExpression = xpath.XPathExpression = function XPathExpression(expression, resolver, optDoc) {
        var stream = new Stream(expression);
        this._ast = parse(stream, astFactory);
        this._doc = optDoc;
      }
      XPathExpression.prototype = {
        evaluate: function evaluate(contextNode, type, result) {
          if (null == contextNode.nodeType)
            throw new Error('bad argument (expected context node): ' + contextNode);
          var doc = contextNode.ownerDocument || contextNode;
          if (null != this._doc && this._doc !== doc) {
            throw new core.DOMException(
                core.WRONG_DOCUMENT_ERR,
                'The document must be the same as the context node\'s document.');
          }
          var evaluator = new Evaluator(doc);
          var value = evaluator.val(this._ast, {nodes: [contextNode]});
          if (XPathResult.NUMBER_TYPE === type)
            value = fn.number(value);
          else if (XPathResult.STRING_TYPE === type)
            value = fn.string(value);
          else if (XPathResult.BOOLEAN_TYPE === type)
            value = fn['boolean'](value);
          else if (XPathResult.ANY_TYPE !== type &&
                   XPathResult.UNORDERED_NODE_ITERATOR_TYPE !== type &&
                   XPathResult.ORDERED_NODE_ITERATOR_TYPE !== type &&
                   XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE !== type &&
                   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE !== type &&
                   XPathResult.ANY_UNORDERED_NODE_TYPE !== type &&
                   XPathResult.FIRST_ORDERED_NODE_TYPE !== type)
            throw new core.DOMException(
                core.NOT_SUPPORTED_ERR,
                'You must provide an XPath result type (0=any).');
          else if (XPathResult.ANY_TYPE !== type &&
                   'object' !== typeof value)
            throw new XPathException(
                XPathException.TYPE_ERR,
                'Value should be a node-set: ' + value);
          return new XPathResult(doc, value, type);
        }
      }

      var XPathResult = xpath.XPathResult = function XPathResult(doc, value, resultType) {
        this._value = value;
        this._resultType = resultType;
        this._i = 0;
        this._invalidated = false;
        if (this.resultType === XPathResult.UNORDERED_NODE_ITERATOR_TYPE ||
            this.resultType === XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
          doc.addEventListener('DOMSubtreeModified', invalidate, true);
          var self = this;
          function invalidate() {
            self._invalidated = true;
            doc.removeEventListener('DOMSubtreeModified', invalidate, true);
          }
        }
      }
      XPathResult.ANY_TYPE = 0;
      XPathResult.NUMBER_TYPE = 1;
      XPathResult.STRING_TYPE = 2;
      XPathResult.BOOLEAN_TYPE = 3;
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE = 4;
      XPathResult.ORDERED_NODE_ITERATOR_TYPE = 5;
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;
      XPathResult.ANY_UNORDERED_NODE_TYPE = 8;
      XPathResult.FIRST_ORDERED_NODE_TYPE = 9;
      XPathResult.prototype = {
        // XPathResultType
        get resultType() {
          if (this._resultType) return this._resultType;
          switch (typeof this._value) {
            case 'number': return XPathResult.NUMBER_TYPE;
            case 'string': return XPathResult.STRING_TYPE;
            case 'boolean': return XPathResult.BOOLEAN_TYPE;
            default: return XPathResult.UNORDERED_NODE_ITERATOR_TYPE;
          }
        },
        get numberValue() {
          if (XPathResult.NUMBER_TYPE !== this.resultType)
            throw new XPathException(XPathException.TYPE_ERR,
                                     'You should have asked for a NUMBER_TYPE.');
          return this._value;
        },
        get stringValue() {
          if (XPathResult.STRING_TYPE !== this.resultType)
            throw new XPathException(XPathException.TYPE_ERR,
                                     'You should have asked for a STRING_TYPE.');
          return this._value;
        },
        get booleanValue() {
          if (XPathResult.BOOLEAN_TYPE !== this.resultType)
            throw new XPathException(XPathException.TYPE_ERR,
                                     'You should have asked for a BOOLEAN_TYPE.');
          return this._value;
        },
        get singleNodeValue() {
          if (XPathResult.ANY_UNORDERED_NODE_TYPE !== this.resultType &&
              XPathResult.FIRST_ORDERED_NODE_TYPE !== this.resultType)
            throw new XPathException(
                XPathException.TYPE_ERR,
                'You should have asked for a FIRST_ORDERED_NODE_TYPE.');
          return this._value.nodes[0] || null;
        },
        get invalidIteratorState() {
          if (XPathResult.UNORDERED_NODE_ITERATOR_TYPE !== this.resultType &&
              XPathResult.ORDERED_NODE_ITERATOR_TYPE !== this.resultType)
            return false;
          return !!this._invalidated;
        },
        get snapshotLength() {
          if (XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE !== this.resultType &&
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE !== this.resultType)
            throw new XPathException(
                XPathException.TYPE_ERR,
                'You should have asked for a ORDERED_NODE_SNAPSHOT_TYPE.');
          return this._value.nodes.length;
        },
        iterateNext: function iterateNext() {
          if (XPathResult.UNORDERED_NODE_ITERATOR_TYPE !== this.resultType &&
              XPathResult.ORDERED_NODE_ITERATOR_TYPE !== this.resultType)
            throw new XPathException(
                XPathException.TYPE_ERR,
                'You should have asked for a ORDERED_NODE_ITERATOR_TYPE.');
          if (this.invalidIteratorState)
            throw new core.DOMException(
                core.INVALID_STATE_ERR,
                'The document has been mutated since the result was returned');
          return this._value.nodes[this._i++] || null;
        },
        snapshotItem: function snapshotItem(index) {
          if (XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE !== this.resultType &&
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE !== this.resultType)
            throw new XPathException(
                XPathException.TYPE_ERR,
                'You should have asked for a ORDERED_NODE_SNAPSHOT_TYPE.');
          return this._value.nodes[index] || null;
        }
      };
      // so you can access ANY_TYPE etc. from the instances:
      XPathResult.prototype.__proto__ = XPathResult;

      core.XPathException = XPathException;
      core.XPathExpression = XPathExpression;
      core.XPathResult = XPathResult;
      core.XPathEvaluator = XPathEvaluator;

      core.Document.prototype.createExpression =
        XPathEvaluator.prototype.createExpression;

      core.Document.prototype.createNSResolver =
          XPathEvaluator.prototype.createNSResolver;

      core.Document.prototype.evaluate = XPathEvaluator.prototype.evaluate;

    })();

    return exports;
});

define('jsdom/level2/events',[
    './core',
    '../../util'
],
function (_core, util) {
    /* DOM Level2 Events implemented as described here:
     *
     * http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
     *
     */
    var exports = {};
    var core = _core.dom.level2.core;

    var events = {};

    events.EventException = function() {
        if (arguments.length > 0) {
            this._code = arguments[0];
        } else {
            this._code = 0;
        }
        if (arguments.length > 1) {
            this._message = arguments[1];
        } else {
            this._message = "Unspecified event type";
        }
        Error.call(this, this._message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, events.EventException);
        }
    };
    util.inherit(events.EventException, Error.prototype, {
      UNSPECIFIED_EVENT_TYPE_ERR : 0,
      get code() { return this._code;}
    });

    events.Event = function(eventType) {
        this._eventType = eventType;
        this._type = null;
        this._bubbles = null;
        this._cancelable = null;
        this._target = null;
        this._currentTarget = null;
        this._eventPhase = null;
        this._timeStamp = null;
        this._preventDefault = false;
        this._stopPropagation = false;
    };
    events.Event.prototype = {
        initEvent: function(type, bubbles, cancelable) {
            this._type = type;
            this._bubbles = bubbles;
            this._cancelable = cancelable;
        },
        preventDefault: function() {
            if (this._cancelable) {
                this._preventDefault = true;
            }
        },
        stopPropagation: function() {
            this._stopPropagation = true;
        },
        CAPTURING_PHASE : 1,
        AT_TARGET       : 2,
        BUBBLING_PHASE  : 3,
        get eventType() { return this._eventType; },
        get type() { return this._type; },
        get bubbles() { return this._bubbles; },
        get cancelable() { return this._cancelable; },
        get target() { return this._target; },
        get currentTarget() { return this._currentTarget; },
        get eventPhase() { return this._eventPhase; },
        get timeStamp() { return this._timeStamp; }
    };

    events.HTMLEvent = function(eventType) {
        events.Event.call(this, eventType);
    };
    util.inherit(events.HTMLEvent, events.Event.prototype, {});

    events.UIEvent = function(eventType) {
        events.Event.call(this, eventType);
        this.view = null;
        this.detail = null;
    };
    util.inherit(events.UIEvent, events.Event.prototype, {
        initUIEvent: function(type, bubbles, cancelable, view, detail) {
            this.initEvent(type, bubbles, cancelable);
            this.view = view;
            this.detail = detail;
        },
    });

    events.MouseEvent = function(eventType) {
        events.UIEvent.call(this, eventType);
        this.screenX = null;
        this.screenY = null;
        this.clientX = null;
        this.clientY = null;
        this.ctrlKey = null;
        this.shiftKey = null;
        this.altKey = null;
        this.metaKey = null;
        this.button = null;
        this.relatedTarget = null;
    };
    util.inherit(events.MouseEvent, events.UIEvent.prototype, {
        initMouseEvent:   function(type,
                                   bubbles,
                                   cancelable,
                                   view,
                                   detail,
                                   screenX,
                                   screenY,
                                   clientX,
                                   clientY,
                                   ctrlKey,
                                   altKey,
                                   shiftKey,
                                   metaKey,
                                   button,
                                   relatedTarget) {
            this.initUIEvent(type, bubbles, cancelable, view, detail);
            this.screenX  = screenX
            this.screenY  = screenY
            this.clientX  = clientX
            this.clientY  = clientY
            this.ctrlKey  = ctrlKey
            this.shiftKey  = shiftKey
            this.altKey  = altKey
            this.metaKey  = metaKey
            this.button  = button
            this.relatedTarget  = relatedTarget
        }
    });

    events.MutationEvent = function(eventType) {
        events.Event.call(this, eventType);
        this.relatedNode = null;
        this.prevValue = null;
        this.newValue = null;
        this.attrName = null;
        this.attrChange = null;
    };
    util.inherit(events.MutationEvent, events.Event.prototype, {
        initMutationEvent:   function(type,
                                      bubbles,
                                      cancelable,
                                      relatedNode,
                                      prevValue,
                                      newValue,
                                      attrName,
                                      attrChange) {
            this.initEvent(type, bubbles, cancelable);
            this.relatedNode = relatedNode;
            this.prevValue = prevValue;
            this.newValue = newValue;
            this.attrName = attrName;
            this.attrChange = attrChange;
        },
        MODIFICATION : 1,
        ADDITION     : 2,
        REMOVAL      : 3
    });

    events.EventTarget = function() {};

    events.EventTarget.getListeners = function getListeners(target, type, capturing) {
        var listeners = target._listeners
                && target._listeners[type]
                && target._listeners[type][capturing];
        if (listeners && listeners.length) {
            return listeners;
        }
        return [];
    };

    events.EventTarget.dispatch = function dispatch(event, iterator, capturing) {
        var listeners,
            currentListener,
            target = iterator();

        while (target && !event._stopPropagation) {
            listeners = events.EventTarget.getListeners(target, event._type, capturing);
            currentListener = listeners.length;
            while (currentListener--) {
                event._currentTarget = target;
                try {
                  listeners[currentListener].call(target, event);
                } catch (e) {
                  target.trigger(
                    'error', "Dispatching event '" + event._type + "' failed",
                    {error: e, event: event}
                  );
                }
            }
            target = iterator();
        }
        return !event._stopPropagation;
    };

    events.EventTarget.forwardIterator = function forwardIterator(list) {
      var i = 0, len = list.length;
      return function iterator() { return i < len ? list[i++] : null };
    };

    events.EventTarget.backwardIterator = function backwardIterator(list) {
      var i = list.length;
      return function iterator() { return i >=0 ? list[--i] : null };
    };

    events.EventTarget.singleIterator = function singleIterator(obj) {
      var i = 1;
      return function iterator() { return i-- ? obj : null };
    };

    events.EventTarget.prototype = {
        addEventListener: function(type, listener, capturing) {
            this._listeners = this._listeners || {};
            var listeners = this._listeners[type] || {};
            capturing = (capturing === true);
            var capturingListeners = listeners[capturing] || [];
            for (var i=0; i < capturingListeners.length; i++) {
                if (capturingListeners[i] === listener) {
                    return;
                }
            }
            capturingListeners.push(listener);
            listeners[capturing] = capturingListeners;
            this._listeners[type] = listeners;
        },

        removeEventListener: function(type, listener, capturing) {
            var listeners  = this._listeners && this._listeners[type];
            if (!listeners) return;
            var capturingListeners = listeners[(capturing === true)];
            if (!capturingListeners) return;
            for (var i=0; i < capturingListeners.length; i++) {
                if (capturingListeners[i] === listener) {
                    capturingListeners.splice(i, 1);
                    return;
                }
            }
        },

        dispatchEvent: function(event) {
            if (event == null) {
                throw new events.EventException(0, "Null event");
            }
            if (event._type == null || event._type == "") {
                throw new events.EventException(0, "Uninitialized event");
            }

            var nextTarget = null;
            var targetList = [];

            event._target = this;

            //per the spec we gather the list of targets first to ensure
            //against dom modifications during actual event dispatch
            nextTarget = this._parentNode;
            while (nextTarget) {
                targetList.push(nextTarget);
                nextTarget = nextTarget._parentNode;
            }

            var iterator = events.EventTarget.backwardIterator(targetList);

            event._eventPhase = event.CAPTURING_PHASE;
            if (!events.EventTarget.dispatch(event, iterator, true)) return event._preventDefault;

            iterator = events.EventTarget.singleIterator(event._target);
            event._eventPhase = event.AT_TARGET;
            if (!events.EventTarget.dispatch(event, iterator, false)) return event._preventDefault;

            var traditionalHandler = this["on" + event._type];
            if (traditionalHandler) {
              try {
                if (traditionalHandler(event) === false) {
                  return true;
                }
              }
              catch (e) {
                event._target.trigger(
                  'error', "Dispatching event '" + event._type + "' failed.",
                  {error: e, event: event}
                );
              }
            }

            if (event._bubbles && !event._stopPropagation) {
                var i = 0;
                iterator = events.EventTarget.forwardIterator(targetList);
                event._eventPhase = event.BUBBLING_PHASE;
                events.EventTarget.dispatch(event, iterator, false);
            }

            return event._preventDefault;
        }

    };


    // XXX: HACK. Workaround for evil use of __proto__ property. Original code was:
    //   core.Node.prototype.__proto__ = events.EventTarget.prototype;
    // 
    // We can't do that IE, and can't reinherit, as that busts the inheritance
    // chain for subclasses of core.Node.
    //
    // The gotcha here is that changes to events.EventTarget.prototype DO NOT
    // show up on core.Node.prototype. This isn't a problem in the current
    // code, but could cause problems in the future.
    util.augment(core.Node.prototype, events.EventTarget.prototype);

    function getDocument(el) {
      return el.nodeType == core.Node.DOCUMENT_NODE ? el : el._ownerDocument;
    }

    function mutationEventsEnabled(el) {
      return (el.nodeType == core.Node.ELEMENT_NODE ||
              el.nodeType == core.Node.CDATA_SECTION_NODE ||
              el.nodeType == core.Node.DOCUMENT_NODE) &&
          getDocument(el).implementation.hasFeature('MutationEvents');
    }

    function advise(clazz, method, advice) {
        var proto = clazz.prototype,
            impl = proto[method];

      proto[method] = function() {
        var args = Array.prototype.slice.call(arguments);
        var ret = impl.apply(this, arguments);
        args.unshift(ret);
        return advice.apply(this, args) || ret;
      };
    }

    function adviseBefore(clazz, method, advice) {
      var proto = clazz.prototype,
          impl = proto[method];

      proto[method] = function() {
        advice.apply(this, arguments);
        return impl.apply(this, arguments);
      };
    }

    function dispatchInsertionEvent(ret, newChild, refChild) {
      if (mutationEventsEnabled(this)) {
        var doc = getDocument(this),
            ev = doc.createEvent("MutationEvents");

        ev.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
        newChild.dispatchEvent(ev);
        if (this.nodeType == core.Node.DOCUMENT_NODE || this._attachedToDocument) {
          ev = doc.createEvent("MutationEvents");
          ev.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
          core.visitTree(newChild, function(el) {
            if (el.nodeType == core.Node.ELEMENT_NODE) {
              el.dispatchEvent(ev);
              el._attachedToDocument = true;
            }
          });
        }

        ev = doc.createEvent("MutationEvents");
        ev.initMutationEvent("DOMSubtreeModified", true, false, this, '', '', '', ev.ADDITION);
        newChild.dispatchEvent(ev);
      }
    }

    function dispatchRemovalEvent(oldChild) {
      if (mutationEventsEnabled(this)) {
        var doc = getDocument(this),
            ev = doc.createEvent("MutationEvents");

        ev.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
        oldChild.dispatchEvent(ev);

        ev = doc.createEvent("MutationEvents");
        ev.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
        core.visitTree(oldChild, function(el) {
          if (el.nodeType == core.Node.ELEMENT_NODE) {
            el.dispatchEvent(ev);
            el._attachedToDocument = false;
          }
        });

        ev = doc.createEvent("MutationEvents");
        ev.initMutationEvent("DOMSubtreeModified", true, false, this, '', '', '', ev.REMOVAL);
        oldChild.dispatchEvent(ev);
      }
    }

    function dispatchAttrEvent(change, arg) {
      return function(ret) {
        var target = this._parentNode,
            node = arguments[arg];

        if (mutationEventsEnabled(target)) {
          var doc = target._ownerDocument,
              attrChange = events.MutationEvent.prototype[change],
              prevVal = arg == 0 ? node.value : null,
              newVal = arg == 1 ? node.value : null,
              ev = doc.createEvent("MutationEvents");

          ev.initMutationEvent("DOMAttrModified", true, false,
                               target, prevVal, newVal, node.name, attrChange);
          target.dispatchEvent(ev);

          ev = doc.createEvent("MutationEvents");
          ev.initMutationEvent("DOMSubtreeModified", true, false,
                               target, prevVal, newVal, node.name, ev.MODIFICATION);
          target.dispatchEvent(ev);
        }
      }
    }

    advise(core.Node, 'insertBefore', dispatchInsertionEvent);
    adviseBefore(core.Node, 'removeChild', dispatchRemovalEvent);

    advise(core.AttrNodeMap, 'removeNamedItem', dispatchAttrEvent('REMOVAL', 0));
    advise(core.AttrNodeMap, 'setNamedItem', dispatchAttrEvent('ADDITION', 1));

    util.updateProperty(core.CharacterData.prototype, "_nodeValue", {
        set: function(value) {
            var oldValue = this._nodeValue;
            this._text = value;
            if (this._ownerDocument && this._parentNode && mutationEventsEnabled(this)) {
                var ev = this._ownerDocument.createEvent("MutationEvents")
                ev.initMutationEvent("DOMCharacterDataModified", true, false, this,
                                     oldValue, value, null, null);
                this.dispatchEvent(ev);
            }
        }
    });

    core.Document.prototype.createEvent = function(eventType) {
        switch (eventType) {
            case "MutationEvents": return new events.MutationEvent(eventType);
            case "UIEvents": return new events.UIEvent(eventType);
            case "MouseEvents": return new events.MouseEvent(eventType);
            case "HTMLEvents": return new events.HTMLEvent(eventType);
        }
        return new events.Event(eventType);
    };

    exports.dom =
    {
      level2 : {
        core   : core,
        events : events
      }
    };

    return exports;
});

define('jsdom/level3/events',[
    '../level2/events'
],
function (_events) {
    var events = _events.dom.level2.events;
    var exports = {};

    /*

    // File: events.idl

    #ifndef _EVENTS_IDL_
    #define _EVENTS_IDL_

    #include "dom.idl"
    #include "views.idl"

    #pragma prefix "dom.w3c.org"
    module events
    {

      typedef dom::DOMString DOMString;
      typedef dom::DOMTimeStamp DOMTimeStamp;
      typedef dom::DOMObject DOMObject;
      typedef dom::Node Node;

      interface EventTarget;
      interface EventListener;

      // Introduced in DOM Level 2:
      exception EventException {
        unsigned short   code;
      };
      // EventExceptionCode
      const unsigned short      UNSPECIFIED_EVENT_TYPE_ERR     = 0;
      // Introduced in DOM Level 3:
      const unsigned short      DISPATCH_REQUEST_ERR           = 1;


      // Introduced in DOM Level 2:
      interface Event {

        // PhaseType
        const unsigned short      CAPTURING_PHASE                = 1;
        const unsigned short      AT_TARGET                      = 2;
        const unsigned short      BUBBLING_PHASE                 = 3;

        readonly attribute DOMString       type;
        readonly attribute EventTarget     target;
        readonly attribute EventTarget     currentTarget;
        readonly attribute unsigned short  eventPhase;
        readonly attribute boolean         bubbles;
        readonly attribute boolean         cancelable;
        readonly attribute DOMTimeStamp    timeStamp;
        void               stopPropagation();
        void               preventDefault();
        void               initEvent(in DOMString eventTypeArg,
                                     in boolean canBubbleArg,
                                     in boolean cancelableArg);
        // Introduced in DOM Level 3:
        readonly attribute DOMString       namespaceURI;
        // Introduced in DOM Level 3:
        boolean            isCustom();
        // Introduced in DOM Level 3:
        void               stopImmediatePropagation();
        // Introduced in DOM Level 3:
        boolean            isDefaultPrevented();
        // Introduced in DOM Level 3:
        void               initEventNS(in DOMString namespaceURIArg,
                                       in DOMString eventTypeArg,
                                       in boolean canBubbleArg,
                                       in boolean cancelableArg);
      };

      // Introduced in DOM Level 2:
      interface EventTarget {
        void               addEventListener(in DOMString type,
                                            in EventListener listener,
                                            in boolean useCapture);
        void               removeEventListener(in DOMString type,
                                               in EventListener listener,
                                               in boolean useCapture);
        // Modified in DOM Level 3:
        boolean            dispatchEvent(in Event evt)
                                            raises(EventException);
        // Introduced in DOM Level 3:
        void               addEventListenerNS(in DOMString namespaceURI,
                                              in DOMString type,
                                              in EventListener listener,
                                              in boolean useCapture,
                                              in DOMObject evtGroup);
        // Introduced in DOM Level 3:
        void               removeEventListenerNS(in DOMString namespaceURI,
                                                 in DOMString type,
                                                 in EventListener listener,
                                                 in boolean useCapture);
        // Introduced in DOM Level 3:
        boolean            willTriggerNS(in DOMString namespaceURI,
                                         in DOMString type);
        // Introduced in DOM Level 3:
        boolean            hasEventListenerNS(in DOMString namespaceURI,
                                              in DOMString type);
      };

      // Introduced in DOM Level 2:
      interface EventListener {
        void               handleEvent(in Event evt);
      };

      // Introduced in DOM Level 2:
      interface DocumentEvent {
        Event              createEvent(in DOMString eventType)
                                            raises(dom::DOMException);
        // Introduced in DOM Level 3:
        boolean            canDispatch(in DOMString namespaceURI,
                                       in DOMString type);
      };

      // Introduced in DOM Level 3:
      interface CustomEvent : Event {
        void               setDispatchState(in EventTarget target,
                                            in unsigned short phase);
        boolean            isPropagationStopped();
        boolean            isImmediatePropagationStopped();
      };

      // Introduced in DOM Level 2:
      interface UIEvent : Event {
        readonly attribute views::AbstractView view;
        readonly attribute long            detail;
        void               initUIEvent(in DOMString typeArg,
                                       in boolean canBubbleArg,
                                       in boolean cancelableArg,
                                       in views::AbstractView viewArg,
                                       in long detailArg);
        // Introduced in DOM Level 3:
        void               initUIEventNS(in DOMString namespaceURI,
                                         in DOMString typeArg,
                                         in boolean canBubbleArg,
                                         in boolean cancelableArg,
                                         in views::AbstractView viewArg,
                                         in long detailArg);
      };

      // Introduced in DOM Level 3:
      interface TextEvent : UIEvent {
        readonly attribute DOMString       data;
        void               initTextEvent(in DOMString typeArg,
                                         in boolean canBubbleArg,
                                         in boolean cancelableArg,
                                         in views::AbstractView viewArg,
                                         in DOMString dataArg);
        void               initTextEventNS(in DOMString namespaceURI,
                                           in DOMString type,
                                           in boolean canBubbleArg,
                                           in boolean cancelableArg,
                                           in views::AbstractView viewArg,
                                           in DOMString dataArg);
      };

      // Introduced in DOM Level 2:
      interface MouseEvent : UIEvent {
        readonly attribute long            screenX;
        readonly attribute long            screenY;
        readonly attribute long            clientX;
        readonly attribute long            clientY;
        readonly attribute boolean         ctrlKey;
        readonly attribute boolean         shiftKey;
        readonly attribute boolean         altKey;
        readonly attribute boolean         metaKey;
        readonly attribute unsigned short  button;
        readonly attribute EventTarget     relatedTarget;
        void               initMouseEvent(in DOMString typeArg,
                                          in boolean canBubbleArg,
                                          in boolean cancelableArg,
                                          in views::AbstractView viewArg,
                                          in long detailArg,
                                          in long screenXArg,
                                          in long screenYArg,
                                          in long clientXArg,
                                          in long clientYArg,
                                          in boolean ctrlKeyArg,
                                          in boolean altKeyArg,
                                          in boolean shiftKeyArg,
                                          in boolean metaKeyArg,
                                          in unsigned short buttonArg,
                                          in EventTarget relatedTargetArg);
        // Introduced in DOM Level 3:
        boolean            getModifierState(in DOMString keyIdentifierArg);
        // Introduced in DOM Level 3:
        void               initMouseEventNS(in DOMString namespaceURI,
                                            in DOMString typeArg,
                                            in boolean canBubbleArg,
                                            in boolean cancelableArg,
                                            in views::AbstractView viewArg,
                                            in long detailArg,
                                            in long screenXArg,
                                            in long screenYArg,
                                            in long clientXArg,
                                            in long clientYArg,
                                            in unsigned short buttonArg,
                                            in EventTarget relatedTargetArg,
                                            in DOMString modifiersList);
      };

      // Introduced in DOM Level 3:
      interface KeyboardEvent : UIEvent {

        // KeyLocationCode
        const unsigned long       DOM_KEY_LOCATION_STANDARD      = 0x00;
        const unsigned long       DOM_KEY_LOCATION_LEFT          = 0x01;
        const unsigned long       DOM_KEY_LOCATION_RIGHT         = 0x02;
        const unsigned long       DOM_KEY_LOCATION_NUMPAD        = 0x03;

        readonly attribute DOMString       keyIdentifier;
        readonly attribute unsigned long   keyLocation;
        readonly attribute boolean         ctrlKey;
        readonly attribute boolean         shiftKey;
        readonly attribute boolean         altKey;
        readonly attribute boolean         metaKey;
        boolean            getModifierState(in DOMString keyIdentifierArg);
        void               initKeyboardEvent(in DOMString typeArg,
                                             in boolean canBubbleArg,
                                             in boolean cancelableArg,
                                             in views::AbstractView viewArg,
                                             in DOMString keyIdentifierArg,
                                             in unsigned long keyLocationArg,
                                             in DOMString modifiersList);
        void               initKeyboardEventNS(in DOMString namespaceURI,
                                               in DOMString typeArg,
                                               in boolean canBubbleArg,
                                               in boolean cancelableArg,
                                               in views::AbstractView viewArg,
                                               in DOMString keyIdentifierArg,
                                               in unsigned long keyLocationArg,
                                               in DOMString modifiersList);
      };

      // Introduced in DOM Level 2:
      interface MutationEvent : Event {

        // attrChangeType
        const unsigned short      MODIFICATION                   = 1;
        const unsigned short      ADDITION                       = 2;
        const unsigned short      REMOVAL                        = 3;

        readonly attribute Node            relatedNode;
        readonly attribute DOMString       prevValue;
        readonly attribute DOMString       newValue;
        readonly attribute DOMString       attrName;
        readonly attribute unsigned short  attrChange;
        void               initMutationEvent(in DOMString typeArg,
                                             in boolean canBubbleArg,
                                             in boolean cancelableArg,
                                             in Node relatedNodeArg,
                                             in DOMString prevValueArg,
                                             in DOMString newValueArg,
                                             in DOMString attrNameArg,
                                             in unsigned short attrChangeArg);
        // Introduced in DOM Level 3:
        void               initMutationEventNS(in DOMString namespaceURI,
                                               in DOMString typeArg,
                                               in boolean canBubbleArg,
                                               in boolean cancelableArg,
                                               in Node relatedNodeArg,
                                               in DOMString prevValueArg,
                                               in DOMString newValueArg,
                                               in DOMString attrNameArg,
                                               in unsigned short attrChangeArg);
      };

      // Introduced in DOM Level 3:
      interface MutationNameEvent : MutationEvent {
        readonly attribute DOMString       prevNamespaceURI;
        readonly attribute DOMString       prevNodeName;
        // Introduced in DOM Level 3:
        void               initMutationNameEvent(in DOMString typeArg,
                                                 in boolean canBubbleArg,
                                                 in boolean cancelableArg,
                                                 in Node relatedNodeArg,
                                                 in DOMString prevNamespaceURIArg,
                                                 in DOMString prevNodeNameArg);
        // Introduced in DOM Level 3:
        void               initMutationNameEventNS(in DOMString namespaceURI,
                                                   in DOMString typeArg,
                                                   in boolean canBubbleArg,
                                                   in boolean cancelableArg,
                                                   in Node relatedNodeArg,
                                                   in DOMString prevNamespaceURIArg,
                                                   in DOMString prevNodeNameArg);
      };
    };

    #endif // _EVENTS_IDL_
    */

    exports.dom = {
      level3 : {
        events:  events
      }
    }

    return exports;
});

define('jsdom/browser/documentfeatures',[],function () {
    var exports = {};

    exports.availableDocumentFeatures = [
      'FetchExternalResources',
      'ProcessExternalResources',
      'MutationEvents',
      'QuerySelector'
    ];

    exports.defaultDocumentFeatures = {
      "FetchExternalResources"   : ['script'/*, 'img', 'css', 'frame', 'link'*/],
      "ProcessExternalResources" : ['script'/*, 'frame', 'iframe'*/],
      "MutationEvents"           : '2.0',
      "QuerySelector"            : false
    };

    exports.applyDocumentFeatures = function(doc, features) {
      var i, maxFeatures = exports.availableDocumentFeatures.length,
          defaultFeatures = exports.defaultDocumentFeatures,
          j,
          k,
          featureName,
          featureSource;

      features = features || {};

      for (i=0; i<maxFeatures; i++) {
        featureName = exports.availableDocumentFeatures[i];
        if (typeof features[featureName] !== 'undefined') {
          featureSource = features[featureName];
        // We have to check the lowercase version also because the Document feature
        // methods convert everything to lowercase.
        } else if (typeof features[featureName.toLowerCase()] !== 'undefined') {
          featureSource = features[featureName.toLowerCase()];
        } else if (defaultFeatures[featureName]) {
          featureSource = defaultFeatures[featureName];
        } else {
          continue;
        }

        doc.implementation.removeFeature(featureName);

        if (typeof featureSource !== 'undefined') {
          if (featureSource instanceof Array) {
            k = featureSource.length;
            for (j=0; j<k; j++) {
              doc.implementation.addFeature(featureName, featureSource[j]);
            }
          } else {
            doc.implementation.addFeature(featureName, featureSource);
          }
        }
      }
    };

    return exports;
});

// Copyright (C) 2011 by Ben Noordhuis <info@bnoordhuis.nl>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
define('punycode',[],function () {
    var exports = {};

    exports.encode = encode;
    exports.decode = decode;

    var TMIN = 1;
    var TMAX = 26;
    var BASE = 36;
    var SKEW = 38;
    var DAMP = 700; // initial bias scaler
    var INITIAL_N = 128;
    var INITIAL_BIAS = 72;
    var MAX_INTEGER = Math.pow(2, 53);

    function adapt_bias(delta, n_points, is_first) {
      // scale back, then increase delta
      delta /= is_first ? DAMP : 2;
      delta += ~~(delta / n_points);

      var s = (BASE - TMIN);
      var t = ~~((s * TMAX) / 2); // threshold=455

      for (var k = 0; delta > t; k += BASE) {
        delta = ~~(delta / s);
      }

      var a = (BASE - TMIN + 1) * delta;
      var b = (delta + SKEW);

      return k + ~~(a / b);
    }

    function next_smallest_codepoint(codepoints, n) {
      var m = 0x110000; // unicode upper bound + 1

      for (var i = 0, len = codepoints.length; i < len; ++i) {
        var c = codepoints[i];
        if (c >= n && c < m) {
          m = c;
        }
      }

      // sanity check - should not happen
      if (m >= 0x110000) {
        throw new Error('Next smallest code point not found.');
      }

      return m;
    }

    function encode_digit(d) {
      return d + (d < 26 ? 97 : 22);
    }

    function decode_digit(d) {
      if (d >= 48 && d <= 57) {
        return d - 22; // 0..9
      }
      if (d >= 65 && d <= 90) {
        return d - 65; // A..Z
      }
      if (d >= 97 && d <= 122) {
        return d - 97; // a..z
      }
      throw new Error('Illegal digit #' + d);
    }

    function threshold(k, bias) {
      if (k <= bias + TMIN) {
        return TMIN;
      }
      if (k >= bias + TMAX) {
        return TMAX;
      }
      return k - bias;
    }

    function encode_int(bias, delta) {
      var result = [];

      for (var k = BASE, q = delta;; k += BASE) {
        var t = threshold(k, bias);
        if (q < t) {
          result.push(encode_digit(q));
          break;
        }
        else {
          result.push(encode_digit(t + ((q - t) % (BASE - t))));
          q = ~~((q - t) / (BASE - t));
        }
      }

      return result;
    }

    function encode(input) {
      if (typeof input != 'string') {
        throw new Error('Argument must be a string.');
      }

      input = input.split('').map(function(c) {
        return c.charCodeAt(0);
      });

      var output = [];
      var non_basic = [];

      for (var i = 0, len = input.length; i < len; ++i) {
        var c = input[i];
        if (c < 128) {
          output.push(c);
        }
        else {
          non_basic.push(c);
        }
      }

      var b, h;
      b = h = output.length;

      if (b) {
        output.push(45); // delimiter '-'
      }

      var n = INITIAL_N;
      var bias = INITIAL_BIAS;
      var delta = 0;

      for (var len = input.length; h < len; ++n, ++delta) {
        var m = next_smallest_codepoint(non_basic, n);
        delta += (m - n) * (h + 1);
        n = m;

        for (var i = 0; i < len; ++i) {
          var c = input[i];
          if (c < n) {
            if (++delta == MAX_INTEGER) {
              throw new Error('Delta overflow.');
            }
          }
          else if (c == n) {
            // TODO append in-place?
            // i.e. -> output.push.apply(output, encode_int(bias, delta));
            output = output.concat(encode_int(bias, delta));
            bias = adapt_bias(delta, h + 1, b == h);
            delta = 0;
            h++;
          }
        }
      }

      return String.fromCharCode.apply(String, output);
    }

    function decode(input) {
      if (typeof input != 'string') {
        throw new Error('Argument must be a string.');
      }

      // find basic code points/delta separator
      var b = 1 + input.lastIndexOf('-');

      input = input.split('').map(function(c) {
        return c.charCodeAt(0);
      });

      // start with a copy of the basic code points
      var output = input.slice(0, b ? (b - 1) : 0);

      var n = INITIAL_N;
      var bias = INITIAL_BIAS;

      for (var i = 0, len = input.length; b < len; ++i) {
        var org_i = i;

        for (var k = BASE, w = 1;; k += BASE) {
          var d = decode_digit(input[b++]);

          // TODO overflow check
          i += d * w;

          var t = threshold(k, bias);
          if (d < t) {
            break;
          }

          // TODO overflow check
          w *= BASE - t;
        }

        var x = 1 + output.length;
        bias = adapt_bias(i - org_i, x, org_i == 0);
        // TODO overflow check
        n += ~~(i / x);
        i %= x;

        output.splice(i, 0, n);
      }

      return String.fromCharCode.apply(String, output);
    }
});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

define('querystring',[],function () {
    var exports = {};
    // Query String Utilities

    var QueryString = exports;
    //var urlDecode = process.binding('http_parser').urlDecode;


    function charCode(c) {
      return c.charCodeAt(0);
    }


    // a safe fast alternative to decodeURIComponent
    QueryString.unescapeBuffer = function(s, decodeSpaces) {
      var out = new Buffer(s.length);
      var state = 'CHAR'; // states: CHAR, HEX0, HEX1
      var n, m, hexchar;

      for (var inIndex = 0, outIndex = 0; inIndex <= s.length; inIndex++) {
        var c = s.charCodeAt(inIndex);
        switch (state) {
          case 'CHAR':
            switch (c) {
              case charCode('%'):
                n = 0;
                m = 0;
                state = 'HEX0';
                break;
              case charCode('+'):
                if (decodeSpaces) c = charCode(' ');
                // pass thru
              default:
                out[outIndex++] = c;
                break;
            }
            break;

          case 'HEX0':
            state = 'HEX1';
            hexchar = c;
            if (charCode('0') <= c && c <= charCode('9')) {
              n = c - charCode('0');
            } else if (charCode('a') <= c && c <= charCode('f')) {
              n = c - charCode('a') + 10;
            } else if (charCode('A') <= c && c <= charCode('F')) {
              n = c - charCode('A') + 10;
            } else {
              out[outIndex++] = charCode('%');
              out[outIndex++] = c;
              state = 'CHAR';
              break;
            }
            break;

          case 'HEX1':
            state = 'CHAR';
            if (charCode('0') <= c && c <= charCode('9')) {
              m = c - charCode('0');
            } else if (charCode('a') <= c && c <= charCode('f')) {
              m = c - charCode('a') + 10;
            } else if (charCode('A') <= c && c <= charCode('F')) {
              m = c - charCode('A') + 10;
            } else {
              out[outIndex++] = charCode('%');
              out[outIndex++] = hexchar;
              out[outIndex++] = c;
              break;
            }
            out[outIndex++] = 16 * n + m;
            break;
        }
      }

      // TODO support returning arbitrary buffers.

      return out.slice(0, outIndex - 1);
    };


    QueryString.unescape = function(s, decodeSpaces) {
      return QueryString.unescapeBuffer(s, decodeSpaces).toString();
    };


    QueryString.escape = function(str) {
      return encodeURIComponent(str);
    };

    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;

        case 'boolean':
          return v ? 'true' : 'false';

        case 'number':
          return isFinite(v) ? v : '';

        default:
          return '';
      }
    };


    QueryString.stringify = QueryString.encode = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      obj = (obj === null) ? undefined : obj;

      switch (typeof obj) {
        case 'object':
          return Object.keys(obj).map(function(k) {
            if (Array.isArray(obj[k])) {
              return obj[k].map(function(v) {
                return QueryString.escape(stringifyPrimitive(k)) +
                       eq +
                       QueryString.escape(stringifyPrimitive(v));
              }).join(sep);
            } else {
              return QueryString.escape(stringifyPrimitive(k)) +
                     eq +
                     QueryString.escape(stringifyPrimitive(obj[k]));
            }
          }).join(sep);

        default:
          if (!name) return '';
          return QueryString.escape(stringifyPrimitive(name)) + eq +
                 QueryString.escape(stringifyPrimitive(obj));
      }
    };

    // Parse a key=val string.
    QueryString.parse = QueryString.decode = function(qs, sep, eq) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};

      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }

      qs.split(sep).forEach(function(kvp) {
        var x = kvp.split(eq);
        var k = QueryString.unescape(x[0], true);
        var v = QueryString.unescape(x.slice(1).join(eq), true);

        if (!obj.hasOwnProperty(k)) {
          obj[k] = v;
        } else if (!Array.isArray(obj[k])) {
          obj[k] = [obj[k], v];
        } else {
          obj[k].push(v);
        }
      });

      return obj;
    };

    return exports;
});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

define('url',[
    './punycode', './querystring'
],
function (punycode, querystring) {
    var exports = {};

    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;

    // Reference: RFC 3986, RFC 1808, RFC 2396

    // define these here so at least they only have to be
    // compiled once on the first module load.
    var protocolPattern = /^([a-z0-9+]+:)/i,
        portPattern = /:[0-9]+$/,
        // RFC 2396: characters reserved for delimiting URLs.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
        // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
        // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''],
        // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#']
          .concat(unwise).concat(autoEscape),
        nonAuthChars = ['/', '@', '?', '#'].concat(delims),
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,
        hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,
        // protocols that can allow "unsafe" and "unwise" chars.
        unsafeProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that never have a hostname.
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that always have a path component.
        pathedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        },
        // protocols that always contain a // bit.
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        };

    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && typeof(url) === 'object' && url.href) return url;

      if (typeof url !== 'string') {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }

      var out = {},
          rest = url;

      // cut off any delimiters.
      // This is to support parse stuff like "<http://foo.com>"
      for (var i = 0, l = rest.length; i < l; i++) {
        if (delims.indexOf(rest.charAt(i)) === -1) break;
      }
      if (i !== 0) rest = rest.substr(i);


      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        out.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }

      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          out.slashes = true;
        }
      }

      if (!hostlessProtocol[proto] &&
          (slashes || (proto && !slashedProtocol[proto]))) {
        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        // don't enforce full RFC correctness, just be unstupid about it.

        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the first @ sign, unless some non-auth character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        var atSign = rest.indexOf('@');
        if (atSign !== -1) {
          // there *may be* an auth
          var hasAuth = true;
          for (var i = 0, l = nonAuthChars.length; i < l; i++) {
            var index = rest.indexOf(nonAuthChars[i]);
            if (index !== -1 && index < atSign) {
              // not a valid auth.  Something like http://foo.com/bar@baz/
              hasAuth = false;
              break;
            }
          }
          if (hasAuth) {
            // pluck off the auth portion.
            out.auth = rest.substr(0, atSign);
            rest = rest.substr(atSign + 1);
          }
        }

        var firstNonHost = -1;
        for (var i = 0, l = nonHostChars.length; i < l; i++) {
          var index = rest.indexOf(nonHostChars[i]);
          if (index !== -1 &&
              (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
        }

        if (firstNonHost !== -1) {
          out.host = rest.substr(0, firstNonHost);
          rest = rest.substr(firstNonHost);
        } else {
          out.host = rest;
          rest = '';
        }

        // pull out port.
        var p = parseHost(out.host);
        if (out.auth) out.host = out.auth + '@' + out.host;
        var keys = Object.keys(p);
        for (var i = 0, l = keys.length; i < l; i++) {
          var key = keys[i];
          out[key] = p[key];
        }

        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        out.hostname = out.hostname || '';

        // validate a little.
        if (out.hostname.length > hostnameMaxLen) {
          out.hostname = '';
        } else {
          var hostparts = out.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = '';
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  // we replace non-ASCII char with a temporary placeholder
                  // we need this to make sure size of hostname is not
                  // broken by replacing non-ASCII by nothing
                  newpart += 'x';
                } else {
                  newpart += part[j];
                }
              }
              // we test again with ASCII char only
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = '/' + notHost.join('.') + rest;
                }
                out.hostname = validParts.join('.');
                break;
              }
            }
          }
        }

        // hostnames are always lower case.
        out.hostname = out.hostname.toLowerCase();

        // IDNA Support: Returns a puny coded representation of "domain".
        // It only converts the part of the domain name that
        // has non ASCII characters. I.e. it dosent matter if
        // you call it with a domain that already is in ASCII.
        var domainArray = out.hostname.split('.');
        var newOut = [];
        for (var i = 0; i < domainArray.length; ++i) {
          var s = domainArray[i];
          newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
              'xn--' + punycode.encode(s) : s);
        }
        out.hostname = newOut.join('.');

        out.host = ((out.auth) ? out.auth + '@' : '') +
            (out.hostname || '') +
            ((out.port) ? ':' + out.port : '');
        out.href += out.host;
      }

      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[lowerProto]) {

        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }

        // Now make sure that delims never appear in a url.
        var chop = rest.length;
        for (var i = 0, l = delims.length; i < l; i++) {
          var c = rest.indexOf(delims[i]);
          if (c !== -1) {
            chop = Math.min(c, chop);
          }
        }
        rest = rest.substr(0, chop);
      }


      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        out.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        out.search = rest.substr(qm);
        out.query = rest.substr(qm + 1);
        if (parseQueryString) {
          out.query = querystring.parse(out.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        out.search = '';
        out.query = {};
      }
      if (rest) out.pathname = rest;
      if (slashedProtocol[proto] &&
          out.hostname && !out.pathname) {
        out.pathname = '/';
      }

      // finally, reconstruct the href based on what has been validated.
      out.href = urlFormat(out);

      return out;
    }

    // format a parsed object into a url string
    function urlFormat(obj) {
      // ensure it's an object, and not a string url.
      // If it's an obj, this is a no-op.
      // this way, you can call url_format() on strings
      // to clean up potentially wonky urls.
      if (typeof(obj) === 'string') obj = urlParse(obj);

      var auth = obj.auth;
      if (auth) {
        auth = auth.split('@').join('%40');
        for (var i = 0, l = nonAuthChars.length; i < l; i++) {
          var nAC = nonAuthChars[i];
          auth = auth.split(nAC).join(encodeURIComponent(nAC));
        }
      }

      var protocol = obj.protocol || '',
          host = (obj.host !== undefined) ? obj.host :
              obj.hostname !== undefined ? (
                  (auth ? auth + '@' : '') +
                  obj.hostname +
                  (obj.port ? ':' + obj.port : '')
              ) :
              false,
          pathname = obj.pathname || '',
          query = obj.query &&
                  ((typeof obj.query === 'object' &&
                    Object.keys(obj.query).length) ?
                     querystring.stringify(obj.query) :
                     '') || '',
          search = obj.search || (query && ('?' + query)) || '',
          hash = obj.hash || '';

      if (protocol && protocol.substr(-1) !== ':') protocol += ':';

      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (obj.slashes ||
          (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }

      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;

      return protocol + host + pathname + search + hash;
    }

    function urlResolve(source, relative) {
      return urlFormat(urlResolveObject(source, relative));
    }

    function urlResolveObject(source, relative) {
      if (!source) return relative;

      source = urlParse(urlFormat(source), false, true);
      relative = urlParse(urlFormat(relative), false, true);

      // hash is always overridden, no matter what.
      source.hash = relative.hash;

      if (relative.href === '') return source;

      // hrefs like //foo/bar always cut to the protocol.
      if (relative.slashes && !relative.protocol) {
        relative.protocol = source.protocol;
        return relative;
      }

      if (relative.protocol && relative.protocol !== source.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.

        if (!slashedProtocol[relative.protocol]) return relative;

        source.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || '').split('/');
          while (relPath.length && !(relative.host = relPath.shift()));
          if (!relative.host) relative.host = '';
          if (relPath[0] !== '') relPath.unshift('');
          if (relPath.length < 2) relPath.unshift('');
          relative.pathname = relPath.join('/');
        }
        source.pathname = relative.pathname;
        source.search = relative.search;
        source.query = relative.query;
        source.host = relative.host || '';
        delete source.auth;
        delete source.hostname;
        source.port = relative.port;
        return source;
      }

      var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
          isRelAbs = (
              relative.host !== undefined ||
              relative.pathname && relative.pathname.charAt(0) === '/'
          ),
          mustEndAbs = (isRelAbs || isSourceAbs ||
                        (source.host && relative.pathname)),
          removeAllDots = mustEndAbs,
          srcPath = source.pathname && source.pathname.split('/') || [],
          relPath = relative.pathname && relative.pathname.split('/') || [],
          psychotic = source.protocol &&
              !slashedProtocol[source.protocol] &&
              source.host !== undefined;

      // if the url is a non-slashed url, then relative
      // links like ../.. should be able
      // to crawl up to the hostname, as well.  This is strange.
      // source.protocol has already been set by now.
      // Later on, put the first path part into the host field.
      if (psychotic) {

        delete source.hostname;
        delete source.auth;
        delete source.port;
        if (source.host) {
          if (srcPath[0] === '') srcPath[0] = source.host;
          else srcPath.unshift(source.host);
        }
        delete source.host;

        if (relative.protocol) {
          delete relative.hostname;
          delete relative.auth;
          delete relative.port;
          if (relative.host) {
            if (relPath[0] === '') relPath[0] = relative.host;
            else relPath.unshift(relative.host);
          }
          delete relative.host;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
      }

      if (isRelAbs) {
        // it's absolute.
        source.host = (relative.host || relative.host === '') ?
                          relative.host : source.host;
        source.search = relative.search;
        source.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
      } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        source.search = relative.search;
        source.query = relative.query;
      } else if ('search' in relative) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
          source.host = srcPath.shift();
        }
        source.search = relative.search;
        source.query = relative.query;
        return source;
      }
      if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        delete source.pathname;
        return source;
      }

      // if a url ENDs in . or .., then it must get a trailing slash.
      // however, if it ends in anything else non-slashy,
      // then it must NOT get a trailing slash.
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (
          (source.host || relative.host) && (last === '.' || last === '..') ||
          last === '');

      // strip single dots, resolve double dots to parent dir
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last == '.') {
          srcPath.splice(i, 1);
        } else if (last === '..') {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift('..');
        }
      }

      if (mustEndAbs && srcPath[0] !== '' &&
          (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
      }

      if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
        srcPath.push('');
      }

      var isAbsolute = srcPath[0] === '' ||
          (srcPath[0] && srcPath[0].charAt(0) === '/');

      // put the host back
      if (psychotic) {
        source.host = isAbsolute ? '' : srcPath.shift();
      }

      mustEndAbs = mustEndAbs || (source.host && srcPath.length);

      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
      }

      source.pathname = srcPath.join('/');


      return source;
    }

    function parseHost(host) {
      var out = {};
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        out.port = port.substr(1);
        host = host.substr(0, host.length - port.length);
      }
      if (host) out.hostname = host;
      return out;
    }

    return exports;
});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
define('path',[],function () {
    var exports = {};
    var isWindows = false; //process.platform === 'win32';


    // resolves . and .. elements in a path array with directory names there
    // must be no slashes, empty elements, or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length-1; i >= 0; i--) {
        var last = parts[i];
        if (last == '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }


    if (isWindows) {
      // Regex to split a windows path into three parts: [*, device, slash,
      // tail] windows-only
      var splitDeviceRe =
          /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?([\\\/])?([\s\S]*?)$/;

      // Regex to split the tail part of the above into [*, dir, basename, ext]
      var splitTailRe = /^([\s\S]+[\\\/](?!$)|[\\\/])?((?:[\s\S]+?)?(\.[^.]*)?)$/;

       // Function to split a filename into [root, dir, basename, ext]
       // windows version
      var splitPath = function(filename) {
        // Separate device+slash from tail
        var result = splitDeviceRe.exec(filename),
            device = (result[1] || '') + (result[2] || ''),
            tail = result[3] || '';
        // Split the tail into dir, basename and extension
        var result2 = splitTailRe.exec(tail),
            dir = result2[1] || '',
            basename = result2[2] || '',
            ext = result2[3] || '';
        return [device, dir, basename, ext];
      }

      // path.resolve([from ...], to)
      // windows version
      exports.resolve = function() {
        var resolvedDevice = '',
            resolvedTail = '',
            resolvedAbsolute = false;

        for (var i = arguments.length-1; i >= -1; i--) {
          // XXX: this isn't called by jsdom, so we should be ok
          var path = (i >= 0) ? arguments[i] : process.cwd();

          // Skip empty and invalid entries
          if (typeof path !== 'string' || !path) {
            continue;
          }

          var result = splitDeviceRe.exec(path),
              device = result[1] || '',
              isUnc = device && device.charAt(1) !== ':',
              isAbsolute = !!result[2] || isUnc, // UNC paths are always absolute
              tail = result[3];

          if (device &&
              resolvedDevice &&
              device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            // This path points to another device so it is not applicable
            continue;
          }

          if (!resolvedDevice) {
            resolvedDevice = device;
          }
          if (!resolvedAbsolute) {
            resolvedTail = tail + '\\' + resolvedTail;
            resolvedAbsolute = isAbsolute;
          }

          if (resolvedDevice && resolvedAbsolute) {
            break;
          }
        }

        if (!resolvedAbsolute && resolvedDevice) {
          // If we still don't have an absolute path,
          // prepend the current path for the device found.

          // TODO
          // Windows stores the current directories for 'other' drives
          // as hidden environment variables like =C:=c:\windows (literally)
          // var deviceCwd = os.getCwdForDrive(resolvedDevice);
          var deviceCwd = '';

          // If there is no cwd set for the drive, it is at root
          resolvedTail = deviceCwd + '\\' + resolvedTail;
          resolvedAbsolute = true;
        }

        // Replace slashes (in UNC share name) by backslashes
        resolvedDevice = resolvedDevice.replace(/\//g, '\\');

        // At this point the path should be resolved to a full absolute path,
        // but handle relative paths to be safe (might happen when process.cwd()
        // fails)

        // Normalize the tail path

        function f(p) {
          return !!p;
        }

        resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/).filter(f),
                                      !resolvedAbsolute).join('\\');

        return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
               '.';
      };

      // windows version
      exports.normalize = function(path) {
        var result = splitDeviceRe.exec(path),
            device = result[1] || '',
            isUnc = device && device.charAt(1) !== ':',
            isAbsolute = !!result[2] || isUnc, // UNC paths are always absolute
            tail = result[3],
            trailingSlash = /[\\\/]$/.test(tail);

        // Normalize the tail path
        tail = normalizeArray(tail.split(/[\\\/]+/).filter(function(p) {
          return !!p;
        }), !isAbsolute).join('\\');

        if (!tail && !isAbsolute) {
          tail = '.';
        }
        if (tail && trailingSlash) {
          tail += '\\';
        }

        return device + (isAbsolute ? '\\' : '') + tail;
      };

      // windows version
      exports.join = function() {
        function f(p) {
          return p && typeof p === 'string';
        }

        var paths = Array.prototype.slice.call(arguments, 0).filter(f);
        var joined = paths.join('\\');

        // Make sure that the joined path doesn't start with two slashes
        // - it will be mistaken for an unc path by normalize() -
        // unless the paths[0] also starts with two slashes
        if (/^[\\\/]{2}/.test(joined) && !/^[\\\/]{2}/.test(paths[0])) {
          joined = joined.slice(1);
        }

        return exports.normalize(joined);
      };

      // path.relative(from, to)
      // it will solve the relative path from 'from' to 'to', for instance:
      // from = 'C:\\orandea\\test\\aaa'
      // to = 'C:\\orandea\\impl\\bbb'
      // The output of the function should be: '..\\..\\impl\\bbb'
      // windows version
      exports.relative = function(from, to) {
        from = exports.resolve(from);
        to = exports.resolve(to);

        // windows is not case sensitive
        var lowerFrom = from.toLowerCase();
        var lowerTo = to.toLowerCase();

        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }

          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }

          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }

        var fromParts = trim(from.split('\\'));
        var toParts = trim(to.split('\\'));

        var lowerFromParts = trim(lowerFrom.split('\\'));
        var lowerToParts = trim(lowerTo.split('\\'));

        var length = Math.min(lowerFromParts.length, lowerToParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (lowerFromParts[i] !== lowerToParts[i]) {
            samePartsLength = i;
            break;
          }
        }

        if (samePartsLength == 0) {
          return to;
        }

        var outputParts = [];
        for (var i = samePartsLength; i < lowerFromParts.length; i++) {
          outputParts.push('..');
        }

        outputParts = outputParts.concat(toParts.slice(samePartsLength));

        return outputParts.join('\\');
      };


    } else /* posix */ {

      // Split a filename into [root, dir, basename, ext], unix version
      // 'root' is just a slash, or nothing.
      var splitPathRe = /^(\/?)([\s\S]+\/(?!$)|\/)?((?:[\s\S]+?)?(\.[^.]*)?)$/;
      var splitPath = function(filename) {
        var result = splitPathRe.exec(filename);
        return [result[1] || '', result[2] || '', result[3] || '', result[4] || ''];
      };

      // path.resolve([from ...], to)
      // posix version
      exports.resolve = function() {
        var resolvedPath = '',
            resolvedAbsolute = false;

        for (var i = arguments.length-1; i >= -1 && !resolvedAbsolute; i--) {
          // XXX: this isn't called by jsdom, so we should be ok
          var path = (i >= 0) ? arguments[i] : process.cwd();

          // Skip empty and invalid entries
          if (typeof path !== 'string' || !path) {
            continue;
          }

          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }

        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)

        // Normalize the path
        resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');

        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      };

      // path.normalize(path)
      // posix version
      exports.normalize = function(path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.slice(-1) === '/';

        // Normalize the path
        path = normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');

        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }

        return (isAbsolute ? '/' : '') + path;
      };


      // posix version
      exports.join = function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return exports.normalize(paths.filter(function(p, index) {
          return p && typeof p === 'string';
        }).join('/'));
      };


      // path.relative(from, to)
      // posix version
      exports.relative = function(from, to) {
        from = exports.resolve(from).substr(1);
        to = exports.resolve(to).substr(1);

        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }

          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }

          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }

        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));

        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }

        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }

        outputParts = outputParts.concat(toParts.slice(samePartsLength));

        return outputParts.join('/');
      };

    }


    exports.dirname = function(path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];

      if (!root && !dir) {
        // No dirname whatsoever
        return '.';
      }

      if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substring(0, dir.length - 1);
      }

      return root + dir;
    };


    exports.basename = function(path, ext) {
      var f = splitPath(path)[2];
      // TODO: make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };


    exports.extname = function(path) {
      return splitPath(path)[3];
    };


    exports.exists = function(path, callback) {
      // XXX: this isn't called by jsdom, so we should be ok
      process.binding('fs').stat(path, function(err, stats) {
        if (callback) callback(err ? false : true);
      });
    };


    exports.existsSync = function(path) {
      try {
        // XXX: this isn't called by jsdom, so we should be ok
        process.binding('fs').stat(path);
        return true;
      } catch (e) {
        return false;
      }
    };

    return exports;
});

define('jsdom/level2/languages/javascript',[],function () {
    var exports = {};

    exports.javascript = function(element, code, filename) {
      var doc = element.ownerDocument, window = doc && doc.parentWindow;
      if (window) {
        try {
          window.run(code, filename);
        } catch (e) {
          element.trigger(
            'error', 'Running ' + filename + ' failed.',
            {error: e, filename: filename}
          );
        }
      }
    };

    return exports;
});

define('jsdom/level2/html',[
    './core', '../browser/documentfeatures', '../../url', '../../path', './languages/javascript',
    '../../util'
],
function (_core, documentfeatures, URL, Path, javascript, util) {
    var exports = {};
    var core                  = _core.dom.level2.core,
        events                = _core.dom.level2.events,
        applyDocumentFeatures = documentfeatures.applyDocumentFeatures;

    // Setup the javascript language processor
    core.languageProcessors = {
      javascript : javascript.javascript
    };

    core.resourceLoader = {
      load: function(element, href, callback) {
        var ownerImplementation = element._ownerDocument.implementation;

        if (ownerImplementation.hasFeature('FetchExternalResources', element.tagName.toLowerCase())) {
          var full = this.resolve(element._ownerDocument, href);
          url = URL.parse(full);
          if (url.hostname) {
            this.download(url, this.baseUrl(element._ownerDocument), this.enqueue(element, callback, full));
          }
          else {
            this.readFile(url.pathname, this.enqueue(element, callback, full));
          }
        }
      },
      enqueue: function(element, callback, filename) {
        var loader = this,
            doc    = element.nodeType === core.Node.DOCUMENT_NODE ?
                     element                :
                     element._ownerDocument;

        if (!doc._queue) {
          return function() {};
        }

        return doc._queue.push(function(err, data) {
          var ev = doc.createEvent('HTMLEvents');

          if (!err) {
            try {
              callback.call(element, data, filename || doc.URL);
              ev.initEvent('load', false, false);
            }
            catch(e) {
              err = e;
            }
          }

          if (err) {
            ev.initEvent('error', false, false);
            ev.error = err;
          }

          element.dispatchEvent(ev);
        });
      },

      baseUrl: function(doc) {
        var baseElements = doc.getElementsByTagName('base'),
            baseUrl      = doc.URL;

        if (baseElements.length > 0) {
          baseUrl = baseElements.item(0).href;
        }

        return baseUrl;
      },
      resolve: function(doc, href) {
        if (href.match(/^\w+:\/\//)) {
          return href;
        }

        var baseUrl = this.baseUrl(doc);

        // See RFC 2396 section 3 for this weirdness. URLs without protocol
        // have their protocol default to the current one.
        // http://www.ietf.org/rfc/rfc2396.txt
        if (href.match(/^\/\//)) {
          return baseUrl ? baseUrl.match(/^(\w+:)\/\//)[1] + href : null;
        } else if (!href.match(/^\/[^\/]/)) {
          href = href.replace(/^\//, "");
        }

        return URL.resolve(baseUrl, href);
      },
      download: function(url, referrer, callback) {
        var path    = url.pathname + (url.search || ''),
            options = {'method': 'GET', 'host': url.hostname, 'path': url.pathname},
            request;
        throw 'download is not supported';
        if (url.protocol === 'https:') {
          options.port = url.port || 443;
          // XXX: https
          request = https.request(options);
        } else {
          options.port = url.port || 80;
          // XXX: http
          request = http.request(options);
        }

        // set header.
        if (referrer) {
            request.setHeader('Referer', referrer);
        }

        request.on('response', function (response) {
          var data = '';
          function success () {
            if ([301, 302, 303, 307].indexOf(response.statusCode) > -1) {
              var redirect = URL.resolve(url, response.headers["location"]);
              core.resourceLoader.download(URL.parse(redirect), referrer, callback);
            } else {
              callback(null, data);
            }
          }
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
            data += chunk.toString();
          });
          response.on('end', function() {
            // According to node docs, 'close' can fire after 'end', but not
            // vice versa.  Remove 'close' listener so we don't call success twice.
            response.removeAllListeners('close');
            success();
          });
          response.on('close', function (err) {
            if (err) {
              callback(err);
            } else {
              success();
            }
          });
        });

        request.on('error', callback);
        request.end();
      },
      readFile: function(url, callback) {
        throw 'readFile is not supported'
        //fs.readFile(url.replace(/^file:\/\//, ""), 'utf8', callback);
      }
    };

    util.updateProperty(core.CharacterData.prototype, '_nodeValue', {
        set: function(value) {
            this._text = value;
        },
        get: function() {
            return this._text || "";
        }
    });

    function _define(elementClass, def) {
      var tagName = def.tagName,
        tagNames = def.tagNames || (tagName? [tagName] : []),
        parentClass = def.parentClass || core.HTMLElement,
        attrs = def.attributes || [],
        proto = def.proto || {};

      var elem = core[elementClass] = function(doc, name) {
        parentClass.call(this, doc, name || tagName.toUpperCase());
        if (elem._init) {
          elem._init.call(this);
        }
      };
      elem._init = def.init;

      util.inherit(elem, parentClass.prototype, proto);

      attrs.forEach(function(n) {
          var prop = n.prop || n,
            attr = n.attr || prop.toLowerCase(),
            descriptor = {};

          if (!n.prop || n.read !== false) {
            descriptor.get = function() {
              var s = this.getAttribute(attr);
              if (n.type && n.type === 'boolean') {
                return !!s;
              }
              if (n.type && n.type === 'long') {
                return +s;
              }
              if (n.normalize) {
                return n.normalize(s);
              }
              return s;
            };
          }

          if (!n.prop || n.write !== false) {
            descriptor.set = function(val) {
              if (!val) {
                this.removeAttribute(attr);
              }
              else {
                var s = val.toString();
                if (n.normalize) {
                  s = n.normalize(s);
                }
                this.setAttribute(attr, s);
              }
            };
          }

          util.updateProperty(elem.prototype, prop, descriptor);
      });

      tagNames.forEach(function(tag) {
        core.Document.prototype._elementBuilders[tag.toLowerCase()] = function(doc, s) {
          var el = new elem(doc, s);
          return el;
        };
      });
    }



    core.HTMLCollection = function HTMLCollection(element, query) {
      core.NodeList.call(this, element, query);
    };
    util.inherit(core.HTMLCollection, core.NodeList.prototype, {
      namedItem : function(name) {
        var results = this.toArray(),
            l       = results.length,
            node,
            matchingName = null;

        for (var i=0; i<l; i++) {
          node = results[i];
          if (node.getAttribute('id') === name) {
            return node;
          } else if (node.getAttribute('name') === name) {
            matchingName = node;
          }
        }
        return matchingName;
      },
      toString: function() {
        return '[ jsdom HTMLCollection ]: contains ' + this.length + ' items';
      }
    });

    core.HTMLOptionsCollection = core.HTMLCollection;

    function closest(e, tagName) {
      tagName = tagName.toUpperCase();
      while (e) {
        if (e.nodeName.toUpperCase() === tagName ||
            (e.tagName && e.tagName.toUpperCase() === tagName))
        {
          return e;
        }
        e = e._parentNode;
      }
      return null;
    }

    function descendants(e, tagName, recursive) {
      var owner = recursive ? e._ownerDocument || e : e;
      return new core.HTMLCollection(owner, core.mapper(e, function(n) {
        return n.nodeName === tagName;
      }, recursive));
    }

    function firstChild(e, tagName) {
      if (!e) {
        return null;
      }
      var c = descendants(e, tagName, false);
      return c.length > 0 ? c[0] : null;
    }

    function ResourceQueue(paused) {
      this.paused = !!paused;
    }
    ResourceQueue.prototype = {
      push: function(callback) {
        var q = this;
        var item = {
          prev: q.tail,
          check: function() {
            if (!q.paused && !this.prev && this.fired){
              callback(this.err, this.data);
              if (this.next) {
                this.next.prev = null;
                this.next.check();
              }else{//q.tail===this
            q.tail = null;
          }
            }
          }
        };
        if (q.tail) {
          q.tail.next = item;
        }
        q.tail = item;
        return function(err, data) {
          item.fired = 1;
          item.err = err;
          item.data = data;
          item.check();
        };
      },
      resume: function() {
        if(!this.paused){
          return;
        }
        this.paused = false;
        var head = this.tail;
        while(head && head.prev){
          head = head.prev;
        }
        if(head){
          head.check();
        }
      }
    };

    core.HTMLDocument = function HTMLDocument(options) {
      options = options || {};
      if (!options.contentType) {
        options.contentType = 'text/html';
      }
      core.Document.call(this, options);
      this._URL = options.url || '/';
      this._documentRoot = options.documentRoot || Path.dirname(this._URL);
      this._queue = new ResourceQueue(options.deferClose);
      this.readyState = 'loading';

      // Add level2 features
      this.implementation.addFeature('core'  , '2.0');
      this.implementation.addFeature('html'  , '2.0');
      this.implementation.addFeature('xhtml' , '2.0');
      this.implementation.addFeature('xml'   , '2.0');
    };

    util.inherit(core.HTMLDocument, core.Document.prototype, {
      get referrer() {
        return "";
      },
      get domain() {
        return "";
      },
      _URL : "",
      get URL() {
        return this._URL;
      },
      get images() {
        return this.getElementsByTagName('IMG');
      },
      get applets() {
        return new core.HTMLCollection(this, core.mapper(this, function(el) {
          if (el && el.tagName) {
            var upper = el.tagName.toUpperCase();
            if (upper === "APPLET") {
              return true;
            } else if (upper === "OBJECT" &&
              el.getElementsByTagName('APPLET').length > 0)
            {
              return true;
            }
          }
        }));
      },
      get links() {
        return new core.HTMLCollection(this, core.mapper(this, function(el) {
          if (el && el.tagName) {
            var upper = el.tagName.toUpperCase();
            if (upper === "AREA" || (upper === "A" && el.href)) {
              return true;
            }
          }
        }));
      },
      get forms() {
        return this.getElementsByTagName('FORM');
      },
      get anchors() {
        return this.getElementsByTagName('A');
      },
      open  : function() {
        this._childNodes = [];
        this._documentElement = null;
        this._modified();
      },
      close : function() {
        this._queue.resume();
        // Set the readyState to 'complete' once all resources are loaded.
        // As a side-effect the document's load-event will be dispatched.
        core.resourceLoader.enqueue(this, function() {
          this.readyState = 'complete';
          var ev = this.createEvent('HTMLEvents');
          ev.initEvent('DOMContentLoaded', false, false);
          this.dispatchEvent(ev);
        })(null, true);
      },

      write : function(text) {
        if (this.readyState === "loading") {
          // During page loading, document.write appends to the current element
          // Find the last child that has been added to the document.
          var node = this;
          while (node.lastChild && node.lastChild.nodeType === this.ELEMENT_NODE) {
            node = node.lastChild;
          }
          node.innerHTML = text;
        } else {
          this.innerHTML = text;
        }
      },

      writeln : function(text) {
        this.write(text + '\n');
      },

      getElementsByName : function(elementName) {
        return new core.HTMLCollection(this, core.mapper(this, function(el) {
          return (el.getAttribute && el.getAttribute("name") === elementName);
        }));
      },

      get title() {
        var head = this.head,
          title = head ? firstChild(head, 'TITLE') : null;
        return title ? title.textContent : '';
      },

      set title(val) {
        var title = firstChild(this.head, 'TITLE');
        if (!title) {
          title = this.createElement('TITLE');
          var head = this.head;
          if (!head) {
            head = this.createElement('HEAD');
            this.documentElement.insertBefore(head, this.documentElement.firstChild);
          }
          head.appendChild(title);
        }
        title.textContent = val;
      },

      get head() {
        return firstChild(this.documentElement, 'HEAD');
      },

      set head(value) { /* noop */ },

      get body() {
        var body = firstChild(this.documentElement, 'BODY');
        if (!body) {
          body = firstChild(this.documentElement, 'FRAMESET');
        }
        return body;
      },

      get documentElement() {
        if (!this._documentElement) {
          this._documentElement = firstChild(this, 'HTML');
        }
        return this._documentElement;
      },

      _cookie : "",
      get cookie() { return this._cookie; },
      set cookie(val) { this._cookie = val; }
    });

    _define('HTMLElement', {
      parentClass: core.Element,
      proto : {
        // Add default event behavior (click link to navigate, click button to submit
        // form, etc). We start by wrapping dispatchEvent so we can forward events to
        // the element's _eventDefault function (only events that did not incur
        // preventDefault).
        dispatchEvent : function (event) {
          var outcome = core.Node.prototype.dispatchEvent.call(this, event)

          if (!event._preventDefault     &&
              event.target._eventDefaults[event.type] &&
              typeof event.target._eventDefaults[event.type] === 'function')
          {
            event.target._eventDefaults[event.type](event)
          }
          return outcome;
        },
        _eventDefaults : {}
      },
      attributes: [
        'id',
        'title',
        'lang',
        'dir',
        {prop: 'className', attr: 'class', normalize: function(s) { return s || ''; }}
      ]
    });

    core.Document.prototype._defaultElementBuilder = function(doc, tagName) {
      return new core.HTMLElement(doc, tagName);
    };

    //http://www.w3.org/TR/html5/forms.html#category-listed
    var listedElements = /button|fieldset|input|keygen|object|select|textarea/i;

    _define('HTMLFormElement', {
      tagName: 'FORM',
      proto: {
        get elements() {
          return new core.HTMLCollection(this._ownerDocument, core.mapper(this, function(e) {
            return listedElements.test(e.nodeName) ; // TODO exclude <input type="image">
          }));
        },
        get length() {
          return this.elements.length;
        },
        _dispatchSubmitEvent: function() {
          var ev = this._ownerDocument.createEvent('HTMLEvents');
          ev.initEvent('submit', true, true);
          if (!this.dispatchEvent(ev)) {
            this.submit();
          };
        },
        submit: function() {
        },
        reset: function() {
          this.elements.toArray().forEach(function(el) {
            el.value = el.defaultValue;
          });
        }
      },
      attributes: [
        'name',
        {prop: 'acceptCharset', attr: 'accept-charset'},
        'action',
        'enctype',
        'method',
        'target'
      ]
    });

    _define('HTMLLinkElement', {
      tagName: 'LINK',
      proto: {
        get href() {
          return core.resourceLoader.resolve(this._ownerDocument, this.getAttribute('href'));
        }
      },
      attributes: [
        {prop: 'disabled', type: 'boolean'},
        'charset',
        'href',
        'hreflang',
        'media',
        'rel',
        'rev',
        'target',
        'type'
      ]
    });

    _define('HTMLMetaElement', {
      tagName: 'META',
      attributes: [
        'content',
        {prop: 'httpEquiv', attr: 'http-equiv'},
        'name',
        'scheme'
      ]
    });

    _define('HTMLHtmlElement', {
      tagName: 'HTML',
      attributes: [
        'version'
      ]
    });

    _define('HTMLHeadElement', {
      tagName: 'HEAD',
      attributes: [
        'profile'
      ]
    });

    _define('HTMLTitleElement', {
      tagName: 'TITLE',
      proto: {
        get text() {
          return this.innerHTML;
        },
        set text(s) {
          this.innerHTML = s;
        }
      }
    });

    _define('HTMLBaseElement', {
      tagName: 'BASE',
      attributes: [
        'href',
        'target'
      ]
    });


    //**Deprecated**
    _define('HTMLIsIndexElement', {
      tagName : 'ISINDEX',
      parentClass : core.Element,
      proto : {
        get form() {
          return closest(this, 'FORM');
        }
      },
      attributes : [
        'prompt'
      ]
    });


    _define('HTMLStyleElement', {
      tagName: 'STYLE',
      attributes: [
        {prop: 'disabled', type: 'boolean'},
        'media',
        'type',
      ]
    });

    _define('HTMLBodyElement', {
      init : function () {
        // The body element's "traditional" event handlers are proxied to the
        // window object.
        // See: http://dev.w3.org/html5/spec/Overview.html#the-body-element
        var self = this;
        ['onafterprint', 'onbeforeprint', 'onbeforeunload', 'onblur', 'onerror',
         'onfocus', 'onhashchange', 'onload', 'onmessage', 'onoffline', 'ononline',
         'onpagehide', 'onpageshow', 'onpopstate', 'onresize', 'onscroll',
         'onstorage', 'onunload'].forEach(function (name) {
             util.updateProperty(self, name, {
                 set: function (handler) {
                     self._ownerDocument.parentWindow[name] = handler;
                 },
                 get: function () {
                     return self._ownerDocument.parentWindow[name];
                 }
             });
        });
      },
      tagName: 'BODY',
      attributes: [
        'aLink',
        'background',
        'bgColor',
        'link',
        'text',
        'vLink'
      ]
    });

    _define('HTMLSelectElement', {
      tagName: 'SELECT',
      proto: {
        get options() {
          return new core.HTMLOptionsCollection(this, core.mapper(this, function(n) {
            return n.nodeName === 'OPTION';
          }));
        },

        get length() {
          return this.options.length;
        },

        get selectedIndex() {
          return this.options.toArray().reduceRight(function(prev, option, i) {
            return option.selected ? i : prev;
          }, -1);
        },

        set selectedIndex(index) {
          this.options.toArray().forEach(function(option, i) {
            option.selected = i === index;
          });
        },

        get value() {
          var i = this.selectedIndex;
          if (this.options.length && (i === -1)) {
            i = 0;
          }
          if (i === -1) {
            return '';
          }
          return this.options[i].value;
        },

        set value(val) {
          var self = this;
          this.options.toArray().forEach(function(option) {
            if (option.value === val) {
              option.selected = true;
            } else {
              if (!self.hasAttribute('multiple')) {
                // Remove the selected bit from all other options in this group
                // if the multiple attr is not present on the select
                option.selected = false;
              }
            }
          });
        },

        get form() {
          return closest(this, 'FORM');
        },

        get type() {
          return this.multiple ? 'select-multiple' : 'select';
        },

        add: function(opt, before) {
          if (before) {
            this.insertBefore(opt, before);
          }
          else {
            this.appendChild(opt);
          }
        },

        remove: function(index) {
          var opts = this.options.toArray();
          if (index >= 0 && index < opts.length) {
            var el = opts[index];
            el._parentNode.removeChild(el);
          }
        },

        blur: function() {
          //TODO
        },

        focus: function() {
          //TODO
        }
      },
      attributes: [
        {prop: 'disabled', type: 'boolean'},
        {prop: 'multiple', type: 'boolean'},
        'name',
        {prop: 'size', type: 'long'},
        {prop: 'tabIndex', type: 'long'},
      ]
    });

    _define('HTMLOptGroupElement', {
      tagName: 'OPTGROUP',
      attributes: [
        {prop: 'disabled', type: 'boolean'},
        'label'
      ]
    });

    _define('HTMLOptionElement', {
      tagName: 'OPTION',
      init: function() {
        this.addEventListener('DOMAttrModified', function(e) {
          if (e.attrName === 'selected')
            this.selected = this.defaultSelected;
        });
      },
      proto: {
        get form() {
          return closest(this, 'FORM');
        },
        get defaultSelected() {
          return !!this.getAttribute('selected');
        },
        set defaultSelected(s) {
          if (s) this.setAttribute('selected', 'selected');
          else this.removeAttribute('selected');
        },
        get text() {
            return (this.hasAttribute('value')) ? this.getAttribute('value') : this.innerHTML;
        },
        get value() {
            return (this.hasAttribute('value')) ? this.getAttribute('value') : this.innerHTML;
        },
        set value(val) {
          this.setAttribute('value', val);
        },
        get index() {
          return closest(this, 'SELECT').options.toArray().indexOf(this);
        },
        get selected() {
          if (this._selected === undefined) {
            this._selected = this.defaultSelected;
          }
          return this._selected;
        },
        set selected(s) {
          // TODO: The 'selected' content attribute is the initial value of the
          // IDL attribute, but the IDL attribute should not relfect the content
          this._selected = !!s;
          if (s) {
            //Remove the selected bit from all other options in this select
            var select = this._parentNode;
            if (!select) return;
            if (select.nodeName !== 'SELECT') {
              select = select._parentNode;
              if (!select) return;
              if (select.nodeName !== 'SELECT') return;
            }
            if (!select.multiple) {
              var o = select.options;
              for (var i = 0; i < o.length; i++) {
                if (o[i] !== this) {
                    o[i].selected = false;
                }
              }
            }
          }
        }
      },
      attributes: [
        {prop: 'disabled', type: 'boolean'},
        'label'
      ]
    });

    _define('HTMLInputElement', {
      tagName: 'INPUT',
      proto: {
        _initDefaultValue: function() {
          if (this._defaultValue === undefined) {
            var attr = this.getAttributeNode('value');
            this._defaultValue = attr ? attr.value : null;
          }
          return this._defaultValue;
        },
        _initDefaultChecked: function() {
          if (this._defaultChecked === undefined) {
            this._defaultChecked = !!this.getAttribute('checked');
          }
          return this._defaultChecked;
        },
        get form() {
          return closest(this, 'FORM');
        },
        get defaultValue() {
          return this._initDefaultValue();
        },
        get defaultChecked() {
          return this._initDefaultChecked();
        },
        get checked() {
          return !!this.getAttribute('checked');
        },
        set checked(checked) {
          this._initDefaultChecked();
          this.setAttribute('checked', checked);
        },
        get value() {
          return this.getAttribute('value');
        },
        set value(val) {
          this._initDefaultValue();
          if (val === null) {
            this.removeAttribute('value');
          }
          else {
            this.setAttribute('value', val);
          }
        },
        blur: function() {
        },
        focus: function() {
        },
        select: function() {
        },
        click: function() {
          if (this.type === 'checkbox' || this.type === 'radio') {
            this.checked = !this.checked;
          }
          else if (this.type === 'submit') {
            var form = this.form;
            if (form) {
              form._dispatchSubmitEvent();
            }
          }
        }
      },
      attributes: [
        'accept',
        'accessKey',
        'align',
        'alt',
        {prop: 'disabled', type: 'boolean'},
        {prop: 'maxLength', type: 'long'},
        'name',
        {prop: 'readOnly', type: 'boolean'},
        {prop: 'size', type: 'long'},
        'src',
        {prop: 'tabIndex', type: 'long'},
        {prop: 'type', normalize: function(val) {
            return val ? val.toLowerCase() : 'text';
        }},
        'useMap'
      ]
    });

    _define('HTMLTextAreaElement', {
      tagName: 'TEXTAREA',
      proto: {
        _initDefaultValue: function() {
          if (this._defaultValue === undefined) {
            this._defaultValue = this.innerHTML;
          }
          return this._defaultValue;
        },
        get form() {
          return closest(this, 'FORM');
        },
        get defaultValue() {
          return this._initDefaultValue();
        },
        get value() {
          return this.innerHTML;
        },
        set value(val) {
          this._initDefaultValue();
          this.innerHTML = val;
        },
        get type() {
          return 'textarea';
        },
        blur: function() {
        },
        focus: function() {
        },
        select: function() {
        }
      },
      attributes: [
        'accessKey',
        {prop: 'cols', type: 'long'},
        {prop: 'disabled', type: 'boolean'},
        {prop: 'maxLength', type: 'long'},
        'name',
        {prop: 'readOnly', type: 'boolean'},
        {prop: 'rows', type: 'long'},
        {prop: 'tabIndex', type: 'long'}
      ]
    });

    _define('HTMLButtonElement', {
      tagName: 'BUTTON',
      proto: {
        get form() {
          return closest(this, 'FORM');
        }
      },
      attributes: [
        'accessKey',
        {prop: 'disabled', type: 'boolean'},
        'name',
        {prop: 'tabIndex', type: 'long'},
        'type',
        'value'
      ]
    });

    _define('HTMLLabelElement', {
      tagName: 'LABEL',
      proto: {
        get form() {
          return closest(this, 'FORM');
        }
      },
      attributes: [
        'accessKey',
        {prop: 'htmlFor', attr: 'for'}
      ]
    });

    _define('HTMLFieldSetElement', {
      tagName: 'FIELDSET',
      proto: {
        get form() {
          return closest(this, 'FORM');
        }
      }
    });

    _define('HTMLLegendElement', {
      tagName: 'LEGEND',
      proto: {
        get form() {
          return closest(this, 'FORM');
        }
      },
      attributes: [
        'accessKey',
        'align'
      ]
    });

    _define('HTMLUListElement', {
      tagName: 'UL',
      attributes: [
        {prop: 'compact', type: 'boolean'},
        'type'
      ]
    });

    _define('HTMLOListElement', {
      tagName: 'OL',
      attributes: [
        {prop: 'compact', type: 'boolean'},
        {prop: 'start', type: 'long'},
        'type'
      ]
    });

    _define('HTMLDListElement', {
      tagName: 'DL',
      attributes: [
        {prop: 'compact', type: 'boolean'}
      ]
    });

    _define('HTMLDirectoryElement', {
      tagName: 'DIR',
      attributes: [
        {prop: 'compact', type: 'boolean'}
      ]
    });

    _define('HTMLMenuElement', {
      tagName: 'MENU',
      attributes: [
        {prop: 'compact', type: 'boolean'}
      ]
    });

    _define('HTMLLIElement', {
      tagName: 'LI',
      attributes: [
        'type',
        {prop: 'value', type: 'long'}
      ]
    });

    _define('HTMLDivElement', {
      tagName: 'DIV',
      attributes: [
        'align'
      ]
    });

    _define('HTMLParagraphElement', {
      tagName: 'P',
      attributes: [
        'align'
      ]
    });

    _define('HTMLHeadingElement', {
      tagNames: ['H1','H2','H3','H4','H5','H6'],
      attributes: [
        'align'
      ]
    });

    _define('HTMLQuoteElement', {
      tagNames: ['Q','BLOCKQUOTE'],
      attributes: [
        'cite'
      ]
    });

    _define('HTMLPreElement', {
      tagName: 'PRE',
      attributes: [
        {prop: 'width', type: 'long'}
      ]
    });

    _define('HTMLBRElement', {
      tagName: 'BR',
      attributes: [
        'clear'
      ]
    });

    _define('HTMLBaseFontElement', {
      tagName: 'BASEFONT',
      attributes: [
        'color',
        'face',
        {prop: 'size', type: 'long'}
      ]
    });

    _define('HTMLFontElement', {
      tagName: 'FONT',
      attributes: [
        'color',
        'face',
        'size'
      ]
    });

    _define('HTMLHRElement', {
      tagName: 'HR',
      attributes: [
        'align',
        {prop: 'noShade', type: 'boolean'},
        'size',
        'width'
      ]
    });

    _define('HTMLModElement', {
      tagNames: ['INS', 'DEL'],
      attributes: [
        'cite',
        'dateTime'
      ]
    });

    _define('HTMLAnchorElement', {
      tagName: 'A',

      proto: {
        blur: function() {
        },
        focus: function() {
        },
        get href() {
          return core.resourceLoader.resolve(this._ownerDocument, this.getAttribute('href'));
        }
      },
      attributes: [
        'accessKey',
        'charset',
        'coords',
        {prop: 'href', type: 'string', read: false},
        'hreflang',
        'name',
        'rel',
        'rev',
        'shape',
        {prop: 'tabIndex', type: 'long'},
        'target',
        'type'
      ]
    });

    _define('HTMLImageElement', {
      tagName: 'IMG',
      attributes: [
        'name',
        'align',
        'alt',
        'border',
        {prop: 'height', type: 'long'},
        {prop: 'hspace', type: 'long'},
        {prop: 'isMap', type: 'boolean'},
        'longDesc',
        'src',
        'useMap',
        {prop: 'vspace', type: 'long'},
        {prop: 'width', type: 'long'}
      ]
    });

    _define('HTMLObjectElement', {
      tagName: 'OBJECT',
      proto: {
        get form() {
          return closest(this, 'FORM');
        },
        get contentDocument() {
          return null;
        }
      },
      attributes: [
        'code',
        'align',
        'archive',
        'border',
        'codeBase',
        'codeType',
        'data',
        {prop: 'declare', type: 'boolean'},
        {prop: 'height',  type: 'long'},
        {prop: 'hspace',  type: 'long'},
        'name',
        'standby',
        {prop: 'tabIndex', type: 'long'},
        'type',
        'useMap',
        {prop: 'vspace', type: 'long'},
        {prop: 'width', type: 'long'}
      ]
    });

    _define('HTMLParamElement', {
      tagName: 'PARAM',
      attributes: [
        'name',
        'type',
        'value',
        'valueType'
      ]
    });

    _define('HTMLAppletElement', {
      tagName: 'APPLET',
      attributes: [
        'align',
        'alt',
        'archive',
        'code',
        'codeBase',
        'height',
        {prop: 'hspace', type: 'long'},
        'name',
        'object',
        {prop: 'vspace', type: 'long'},
        'width'
      ]
    });

    _define('HTMLMapElement', {
      tagName: 'MAP',
      proto: {
        get areas() {
          return this.getElementsByTagName("AREA");
        }
      },
      attributes: [
        'name'
      ]
    });

    _define('HTMLAreaElement', {
      tagName: 'AREA',
      attributes: [
        'accessKey',
        'alt',
        'coords',
        'href',
        {prop: 'noHref', type: 'boolean'},
        'shape',
        {prop: 'tabIndex', type: 'long'},
        'target'
      ]
    });

    _define('HTMLScriptElement', {
      tagName: 'SCRIPT',
      init: function() {
        this.addEventListener('DOMNodeInsertedIntoDocument', function() {
          if (this.src) {
            core.resourceLoader.load(this, this.src, this._eval);
          }
          else {
            var src = this.sourceLocation || {},
                filename = src.file || this._ownerDocument.URL;

            if (src) {
              filename += ':' + src.line + ':' + src.col;
            }
            filename += '<script>';

            core.resourceLoader.enqueue(this, this._eval, filename)(null, this.text);
          }
        });
      },
      proto: {
        _eval: function(text, filename) {
          if (this._ownerDocument.implementation.hasFeature("ProcessExternalResources", "script") &&
              this.language                                                                      &&
              core.languageProcessors[this.language])
          {
            core.languageProcessors[this.language](this, text, filename);
          }
        },
        get language() {
          var type = this.type || "text/javascript";
          return type.split("/").pop().toLowerCase();
        },
        get text() {
          var i=0, children = this.childNodes, l = children.length, ret = [];

          for (i; i<l; i++) {
            ret.push(children.item(i).value);
          }

          return ret.join("");
        },
        set text(text) {
          if (this.childNodes.length > 0) {
            var l = this.childNodes.length, i;
            for (i; i<l; i++) {
              this.removeChild(this.childNodes[i]);
            }
          }
          this.appendChild(this._ownerDocument.createTextNode(text));
        }
      },
      attributes : [
        {prop: 'defer', 'type': 'boolean'},
        'htmlFor',
        'event',
        'charset',
        'type',
        'src'
      ]
    })

    _define('HTMLTableElement', {
      tagName: 'TABLE',
      proto: {
        get caption() {
          return firstChild(this, 'CAPTION');
        },
        get tHead() {
          return firstChild(this, 'THEAD');
        },
        get tFoot() {
          return firstChild(this, 'TFOOT');
        },
        get rows() {
          if (!this._rows) {
            var table = this;
            this._rows = new core.HTMLCollection(this._ownerDocument, function() {
              var sections = [table.tHead].concat(table.tBodies.toArray(), table.tFoot).filter(function(s) { return !!s });

              if (sections.length === 0) {
                return core.mapDOMNodes(table, false, function(el) {
                  return el.tagName === 'TR';
                });
              }

              return sections.reduce(function(prev, s) {
                return prev.concat(s.rows.toArray());
              }, []);

            });
          }
          return this._rows;
        },
        get tBodies() {
          if (!this._tBodies) {
            this._tBodies = descendants(this, 'TBODY', false);
          }
          return this._tBodies;
        },
        createTHead: function() {
          var el = this.tHead;
          if (!el) {
            el = this._ownerDocument.createElement('THEAD');
            this.appendChild(el);
          }
          return el;
        },
        deleteTHead: function() {
          var el = this.tHead;
          if (el) {
            el._parentNode.removeChild(el);
          }
        },
        createTFoot: function() {
          var el = this.tFoot;
          if (!el) {
            el = this._ownerDocument.createElement('TFOOT');
            this.appendChild(el);
          }
          return el;
        },
        deleteTFoot: function() {
          var el = this.tFoot;
          if (el) {
            el._parentNode.removeChild(el);
          }
        },
        createCaption: function() {
          var el = this.caption;
          if (!el) {
            el = this._ownerDocument.createElement('CAPTION');
            this.appendChild(el);
          }
          return el;
        },
        deleteCaption: function() {
          var c = this.caption;
          if (c) {
            c._parentNode.removeChild(c);
          }
        },
        insertRow: function(index) {
          var tr = this._ownerDocument.createElement('TR');
          if (this.childNodes.length === 0) {
            this.appendChild(this._ownerDocument.createElement('TBODY'));
          }
          var rows = this.rows.toArray();
          if (index < -1 || index > rows.length) {
            throw new core.DOMException(core.INDEX_SIZE_ERR);
          }
          if (index === -1 || (index === 0 && rows.length === 0)) {
            this.tBodies.item(0).appendChild(tr);
          }
          else if (index === rows.length) {
            var ref = rows[index-1];
            ref._parentNode.appendChild(tr);
          }
          else {
            var ref = rows[index];
            ref._parentNode.insertBefore(tr, ref);
          }
          return tr;
        },
        deleteRow: function(index) {
          var rows = this.rows.toArray(), l = rows.length;
          if (index === -1) {
            index = l-1;
          }
          if (index < 0 || index >= l) {
            throw new core.DOMException(core.INDEX_SIZE_ERR);
          }
          var tr = rows[index];
          tr._parentNode.removeChild(tr);
        }
      },
      attributes: [
        'align',
        'bgColor',
        'border',
        'cellPadding',
        'cellSpacing',
        'frame',
        'rules',
        'summary',
        'width'
      ]
    });

    _define('HTMLTableCaptionElement', {
      tagName: 'CAPTION',
      attributes: [
        'align'
      ]
    });

    _define('HTMLTableColElement', {
      tagNames: ['COL','COLGROUP'],
      attributes: [
        'align',
        {prop: 'ch', attr: 'char'},
        {prop: 'chOff', attr: 'charoff'},
        {prop: 'span', type: 'long'},
        'vAlign',
        'width',
      ]
    });

    _define('HTMLTableSectionElement', {
      tagNames: ['THEAD','TBODY','TFOOT'],
      proto: {
        get rows() {
          if (!this._rows) {
            this._rows = descendants(this, 'TR', false);
          }
          return this._rows;
        },
        insertRow: function(index) {
          var tr = this._ownerDocument.createElement('TR');
          var rows = this.rows.toArray();
          if (index < -1 || index > rows.length) {
            throw new core.DOMException(core.INDEX_SIZE_ERR);
          }
          if (index === -1 || index === rows.length) {
            this.appendChild(tr);
          }
          else {
            var ref = rows[index];
            this.insertBefore(tr, ref);
          }
          return tr;
        },
        deleteRow: function(index) {
          var rows = this.rows.toArray();
          if (index === -1) {
            index = rows.length-1;
          }
          if (index < 0 || index >= rows.length) {
            throw new core.DOMException(core.INDEX_SIZE_ERR);
          }
          var tr = this.rows[index];
          this.removeChild(tr);
        }
      },
      attributes: [
        'align',
        {prop: 'ch', attr: 'char'},
        {prop: 'chOff', attr: 'charoff'},
        {prop: 'span', type: 'long'},
        'vAlign',
        'width',
      ]
    });

    _define('HTMLTableRowElement', {
      tagName: 'TR',
      proto: {
        get cells() {
          if (!this._cells) {
            this._cells = new core.HTMLCollection(this, core.mapper(this, function(n) {
              return n.nodeName === 'TD' || n.nodeName === 'TH';
            }, false));
          }
          return this._cells;
        },
        get rowIndex() {
          return closest(this, 'TABLE').rows.toArray().indexOf(this);
        },

        get sectionRowIndex() {
          return this._parentNode.rows.toArray().indexOf(this);
        },
        insertCell: function(index) {
          var td = this._ownerDocument.createElement('TD');
          var cells = this.cells.toArray();
          if (index < -1 || index > cells.length) {
            throw new core.DOMException(core.INDEX_SIZE_ERR);
          }
          if (index === -1 || index === cells.length) {
            this.appendChild(td);
          }
          else {
            var ref = cells[index];
            this.insertBefore(td, ref);
          }
          return td;
        },
        deleteCell: function(index) {
          var cells = this.cells.toArray();
          if (index === -1) {
            index = cells.length-1;
          }
          if (index < 0 || index >= cells.length) {
            throw new core.DOMException(core.INDEX_SIZE_ERR);
          }
          var td = this.cells[index];
          this.removeChild(td);
        }
      },
      attributes: [
        'align',
        'bgColor',
        {prop: 'ch', attr: 'char'},
        {prop: 'chOff', attr: 'charoff'},
        'vAlign'
      ]
    });

    _define('HTMLTableCellElement', {
      tagNames: ['TH','TD'],
      proto: {
        _headers: null,
        set headers(h) {
          if (h === '') {
            //Handle resetting headers so the dynamic getter returns a query
            this._headers = null;
            return;
          }
          if (!(h instanceof Array)) {
            h = [h];
          }
          this._headers = h;
        },
        get headers() {
          if (this._headers) {
            return this._headers.join(' ');
          }
          var cellIndex = this.cellIndex,
              headings  = [],
              siblings  = this._parentNode.getElementsByTagName(this.tagName);

          for (var i=0; i<siblings.length; i++) {
            if (siblings.item(i).cellIndex >= cellIndex) {
              break;
            }
            headings.push(siblings.item(i).id);
          }
          this._headers = headings;
          return headings.join(' ');
        },
        get cellIndex() {
          return closest(this, 'TR').cells.toArray().indexOf(this);
        }
      },
      attributes: [
        'abbr',
        'align',
        'axis',
        'bgColor',
        {prop: 'ch', attr: 'char'},
        {prop: 'chOff', attr: 'charoff'},
        {prop: 'colSpan', type: 'long'},
        'height',
        {prop: 'noWrap', type: 'boolean'},
        {prop: 'rowSpan', type: 'long'},
        'scope',
        'vAlign',
        'width'
      ]
    });

    _define('HTMLFrameSetElement', {
      tagName: 'FRAMESET',
      attributes: [
        'cols',
        'rows'
      ]
    });

    function loadFrame (frame) {
      if (frame._contentDocument) {
        // We don't want to access document.parentWindow, since the getter will
        // cause a new window to be allocated if it doesn't exist.  Probe the
        // private variable instead.
        if (frame._contentDocument._parentWindow) {
          // close calls delete on its document.
          frame._contentDocument.parentWindow.close();
        } else {
          delete frame._contentDocument;
        }
      }

      var src = frame.src;
      var parentDoc = frame._ownerDocument;
      var url = core.resourceLoader.resolve(parentDoc, src);
      var contentDoc = frame._contentDocument = new core.HTMLDocument({
        url: url,
        documentRoot: Path.dirname(url)
      });
      applyDocumentFeatures(contentDoc, parentDoc.implementation._features);

      var parent = parentDoc.parentWindow;
      var contentWindow = contentDoc.parentWindow;
      contentWindow.parent = parent;
      contentWindow.top = parent.top;

      core.resourceLoader.load(frame, url, function(html, filename) {
        contentDoc.write(html);
        contentDoc.close();
      });
    }

    _define('HTMLFrameElement', {
      tagName: 'FRAME',
      init : function () {
        // Set up the frames array.  window.frames really just returns a reference
        // to the window object, so the frames array is just implemented as indexes
        // on the window.
        var parent = this._ownerDocument.parentWindow;
        var frameID = parent._length++;
        var self = this;

        util.updateProperty(parent, frameID, {
            get: function () {
                return self.contentWindow;
            }
        });

        // The contentDocument/contentWindow shouldn't be created until the frame
        // is inserted:
        // "When an iframe element is first inserted into a document, the user
        //  agent must create a nested browsing context, and then process the
        //  iframe attributes for the first time."
        //  (http://dev.w3.org/html5/spec/Overview.html#the-iframe-element)
        this._initInsertListener = this.addEventListener('DOMNodeInsertedIntoDocument', function () {
          // Calling contentWindow getter will create the frame's Document and
          // DOMWindow.
          var win = self.contentWindow;
          win.parent = parent;
          win.top = parent.top;
        }, false);
      },
      proto: {
        setAttribute: function(name, value) {
          core.HTMLElement.prototype.setAttribute.call(this, name, value);
          var self = this;
          if (name === 'name') {
            // Set up named frame access.
              util.updateProperty(this._ownerDocument.parentWindow, value, {
                  get: function () {
                      return self.contentWindow;
                  }
              });
          } else if (name === 'src') {
            // Page we don't fetch the page until the node is inserted. This at
            // least seems to be the way Chrome does it.
            if (!this._attachedToDocument) {
              if (!this._waitingOnInsert) {
                // First, remove the listener added in 'init'.
                this.removeEventListener('DOMNodeInsertedIntoDocument',
                                         this._initInsertListener, false)

                // If we aren't already waiting on an insert, add a listener.
                // This guards against src being set multiple times before the frame
                // is inserted into the document - we don't want to register multiple
                // callbacks.
                this.addEventListener('DOMNodeInsertedIntoDocument', function loader () {
                  self.removeEventListener('DOMNodeInsertedIntoDocument', loader, false);
                  this._waitingOnInsert = false;
                  loadFrame(self);
                }, false);
                this._waitingOnInsert = true;
              }
            } else {
              loadFrame(self);
            }
          }
        },
        _contentDocument : null,
        get contentDocument() {
          if (this._contentDocument == null) {
            this._contentDocument = new core.HTMLDocument();
          }
          return this._contentDocument;
        },
        get contentWindow() {
          return this.contentDocument.parentWindow;
        }
      },
      attributes: [
        'frameBorder',
        'longDesc',
        'marginHeight',
        'marginWidth',
        'name',
        {prop: 'noResize', type: 'boolean'},
        'scrolling',
        {prop: 'src', type: 'string', write: false}
      ]
    });

    _define('HTMLIFrameElement', {
      tagName: 'IFRAME',
      parentClass: core.HTMLFrameElement,
      attributes: [
        'align',
        'frameBorder',
        'height',
        'longDesc',
        'marginHeight',
        'marginWidth',
        'name',
        'scrolling',
        'src',
        'width'
      ]
    });

    exports.define = _define;
    exports.dom = {
      level2 : {
        html : core
      }
    }

    return exports;
});

define('jsdom/level3/html',[
    './core', '../level2/html'
],
function (_core, _html) {
    var core = _core.dom.level3.core,
        html = _html.dom.level2.html,
        exports = {};

    exports.dom = {
      level3 : {
        html : html,
        core : core
      }
    };

    return exports;
});

define('jsdom/level3/ls',[
    './core', './events', '../../util'
],
function (_core, _events, util) {
    // w3c Load/Save functionality: http://www.w3.org/TR/2004/REC-DOM-Level-3-LS-20040407/

    var core = _core.dom.level3.core;
    var events = _events.dom.level3.events;;
    var exports = {};
    var ls = {};

    // TODO: what is this?
    //typedef dom::DOMConfiguration DOMConfiguration;

    ls.LSException = function LSException(code) {
      this.code = code;
    };

    ls.LSException.prototype = {
      // LSExceptionCode
      PARSE_ERR                       : 81,
      SERIALIZE_ERR                   : 82
    };

    ls.DOMImplementationLS = function DOMImplementationLS() {

    };

    var DOMImplementationExtension = {

      // DOMImplementationLSMode
      MODE_SYNCHRONOUS  : 1,
      MODE_ASYNCHRONOUS : 2,

      // raises(dom::DOMException);
      createLSParser : function(/* int */ mode, /* string */ schemaType) {
        return new ls.LSParser(mode, schemaType);
      },

      createLSSerializer : function() {
        return new ls.LSSerializer();
      },

      createLSInput : function() {
        return new ls.LSInput();
      },

      createLSOutput : function() {
        return new ls.LSOutput();
      }
    };

    Object.keys(DOMImplementationExtension).forEach(function(k, v) {
      core.DOMImplementation.prototype[k] = DOMImplementationExtension[k];
    });

    ls.DOMImplementationLS.prototype = DOMImplementationExtension; 

    core.Document.getFeature = function() {
      return DOMImplementationExtension;
    };

    ls.LSParser = function LSParser() {
      this._domConfig = new core.DOMConfiguration();
    };
    ls.LSParser.prototype = {
      get domConfig() { return this._domConfig; },
      get filter() { return this._filter || null; },
      set filter(value) { this._filter = value; },
      get async() { return this._async; },
      get busy() { return this._busy; },

      // raises(dom::DOMException, LSException);
      parse : function (/* LSInput */ input) {
        var doc = new core.Document();
        doc._inputEncoding = 'UTF-16';
        return doc;
      },

      // raises(dom::DOMException, LSException);
      parseURI : function(/* string */ uri) {
        return new core.Document();
      },

      // ACTION_TYPES
      ACTION_APPEND_AS_CHILDREN       : 1,
      ACTION_REPLACE_CHILDREN         : 2,
      ACTION_INSERT_BEFORE            : 3,
      ACTION_INSERT_AFTER             : 4,
      ACTION_REPLACE                  : 5,

      // @returns Node
      // @raises DOMException, LSException
      parseWithContext                : function(/* LSInput */ input, /* Node */ contextArg, /* int */ action) {
        return new core.Node();
      },

      abort                           : function() {
        // TODO: implement
      }
    };

    ls.LSInput = function LSInput() {};
    ls.LSInput.prototype = {
      get characterStream() { return this._characterStream || null; },
      set characterStream(value) { this._characterStream = value; },
      get byteStream() { return this._byteStream || null; },
      set byteStream(value) { this._byteStream = value; },
      get stringData() { return this._stringData || null; },
      set stringData(value) { this._stringData = value; },
      get systemId() { return this._systemId || null; },
      set systemId(value) { this._systemId = value; },
      get publicId() { return this._publicId || null; },
      set publicId(value) { this._publicId = value; },
      get baseURI() { return this._baseURI || null; },
      set baseURI(value) { this._baseURI = value; },
      get encoding() { return this._encoding || null; },
      set encoding(value) { this._encoding = value; },
      get certifiedText() { return this._certifiedText || null; },
      set certifiedText(value) { this._certifiedText = value; },
    };

    ls.LSResourceResolver = function LSResourceResolver() {};

    // @returns LSInput
    ls.LSResourceResolver.prototype.resolveResource = function(type, namespaceURI, publicId, systemId, baseURI) {
      return new ls.LSInput();
    };

    ls.LSParserFilter = function LSParserFilter() {};
    ls.LSParserFilter.prototype = {

      // Constants returned by startElement and acceptNode
      FILTER_ACCEPT                   : 1,
      FILTER_REJECT                   : 2,
      FILTER_SKIP                     : 3,
      FILTER_INTERRUPT                : 4,

      get whatToShow() { return this._whatToShow; },

      // @returns int
      startElement : function(/* Element */ elementArg) {
        return 0;
      },

      // @returns int
      acceptNode : function(/* Node */ nodeArg) {
        return nodeArg;
      }
    };

    ls.LSSerializer = function LSSerializer() {
      this._domConfig = new core.DOMConfiguration();
    };
    ls.LSSerializer.prototype = {
      get domConfig() { return this._domConfig; },
      get newLine() { return this._newLine || null; },
      set newLine(value) { this._newLine = value; },
      get filter() { return this._filter || null; },
      set filter(value) { this._filter = value; },

      // @returns boolean
      // @raises LSException
      write : function(/* Node */ nodeArg, /* LSOutput */ destination) {
       return true;
      },

      // @returns boolean
      // @raises LSException
      writeToURI : function(/* Node */ nodeArg, /* string */ uri) {
       return true;
      },

      // @returns string
      // @raises DOMException, LSException
      writeToString : function(/* Node */ nodeArg) {
        return "";
      }
    };

    ls.LSOutput = function LSOutput() {};
    ls.LSOutput.prototype = {
      get characterStream() { return this._characterStream || null; },
      set characterStream(value) { this._characterStream = value; },
      get byteStream() { return this._byteStream || null; },
      set byteStream(value) { this._byteStream = value; },
      get systemId() { return this._systemId || null; },
      set systemId(value) { this._systemId = value; },
      get encoding() { return this._encoding || null; },
      set encoding(value) { this._encoding = value; },
    };

    ls.LSProgressEvent = function LSProgressEvent() {};
    util.inherit(ls.LSProgressEvent.prototype, events.Event, {
      get input() { return this._input; },
      get position() { return this._position; },
      get totalSize() { return this._totalSize; },
    });

    ls.LSLoadEvent = function LSLoadEvent() {};
    util.inherit(ls.LSLoadEvent.prototype, events.Event, {
      get newDocument() { return this._newDocument; },
      get input() { return this._input; },
    });

    // TODO: do traversal
    ls.LSSerializerFilter = function LSSerializerFilter() {};
    ls.LSSerializerFilter.prototype = {
      get whatToShow() { return this._whatToShow; },
    };

    // ls.LSSerializerFilter.prototype.__proto__ = level2.traversal.NodeFiler;

    // Export
    exports.dom = {
      level3 : {
        ls : ls 
      }
    };

    return exports;
});

define('jsdom/level3/index',[
    './core', './xpath', './events', './html', './ls'
],
function (_core, _xpath, _events, _html, _ls) {
    var exports = {};

    exports.dom = {
      level3 : {
        core   : _core.dom.level3.core,
        xpath  : _xpath.xpath,
        events : _events.dom.level3.events,
        html   : _html.dom.level3.html,
      }
    };

    exports.dom.ls = _ls.dom.level3.ls;

    return exports;
});

define('jsdom/selectors/sizzle',[],function () {
    var exports = {};
    /*!
     * Sizzle CSS Selector Engine - v1.0
     *  Copyright 2009, The Dojo Foundation
     *  Released under the MIT, BSD, and GPL Licenses.
     *  More information: http://sizzlejs.com/
     */
    (function(){

    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        done = 0,
        toString = Object.prototype.toString,
        hasDuplicate = false,
        baseHasDuplicate = true;

    // Here we check if the JavaScript engine is using some sort of
    // optimization where it does not always call our comparision
    // function. If that is the case, discard the hasDuplicate value.
    //   Thus far that includes Google Chrome.
    [0, 0].sort(function() {
        baseHasDuplicate = false;
        return 0;
    });

    var Sizzle = function( selector, context, results, seed ) {
        results = results || [];
        context = context || document;

        var origContext = context;

        if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
            return [];
        }

        if ( !selector || typeof selector !== "string" ) {
            return results;
        }

        var m, set, checkSet, extra, ret, cur, pop, i,
            prune = true,
            contextXML = Sizzle.isXML( context ),
            parts = [],
            soFar = selector;

        // Reset the position of the chunker regexp (start from head)
        do {
            chunker.exec( "" );
            m = chunker.exec( soFar );

            if ( m ) {
                soFar = m[3];

                parts.push( m[1] );

                if ( m[2] ) {
                    extra = m[3];
                    break;
                }
            }
        } while ( m );

        if ( parts.length > 1 && origPOS.exec( selector ) ) {

            if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
                set = posProcess( parts[0] + parts[1], context );

            } else {
                set = Expr.relative[ parts[0] ] ?
                    [ context ] :
                    Sizzle( parts.shift(), context );

                while ( parts.length ) {
                    selector = parts.shift();

                    if ( Expr.relative[ selector ] ) {
                        selector += parts.shift();
                    }

                    set = posProcess( selector, set );
                }
            }

        } else {
            // Take a shortcut and set the context if the root selector is an ID
            // (but not if it'll be faster if the inner selector is an ID)
            if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                    Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

                ret = Sizzle.find( parts.shift(), context, contextXML );
                context = ret.expr ?
                    Sizzle.filter( ret.expr, ret.set )[0] :
                    ret.set[0];
            }

            if ( context ) {
                ret = seed ?
                    { expr: parts.pop(), set: makeArray(seed) } :
                    Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

                set = ret.expr ?
                    Sizzle.filter( ret.expr, ret.set ) :
                    ret.set;

                if ( parts.length > 0 ) {
                    checkSet = makeArray( set );

                } else {
                    prune = false;
                }

                while ( parts.length ) {
                    cur = parts.pop();
                    pop = cur;

                    if ( !Expr.relative[ cur ] ) {
                        cur = "";
                    } else {
                        pop = parts.pop();
                    }

                    if ( pop == null ) {
                        pop = context;
                    }

                    Expr.relative[ cur ]( checkSet, pop, contextXML );
                }

            } else {
                checkSet = parts = [];
            }
        }

        if ( !checkSet ) {
            checkSet = set;
        }

        if ( !checkSet ) {
            Sizzle.error( cur || selector );
        }

        if ( toString.call(checkSet) === "[object Array]" ) {
            if ( !prune ) {
                results.push.apply( results, checkSet );

            } else if ( context && context.nodeType === 1 ) {
                for ( i = 0; checkSet[i] != null; i++ ) {
                    if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                        results.push( set[i] );
                    }
                }

            } else {
                for ( i = 0; checkSet[i] != null; i++ ) {
                    if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                        results.push( set[i] );
                    }
                }
            }

        } else {
            makeArray( checkSet, results );
        }

        if ( extra ) {
            Sizzle( extra, origContext, results, seed );
            Sizzle.uniqueSort( results );
        }

        return results;
    };

    Sizzle.uniqueSort = function( results ) {
        if ( sortOrder ) {
            hasDuplicate = baseHasDuplicate;
            results.sort( sortOrder );

            if ( hasDuplicate ) {
                for ( var i = 1; i < results.length; i++ ) {
                    if ( results[i] === results[ i - 1 ] ) {
                        results.splice( i--, 1 );
                    }
                }
            }
        }

        return results;
    };

    Sizzle.matches = function( expr, set ) {
        return Sizzle( expr, null, null, set );
    };

    Sizzle.matchesSelector = function( node, expr ) {
        return Sizzle( expr, null, null, [node] ).length > 0;
    };

    Sizzle.find = function( expr, context, isXML ) {
        var set;

        if ( !expr ) {
            return [];
        }

        for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
            var match,
                type = Expr.order[i];

            if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
                var left = match[1];
                match.splice( 1, 1 );

                if ( left.substr( left.length - 1 ) !== "\\" ) {
                    match[1] = (match[1] || "").replace(/\\/g, "");
                    set = Expr.find[ type ]( match, context, isXML );

                    if ( set != null ) {
                        expr = expr.replace( Expr.match[ type ], "" );
                        break;
                    }
                }
            }
        }

        if ( !set ) {
            set = context.getElementsByTagName( "*" );
        }

        return { set: set, expr: expr };
    };

    Sizzle.filter = function( expr, set, inplace, not ) {
        var match, anyFound,
            old = expr,
            result = [],
            curLoop = set,
            isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

        while ( expr && set.length ) {
            for ( var type in Expr.filter ) {
                if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                    var found, item,
                        filter = Expr.filter[ type ],
                        left = match[1];

                    anyFound = false;

                    match.splice(1,1);

                    if ( left.substr( left.length - 1 ) === "\\" ) {
                        continue;
                    }

                    if ( curLoop === result ) {
                        result = [];
                    }

                    if ( Expr.preFilter[ type ] ) {
                        match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                        if ( !match ) {
                            anyFound = found = true;

                        } else if ( match === true ) {
                            continue;
                        }
                    }

                    if ( match ) {
                        for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
                            if ( item ) {
                                found = filter( item, match, i, curLoop );
                                var pass = not ^ !!found;

                                if ( inplace && found != null ) {
                                    if ( pass ) {
                                        anyFound = true;

                                    } else {
                                        curLoop[i] = false;
                                    }

                                } else if ( pass ) {
                                    result.push( item );
                                    anyFound = true;
                                }
                            }
                        }
                    }

                    if ( found !== undefined ) {
                        if ( !inplace ) {
                            curLoop = result;
                        }

                        expr = expr.replace( Expr.match[ type ], "" );

                        if ( !anyFound ) {
                            return [];
                        }

                        break;
                    }
                }
            }

            // Improper expression
            if ( expr === old ) {
                if ( anyFound == null ) {
                    Sizzle.error( expr );

                } else {
                    break;
                }
            }

            old = expr;
        }

        return curLoop;
    };

    Sizzle.error = function( msg ) {
        throw "Syntax error, unrecognized expression: " + msg;
    };

    var Expr = Sizzle.selectors = {
        order: [ "ID", "NAME", "TAG" ],

        match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
        },

        leftMatch: {},

        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },

        attrHandle: {
            href: function( elem ) {
                return elem.getAttribute( "href" );
            }
        },

        relative: {
            "+": function(checkSet, part){
                var isPartStr = typeof part === "string",
                    isTag = isPartStr && !/\W/.test( part ),
                    isPartStrNotTag = isPartStr && !isTag;

                if ( isTag ) {
                    part = part.toLowerCase();
                }

                for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                    if ( (elem = checkSet[i]) ) {
                        while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                            elem || false :
                            elem === part;
                    }
                }

                if ( isPartStrNotTag ) {
                    Sizzle.filter( part, checkSet, true );
                }
            },

            ">": function( checkSet, part ) {
                var elem,
                    isPartStr = typeof part === "string",
                    i = 0,
                    l = checkSet.length;

                if ( isPartStr && !/\W/.test( part ) ) {
                    part = part.toLowerCase();

                    for ( ; i < l; i++ ) {
                        elem = checkSet[i];

                        if ( elem ) {
                            var parent = elem.parentNode;
                            checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                        }
                    }

                } else {
                    for ( ; i < l; i++ ) {
                        elem = checkSet[i];

                        if ( elem ) {
                            checkSet[i] = isPartStr ?
                                elem.parentNode :
                                elem.parentNode === part;
                        }
                    }

                    if ( isPartStr ) {
                        Sizzle.filter( part, checkSet, true );
                    }
                }
            },

            "": function(checkSet, part, isXML){
                var nodeCheck,
                    doneName = done++,
                    checkFn = dirCheck;

                if ( typeof part === "string" && !/\W/.test(part) ) {
                    part = part.toLowerCase();
                    nodeCheck = part;
                    checkFn = dirNodeCheck;
                }

                checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
            },

            "~": function( checkSet, part, isXML ) {
                var nodeCheck,
                    doneName = done++,
                    checkFn = dirCheck;

                if ( typeof part === "string" && !/\W/.test( part ) ) {
                    part = part.toLowerCase();
                    nodeCheck = part;
                    checkFn = dirNodeCheck;
                }

                checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
            }
        },

        find: {
            ID: function( match, context, isXML ) {
                if ( typeof context.getElementById !== "undefined" && !isXML ) {
                    var m = context.getElementById(match[1]);
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    return m && m.parentNode ? [m] : [];
                }
            },

            NAME: function( match, context ) {
                if ( typeof context.getElementsByName !== "undefined" ) {
                    var ret = [],
                        results = context.getElementsByName( match[1] );

                    for ( var i = 0, l = results.length; i < l; i++ ) {
                        if ( results[i].getAttribute("name") === match[1] ) {
                            ret.push( results[i] );
                        }
                    }

                    return ret.length === 0 ? null : ret;
                }
            },

            TAG: function( match, context ) {
                return context.getElementsByTagName( match[1] );
            }
        },
        preFilter: {
            CLASS: function( match, curLoop, inplace, result, not, isXML ) {
                match = " " + match[1].replace(/\\/g, "") + " ";

                if ( isXML ) {
                    return match;
                }

                for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                    if ( elem ) {
                        if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                            if ( !inplace ) {
                                result.push( elem );
                            }

                        } else if ( inplace ) {
                            curLoop[i] = false;
                        }
                    }
                }

                return false;
            },

            ID: function( match ) {
                return match[1].replace(/\\/g, "");
            },

            TAG: function( match, curLoop ) {
                return match[1].toLowerCase();
            },

            CHILD: function( match ) {
                if ( match[1] === "nth" ) {
                    if ( !match[2] ) {
                        Sizzle.error( match[0] );
                    }

                    match[2] = match[2].replace(/^\+|\s*/g, '');

                    // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                    var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                        match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                        !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                    // calculate the numbers (first)n+(last) including if they are negative
                    match[2] = (test[1] + (test[2] || 1)) - 0;
                    match[3] = test[3] - 0;
                }
                else if ( match[2] ) {
                    Sizzle.error( match[0] );
                }

                // TODO: Move to normal caching system
                match[0] = done++;

                return match;
            },

            ATTR: function( match, curLoop, inplace, result, not, isXML ) {
                var name = match[1].replace(/\\/g, "");

                if ( !isXML && Expr.attrMap[name] ) {
                    match[1] = Expr.attrMap[name];
                }

                if ( match[2] === "~=" ) {
                    match[4] = " " + match[4] + " ";
                }

                return match;
            },

            PSEUDO: function( match, curLoop, inplace, result, not ) {
                if ( match[1] === "not" ) {
                    // If we're dealing with a complex expression, or a simple one
                    if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                        match[3] = Sizzle(match[3], null, null, curLoop);

                    } else {
                        var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                        if ( !inplace ) {
                            result.push.apply( result, ret );
                        }

                        return false;
                    }

                } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                    return true;
                }

                return match;
            },

            POS: function( match ) {
                match.unshift( true );

                return match;
            }
        },

        filters: {
            enabled: function( elem ) {
                return elem.disabled === false && elem.type !== "hidden";
            },

            disabled: function( elem ) {
                return elem.disabled === true;
            },

            checked: function( elem ) {
                return elem.checked === true;
            },

            selected: function( elem ) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                elem.parentNode.selectedIndex;

                return elem.selected === true;
            },

            parent: function( elem ) {
                return !!elem.firstChild;
            },

            empty: function( elem ) {
                return !elem.firstChild;
            },

            has: function( elem, i, match ) {
                return !!Sizzle( match[3], elem ).length;
            },

            header: function( elem ) {
                return (/h\d/i).test( elem.nodeName );
            },

            text: function( elem ) {
                return "text" === elem.type;
            },
            radio: function( elem ) {
                return "radio" === elem.type;
            },

            checkbox: function( elem ) {
                return "checkbox" === elem.type;
            },

            file: function( elem ) {
                return "file" === elem.type;
            },
            password: function( elem ) {
                return "password" === elem.type;
            },

            submit: function( elem ) {
                return "submit" === elem.type;
            },

            image: function( elem ) {
                return "image" === elem.type;
            },

            reset: function( elem ) {
                return "reset" === elem.type;
            },

            button: function( elem ) {
                return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
            },

            input: function( elem ) {
                return (/input|select|textarea|button/i).test( elem.nodeName );
            }
        },
        setFilters: {
            first: function( elem, i ) {
                return i === 0;
            },

            last: function( elem, i, match, array ) {
                return i === array.length - 1;
            },

            even: function( elem, i ) {
                return i % 2 === 0;
            },

            odd: function( elem, i ) {
                return i % 2 === 1;
            },

            lt: function( elem, i, match ) {
                return i < match[3] - 0;
            },

            gt: function( elem, i, match ) {
                return i > match[3] - 0;
            },

            nth: function( elem, i, match ) {
                return match[3] - 0 === i;
            },

            eq: function( elem, i, match ) {
                return match[3] - 0 === i;
            }
        },
        filter: {
            PSEUDO: function( elem, match, i, array ) {
                var name = match[1],
                    filter = Expr.filters[ name ];

                if ( filter ) {
                    return filter( elem, i, match, array );

                } else if ( name === "contains" ) {
                    return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

                } else if ( name === "not" ) {
                    var not = match[3];

                    for ( var j = 0, l = not.length; j < l; j++ ) {
                        if ( not[j] === elem ) {
                            return false;
                        }
                    }

                    return true;

                } else {
                    Sizzle.error( name );
                }
            },

            CHILD: function( elem, match ) {
                var type = match[1],
                    node = elem;

                switch ( type ) {
                    case "only":
                    case "first":
                        while ( (node = node.previousSibling) )	 {
                            if ( node.nodeType === 1 ) {
                                return false;
                            }
                        }

                        if ( type === "first" ) {
                            return true;
                        }

                        node = elem;

                    case "last":
                        while ( (node = node.nextSibling) )	 {
                            if ( node.nodeType === 1 ) {
                                return false;
                            }
                        }

                        return true;

                    case "nth":
                        var first = match[2],
                            last = match[3];

                        if ( first === 1 && last === 0 ) {
                            return true;
                        }

                        var doneName = match[0],
                            parent = elem.parentNode;

                        if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
                            var count = 0;

                            for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                if ( node.nodeType === 1 ) {
                                    node.nodeIndex = ++count;
                                }
                            }

                            parent.sizcache = doneName;
                        }

                        var diff = elem.nodeIndex - last;

                        if ( first === 0 ) {
                            return diff === 0;

                        } else {
                            return ( diff % first === 0 && diff / first >= 0 );
                        }
                }
            },

            ID: function( elem, match ) {
                return elem.nodeType === 1 && elem.getAttribute("id") === match;
            },

            TAG: function( elem, match ) {
                return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
            },

            CLASS: function( elem, match ) {
                return (" " + (elem.className || elem.getAttribute("class")) + " ")
                    .indexOf( match ) > -1;
            },

            ATTR: function( elem, match ) {
                var name = match[1],
                    result = Expr.attrHandle[ name ] ?
                        Expr.attrHandle[ name ]( elem ) :
                        elem[ name ] != null ?
                            elem[ name ] :
                            elem.getAttribute( name ),
                    value = result + "",
                    type = match[2],
                    check = match[4];

                return result == null ?
                    type === "!=" :
                    type === "=" ?
                    value === check :
                    type === "*=" ?
                    value.indexOf(check) >= 0 :
                    type === "~=" ?
                    (" " + value + " ").indexOf(check) >= 0 :
                    !check ?
                    value && result !== false :
                    type === "!=" ?
                    value !== check :
                    type === "^=" ?
                    value.indexOf(check) === 0 :
                    type === "$=" ?
                    value.substr(value.length - check.length) === check :
                    type === "|=" ?
                    value === check || value.substr(0, check.length + 1) === check + "-" :
                    false;
            },

            POS: function( elem, match, i, array ) {
                var name = match[2],
                    filter = Expr.setFilters[ name ];

                if ( filter ) {
                    return filter( elem, i, match, array );
                }
            }
        }
    };

    var origPOS = Expr.match.POS,
        fescape = function(all, num){
            return "\\" + (num - 0 + 1);
        };

    for ( var type in Expr.match ) {
        Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
        Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
    }

    var makeArray = function( array, results ) {
        var i = 0,
            ret = results || [];

        if ( toString.call(array) === "[object Array]" ) {
            Array.prototype.push.apply( ret, array );

        } else {
            if ( typeof array.length === "number" ) {
                for ( var l = array.length; i < l; i++ ) {
                    ret.push( array[i] );
                }

            } else {
                for ( ; array[i]; i++ ) {
                    ret.push( array[i] );
                }
            }
        }

        return ret;
    };

    var sortOrder, siblingCheck;

    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
            return a.compareDocumentPosition ? -1 : 1;
        }

        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    };


    // Utility function for retreiving the text value of an array of DOM nodes
    Sizzle.getText = function( elems ) {
        var ret = "", elem;

        for ( var i = 0; elems[i]; i++ ) {
            elem = elems[i];

            // Get the text from text nodes and CDATA nodes
            if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
                ret += elem.nodeValue;

            // Traverse everything else, except comment nodes
            } else if ( elem.nodeType !== 8 ) {
                ret += Sizzle.getText( elem.childNodes );
            }
        }

        return ret;
    };

    (function(){
        Expr.order.splice(1, 0, "CLASS");
        Expr.find.CLASS = function( match, context, isXML ) {
            if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
                return context.getElementsByClassName(match[1]);
            }
        };
    })();

    function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
        for ( var i = 0, l = checkSet.length; i < l; i++ ) {
            var elem = checkSet[i];

            if ( elem ) {
                var match = false;

                elem = elem[dir];

                while ( elem ) {
                    if ( elem.sizcache === doneName ) {
                        match = checkSet[elem.sizset];
                        break;
                    }

                    if ( elem.nodeType === 1 && !isXML ){
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }

                    if ( elem.nodeName.toLowerCase() === cur ) {
                        match = elem;
                        break;
                    }

                    elem = elem[dir];
                }

                checkSet[i] = match;
            }
        }
    }

    function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
        for ( var i = 0, l = checkSet.length; i < l; i++ ) {
            var elem = checkSet[i];

            if ( elem ) {
                var match = false;

                elem = elem[dir];

                while ( elem ) {
                    if ( elem.sizcache === doneName ) {
                        match = checkSet[elem.sizset];
                        break;
                    }

                    if ( elem.nodeType === 1 ) {
                        if ( !isXML ) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }

                        if ( typeof cur !== "string" ) {
                            if ( elem === cur ) {
                                match = true;
                                break;
                            }

                        } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                            match = elem;
                            break;
                        }
                    }

                    elem = elem[dir];
                }

                checkSet[i] = match;
            }
        }
    }

    Sizzle.contains = function( a, b ) {
        return !!(a.compareDocumentPosition(b) & 16);
    };

    Sizzle.isXML = function( elem ) {
        // documentElement is verified for cases where it doesn't yet exist
        // (such as loading iframes in IE - #4833)
        var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

    var posProcess = function( selector, context ) {
        var match,
            tmpSet = [],
            later = "",
            root = context.nodeType ? [context] : context;

        // Position selectors must be done after the filter
        // And so must :not(positional) so we move all PSEUDOs to the end
        while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
            later += match[0];
            selector = selector.replace( Expr.match.PSEUDO, "" );
        }

        selector = Expr.relative[selector] ? selector + "*" : selector;

        for ( var i = 0, l = root.length; i < l; i++ ) {
            Sizzle( selector, root[i], tmpSet );
        }

        return Sizzle.filter( later, tmpSet );
    };

    // EXPOSE

    exports.Sizzle = Sizzle;

    })();

    return exports;
});

define('jsdom/selectors/index',[
    './sizzle'
],
function (sizzle) {
    var Sizzle = sizzle.Sizzle;
    var exports = {};

    exports.applyQuerySelectorPrototype = function(dom) {
      dom.Document.prototype.querySelector = function(selector) {
        return Sizzle(selector, this)[0];
      };

      dom.Document.prototype.querySelectorAll = function(selector) {
        var self = this;
        return new dom.NodeList(self, function() {
          return Sizzle(selector, self);
        });
      };

      dom.Element.prototype.querySelector = function(selector) {
        return Sizzle(selector, this)[0];
      };

      dom.Element.prototype.querySelectorAll = function(selector) {
        var self = this;
        if( !this.parentNode ){
          self = this.ownerDocument.createElement("div");
          self.appendChild(this);
        }
        return new dom.NodeList(self.ownerDocument, function() {
          return Sizzle(selector, self.parentNode || self);
        });
      };
    };

    return exports;
});

/***********************************************
Copyright 2010, 2011, Chris Winberry <chris@winberry.net>. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
***********************************************/
/* v1.8.0s */

(function () {

function runningInNode () {
	return(
		(typeof require) == "function"
		&&
		(typeof exports) == "object"
		&&
		(typeof module) == "object"
		&&
		(typeof __filename) == "string"
		&&
		(typeof __dirname) == "string"
		);
}

if (!runningInNode()) {
	if (!this.Tautologistics)
		this.Tautologistics = {};
	else if (this.Tautologistics.NodeHtmlParser)
		return; //NodeHtmlParser already defined!
	this.Tautologistics.NodeHtmlParser = {};
	exports = this.Tautologistics.NodeHtmlParser;
}

//Types of elements found in the DOM
var ElementType = {
	  Text: "text" //Plain text
	, Directive: "directive" //Special tag <!...>
	, Comment: "comment" //Special tag <!--...-->
	, Script: "script" //Special tag <script>...</script>
	, Style: "style" //Special tag <style>...</style>
	, Tag: "tag" //Any tag that isn't special
}

function Parser (handler, options) {
	this._options = options ? options : { };
	if (this._options.includeLocation == undefined) {
		this._options.includeLocation = false; //Do not track element position in document by default
	}

	this.validateHandler(handler);
	this._handler = handler;
	this.reset();
}

	//**"Static"**//
	//Regular expressions used for cleaning up and parsing (stateless)
	Parser._reTrim = /(^\s+|\s+$)/g; //Trim leading/trailing whitespace
	Parser._reTrimComment = /(^\!--|--$)/g; //Remove comment tag markup from comment contents
	Parser._reWhitespace = /\s/g; //Used to find any whitespace to split on
	Parser._reTagName = /^\s*(\/?)\s*([^\s\/]+)/; //Used to find the tag name for an element

	//Regular expressions used for parsing (stateful)
	Parser._reAttrib = //Find attributes in a tag
		/([^=<>\"\'\s]+)\s*=\s*"([^"]*)"|([^=<>\"\'\s]+)\s*=\s*'([^']*)'|([^=<>\"\'\s]+)\s*=\s*([^'"\s]+)|([^=<>\"\'\s\/]+)/g;
	Parser._reTags = /[\<\>]/g; //Find tag markers

	//**Public**//
	//Methods//
	//Parses a complete HTML and pushes it to the handler
	Parser.prototype.parseComplete = function Parser$parseComplete (data) {
		this.reset();
		this.parseChunk(data);
		this.done();
	}

	//Parses a piece of an HTML document
	Parser.prototype.parseChunk = function Parser$parseChunk (data) {
		if (this._done)
			this.handleError(new Error("Attempted to parse chunk after parsing already done"));
		this._buffer += data; //FIXME: this can be a bottleneck
		this.parseTags();
	}

	//Tells the parser that the HTML being parsed is complete
	Parser.prototype.done = function Parser$done () {
		if (this._done)
			return;
		this._done = true;
	
		//Push any unparsed text into a final element in the element list
		if (this._buffer.length) {
			var rawData = this._buffer;
			this._buffer = "";
			var element = {
				  raw: rawData
				, data: (this._parseState == ElementType.Text) ? rawData : rawData.replace(Parser._reTrim, "")
				, type: this._parseState
				};
			if (this._parseState == ElementType.Tag || this._parseState == ElementType.Script || this._parseState == ElementType.Style)
				element.name = this.parseTagName(element.data);
			this.parseAttribs(element);
			this._elements.push(element);
		}
	
		this.writeHandler();
		this._handler.done();
	}

	//Resets the parser to a blank state, ready to parse a new HTML document
	Parser.prototype.reset = function Parser$reset () {
		this._buffer = "";
		this._done = false;
		this._elements = [];
		this._elementsCurrent = 0;
		this._current = 0;
		this._next = 0;
		this._location = {
			  row: 0
			, col: 0
			, charOffset: 0
			, inBuffer: 0
		};
		this._parseState = ElementType.Text;
		this._prevTagSep = '';
		this._tagStack = [];
		this._handler.reset();
	}
	
	//**Private**//
	//Properties//
	Parser.prototype._options = null; //Parser options for how to behave
	Parser.prototype._handler = null; //Handler for parsed elements
	Parser.prototype._buffer = null; //Buffer of unparsed data
	Parser.prototype._done = false; //Flag indicating whether parsing is done
	Parser.prototype._elements =  null; //Array of parsed elements
	Parser.prototype._elementsCurrent = 0; //Pointer to last element in _elements that has been processed
	Parser.prototype._current = 0; //Position in data that has already been parsed
	Parser.prototype._next = 0; //Position in data of the next tag marker (<>)
	Parser.prototype._location = null; //Position tracking for elements in a stream
	Parser.prototype._parseState = ElementType.Text; //Current type of element being parsed
	Parser.prototype._prevTagSep = ''; //Previous tag marker found
	//Stack of element types previously encountered; keeps track of when
	//parsing occurs inside a script/comment/style tag
	Parser.prototype._tagStack = null;

	//Methods//
	//Takes an array of elements and parses any found attributes
	Parser.prototype.parseTagAttribs = function Parser$parseTagAttribs (elements) {
		var idxEnd = elements.length;
		var idx = 0;
	
		while (idx < idxEnd) {
			var element = elements[idx++];
			if (element.type == ElementType.Tag || element.type == ElementType.Script || element.type == ElementType.style)
				this.parseAttribs(element);
		}
	
		return(elements);
	}

	//Takes an element and adds an "attribs" property for any element attributes found 
	Parser.prototype.parseAttribs = function Parser$parseAttribs (element) {
		//Only parse attributes for tags
		if (element.type != ElementType.Script && element.type != ElementType.Style && element.type != ElementType.Tag)
			return;
	
		var tagName = element.data.split(Parser._reWhitespace, 1)[0];
		var attribRaw = element.data.substring(tagName.length);
		if (attribRaw.length < 1)
			return;
	
		var match;
		Parser._reAttrib.lastIndex = 0;
		while (match = Parser._reAttrib.exec(attribRaw)) {
			if (element.attribs == undefined)
				element.attribs = {};
	
			if (typeof match[1] == "string" && match[1].length) {
				element.attribs[match[1]] = match[2];
			} else if (typeof match[3] == "string" && match[3].length) {
				element.attribs[match[3].toString()] = match[4].toString();
			} else if (typeof match[5] == "string" && match[5].length) {
				element.attribs[match[5]] = match[6];
			} else if (typeof match[7] == "string" && match[7].length) {
				element.attribs[match[7]] = match[7];
			}
		}
	}

	//Extracts the base tag name from the data value of an element
	Parser.prototype.parseTagName = function Parser$parseTagName (data) {
		if (data == null || data == "")
			return("");
		var match = Parser._reTagName.exec(data);
		if (!match)
			return("");
		return((match[1] ? "/" : "") + match[2]);
	}

	//Parses through HTML text and returns an array of found elements
	//I admit, this function is rather large but splitting up had an noticeable impact on speed
	Parser.prototype.parseTags = function Parser$parseTags () {
		var bufferEnd = this._buffer.length - 1;
		while (Parser._reTags.test(this._buffer)) {
			this._next = Parser._reTags.lastIndex - 1;
			var tagSep = this._buffer.charAt(this._next); //The currently found tag marker
			var rawData = this._buffer.substring(this._current, this._next); //The next chunk of data to parse
	
			//A new element to eventually be appended to the element list
			var element = {
				  raw: rawData
				, data: (this._parseState == ElementType.Text) ? rawData : rawData.replace(Parser._reTrim, "")
				, type: this._parseState
			};
	
			var elementName = this.parseTagName(element.data);
	
			//This section inspects the current tag stack and modifies the current
			//element if we're actually parsing a special area (script/comment/style tag)
			if (this._tagStack.length) { //We're parsing inside a script/comment/style tag
				if (this._tagStack[this._tagStack.length - 1] == ElementType.Script) { //We're currently in a script tag
					if (elementName == "/script") //Actually, we're no longer in a script tag, so pop it off the stack
						this._tagStack.pop();
					else { //Not a closing script tag
						if (element.raw.indexOf("!--") != 0) { //Make sure we're not in a comment
							//All data from here to script close is now a text element
							element.type = ElementType.Text;
							//If the previous element is text, append the current text to it
							if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Text) {
								var prevElement = this._elements[this._elements.length - 1];
								prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep + element.raw;
								element.raw = element.data = ""; //This causes the current element to not be added to the element list
							}
						}
					}
				}
				else if (this._tagStack[this._tagStack.length - 1] == ElementType.Style) { //We're currently in a style tag
					if (elementName == "/style") //Actually, we're no longer in a style tag, so pop it off the stack
						this._tagStack.pop();
					else {
						if (element.raw.indexOf("!--") != 0) { //Make sure we're not in a comment
							//All data from here to style close is now a text element
							element.type = ElementType.Text;
							//If the previous element is text, append the current text to it
							if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Text) {
								var prevElement = this._elements[this._elements.length - 1];
								if (element.raw != "") {
									prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep + element.raw;
									element.raw = element.data = ""; //This causes the current element to not be added to the element list
								} else { //Element is empty, so just append the last tag marker found
									prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep;
								}
							} else { //The previous element was not text
								if (element.raw != "") {
									element.raw = element.data = element.raw;
								}
							}
						}
					}
				}
				else if (this._tagStack[this._tagStack.length - 1] == ElementType.Comment) { //We're currently in a comment tag
					var rawLen = element.raw.length;
					if (element.raw.charAt(rawLen - 2) == "-" && element.raw.charAt(rawLen - 1) == "-" && tagSep == ">") {
						//Actually, we're no longer in a style tag, so pop it off the stack
						this._tagStack.pop();
						//If the previous element is a comment, append the current text to it
						if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Comment) {
							var prevElement = this._elements[this._elements.length - 1];
							prevElement.raw = prevElement.data = (prevElement.raw + element.raw).replace(Parser._reTrimComment, "");
							element.raw = element.data = ""; //This causes the current element to not be added to the element list
							element.type = ElementType.Text;
						}
						else //Previous element not a comment
							element.type = ElementType.Comment; //Change the current element's type to a comment
					}
					else { //Still in a comment tag
						element.type = ElementType.Comment;
						//If the previous element is a comment, append the current text to it
						if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Comment) {
							var prevElement = this._elements[this._elements.length - 1];
							prevElement.raw = prevElement.data = prevElement.raw + element.raw + tagSep;
							element.raw = element.data = ""; //This causes the current element to not be added to the element list
							element.type = ElementType.Text;
						}
						else
							element.raw = element.data = element.raw + tagSep;
					}
				}
			}
	
			//Processing of non-special tags
			if (element.type == ElementType.Tag) {
				element.name = elementName;
				
				if (element.raw.indexOf("!--") == 0) { //This tag is really comment
					element.type = ElementType.Comment;
					delete element["name"];
					var rawLen = element.raw.length;
					//Check if the comment is terminated in the current element
					if (element.raw.charAt(rawLen - 1) == "-" && element.raw.charAt(rawLen - 2) == "-" && tagSep == ">")
						element.raw = element.data = element.raw.replace(Parser._reTrimComment, "");
					else { //It's not so push the comment onto the tag stack
						element.raw += tagSep;
						this._tagStack.push(ElementType.Comment);
					}
				}
				else if (element.raw.indexOf("!") == 0 || element.raw.indexOf("?") == 0) {
					element.type = ElementType.Directive;
					//TODO: what about CDATA?
				}
				else if (element.name == "script") {
					element.type = ElementType.Script;
					//Special tag, push onto the tag stack if not terminated
					if (element.data.charAt(element.data.length - 1) != "/")
						this._tagStack.push(ElementType.Script);
				}
				else if (element.name == "/script")
					element.type = ElementType.Script;
				else if (element.name == "style") {
					element.type = ElementType.Style;
					//Special tag, push onto the tag stack if not terminated
					if (element.data.charAt(element.data.length - 1) != "/")
						this._tagStack.push(ElementType.Style);
				}
				else if (element.name == "/style")
					element.type = ElementType.Style;
				if (element.name && element.name.charAt(0) == "/")
					element.data = element.name;
			}
	
			//Add all tags and non-empty text elements to the element list
			if (element.raw != "" || element.type != ElementType.Text) {
				if (this._options.includeLocation && !element.location) {
					element.location = this.getLocation(element.type == ElementType.Tag);
				}
				this.parseAttribs(element);
				this._elements.push(element);
				//If tag self-terminates, add an explicit, separate closing tag
				if (
					element.type != ElementType.Text
					&&
					element.type != ElementType.Comment
					&&
					element.type != ElementType.Directive
					&&
					element.data.charAt(element.data.length - 1) == "/"
					)
					this._elements.push({
						  raw: "/" + element.name
						, data: "/" + element.name
						, name: "/" + element.name
						, type: element.type
					});
			}
			this._parseState = (tagSep == "<") ? ElementType.Tag : ElementType.Text;
			this._current = this._next + 1;
			this._prevTagSep = tagSep;
		}

		if (this._options.includeLocation) {
			this.getLocation();
			this._location.row += this._location.inBuffer;
			this._location.inBuffer = 0;
			this._location.charOffset = 0;
		}
		this._buffer = (this._current <= bufferEnd) ? this._buffer.substring(this._current) : "";
		this._current = 0;
	
		this.writeHandler();
	}

	Parser.prototype.getLocation = function Parser$getLocation (startTag) {
		var c,
			l = this._location,
			end = this._current - (startTag ? 1 : 0),
			chunk = startTag && l.charOffset == 0 && this._current == 0;
		
		for (; l.charOffset < end; l.charOffset++) {
			c = this._buffer.charAt(l.charOffset);
			if (c == '\n') {
				l.inBuffer++;
				l.col = 0;
			} else if (c != '\r') {
				l.col++;
			}
		}
		return {
			  line: l.row + l.inBuffer + 1
			, col: l.col + (chunk ? 0: 1)
		};
	}

	//Checks the handler to make it is an object with the right "interface"
	Parser.prototype.validateHandler = function Parser$validateHandler (handler) {
		if ((typeof handler) != "object")
			throw new Error("Handler is not an object");
		if ((typeof handler.reset) != "function")
			throw new Error("Handler method 'reset' is invalid");
		if ((typeof handler.done) != "function")
			throw new Error("Handler method 'done' is invalid");
		if ((typeof handler.writeTag) != "function")
			throw new Error("Handler method 'writeTag' is invalid");
		if ((typeof handler.writeText) != "function")
			throw new Error("Handler method 'writeText' is invalid");
		if ((typeof handler.writeComment) != "function")
			throw new Error("Handler method 'writeComment' is invalid");
		if ((typeof handler.writeDirective) != "function")
			throw new Error("Handler method 'writeDirective' is invalid");
	}

	//Writes parsed elements out to the handler
	Parser.prototype.writeHandler = function Parser$writeHandler (forceFlush) {
		forceFlush = !!forceFlush;
		if (this._tagStack.length && !forceFlush)
			return;
		while (this._elements.length) {
			var element = this._elements.shift();
			switch (element.type) {
				case ElementType.Comment:
					this._handler.writeComment(element);
					break;
				case ElementType.Directive:
					this._handler.writeDirective(element);
					break;
				case ElementType.Text:
					this._handler.writeText(element);
					break;
				default:
					this._handler.writeTag(element);
					break;
			}
		}
	}

	Parser.prototype.handleError = function Parser$handleError (error) {
		if ((typeof this._handler.error) == "function")
			this._handler.error(error);
		else
			throw error;
	}

//TODO: make this a trully streamable handler
function RssHandler (callback) {
	RssHandler.super_.call(this, callback, { ignoreWhitespace: true, verbose: false, enforceEmptyTags: false });
}
inherits(RssHandler, DefaultHandler);

	RssHandler.prototype.done = function RssHandler$done () {
		var feed = { };
		var feedRoot;

		var found = DomUtils.getElementsByTagName(function (value) { return(value == "rss" || value == "feed"); }, this.dom, false);
		if (found.length) {
			feedRoot = found[0];
		}
		if (feedRoot) {
			if (feedRoot.name == "rss") {
				feed.type = "rss";
				feedRoot = feedRoot.children[0]; //<channel/>
				feed.id = "";
				try {
					feed.title = DomUtils.getElementsByTagName("title", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.link = DomUtils.getElementsByTagName("link", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.description = DomUtils.getElementsByTagName("description", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.updated = new Date(DomUtils.getElementsByTagName("lastBuildDate", feedRoot.children, false)[0].children[0].data);
				} catch (ex) { }
				try {
					feed.author = DomUtils.getElementsByTagName("managingEditor", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				feed.items = [];
				DomUtils.getElementsByTagName("item", feedRoot.children).forEach(function (item, index, list) {
					var entry = {};
					try {
						entry.id = DomUtils.getElementsByTagName("guid", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.title = DomUtils.getElementsByTagName("title", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.link = DomUtils.getElementsByTagName("link", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.description = DomUtils.getElementsByTagName("description", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.pubDate = new Date(DomUtils.getElementsByTagName("pubDate", item.children, false)[0].children[0].data);
					} catch (ex) { }
					feed.items.push(entry);
				});
			} else {
				feed.type = "atom";
				try {
					feed.id = DomUtils.getElementsByTagName("id", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.title = DomUtils.getElementsByTagName("title", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.link = DomUtils.getElementsByTagName("link", feedRoot.children, false)[0].attribs.href;
				} catch (ex) { }
				try {
					feed.description = DomUtils.getElementsByTagName("subtitle", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.updated = new Date(DomUtils.getElementsByTagName("updated", feedRoot.children, false)[0].children[0].data);
				} catch (ex) { }
				try {
					feed.author = DomUtils.getElementsByTagName("email", feedRoot.children, true)[0].children[0].data;
				} catch (ex) { }
				feed.items = [];
				DomUtils.getElementsByTagName("entry", feedRoot.children).forEach(function (item, index, list) {
					var entry = {};
					try {
						entry.id = DomUtils.getElementsByTagName("id", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.title = DomUtils.getElementsByTagName("title", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.link = DomUtils.getElementsByTagName("link", item.children, false)[0].attribs.href;
					} catch (ex) { }
					try {
						entry.description = DomUtils.getElementsByTagName("summary", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.pubDate = new Date(DomUtils.getElementsByTagName("updated", item.children, false)[0].children[0].data);
					} catch (ex) { }
					feed.items.push(entry);
				});
			}

			this.dom = feed;
		}
		RssHandler.super_.prototype.done.call(this);
	}

///////////////////////////////////////////////////

function DefaultHandler (callback, options) {
	this.reset();
	this._options = options ? options : { };
	if (this._options.ignoreWhitespace == undefined)
		this._options.ignoreWhitespace = false; //Keep whitespace-only text nodes
	if (this._options.verbose == undefined)
		this._options.verbose = true; //Keep data property for tags and raw property for all
	if (this._options.enforceEmptyTags == undefined)
		this._options.enforceEmptyTags = true; //Don't allow children for HTML tags defined as empty in spec
	if ((typeof callback) == "function")
		this._callback = callback;
}

	//**"Static"**//
	//HTML Tags that shouldn't contain child nodes
	DefaultHandler._emptyTags = {
		  area: 1
		, base: 1
		, basefont: 1
		, br: 1
		, col: 1
		, frame: 1
		, hr: 1
		, img: 1
		, input: 1
		, isindex: 1
		, link: 1
		, meta: 1
		, param: 1
		, embed: 1
	}
	//Regex to detect whitespace only text nodes
	DefaultHandler.reWhitespace = /^\s*$/;

	//**Public**//
	//Properties//
	DefaultHandler.prototype.dom = null; //The hierarchical object containing the parsed HTML
	//Methods//
	//Resets the handler back to starting state
	DefaultHandler.prototype.reset = function DefaultHandler$reset() {
		this.dom = [];
		this._done = false;
		this._tagStack = [];
		this._tagStack.last = function DefaultHandler$_tagStack$last () {
			return(this.length ? this[this.length - 1] : null);
		}
	}
	//Signals the handler that parsing is done
	DefaultHandler.prototype.done = function DefaultHandler$done () {
		this._done = true;
		this.handleCallback(null);
	}
	DefaultHandler.prototype.writeTag = function DefaultHandler$writeTag (element) {
		this.handleElement(element);
	} 
	DefaultHandler.prototype.writeText = function DefaultHandler$writeText (element) {
		if (this._options.ignoreWhitespace)
			if (DefaultHandler.reWhitespace.test(element.data))
				return;
		this.handleElement(element);
	} 
	DefaultHandler.prototype.writeComment = function DefaultHandler$writeComment (element) {
		this.handleElement(element);
	} 
	DefaultHandler.prototype.writeDirective = function DefaultHandler$writeDirective (element) {
		this.handleElement(element);
	}
	DefaultHandler.prototype.error = function DefaultHandler$error (error) {
		this.handleCallback(error);
	}

	//**Private**//
	//Properties//
	DefaultHandler.prototype._options = null; //Handler options for how to behave
	DefaultHandler.prototype._callback = null; //Callback to respond to when parsing done
	DefaultHandler.prototype._done = false; //Flag indicating whether handler has been notified of parsing completed
	DefaultHandler.prototype._tagStack = null; //List of parents to the currently element being processed
	//Methods//
	DefaultHandler.prototype.handleCallback = function DefaultHandler$handleCallback (error) {
			if ((typeof this._callback) != "function")
				if (error)
					throw error;
				else
					return;
			this._callback(error, this.dom);
	}
	
	DefaultHandler.prototype.isEmptyTag = function(element) {
		var name = element.name.toLowerCase();
		if (name.charAt(0) == '/') {
			name = name.substring(1);
		}
		return this._options.enforceEmptyTags && !!DefaultHandler._emptyTags[name];
	};
	
	DefaultHandler.prototype.handleElement = function DefaultHandler$handleElement (element) {
		if (this._done)
			this.handleCallback(new Error("Writing to the handler after done() called is not allowed without a reset()"));
		if (!this._options.verbose) {
//			element.raw = null; //FIXME: Not clean
			//FIXME: Serious performance problem using delete
			delete element.raw;
			if (element.type == "tag" || element.type == "script" || element.type == "style")
				delete element.data;
		}
		if (!this._tagStack.last()) { //There are no parent elements
			//If the element can be a container, add it to the tag stack and the top level list
			if (element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
				if (element.name.charAt(0) != "/") { //Ignore closing tags that obviously don't have an opening tag
					this.dom.push(element);
					if (!this.isEmptyTag(element)) { //Don't add tags to the tag stack that can't have children
						this._tagStack.push(element);
					}
				}
			}
			else //Otherwise just add to the top level list
				this.dom.push(element);
		}
		else { //There are parent elements
			//If the element can be a container, add it as a child of the element
			//on top of the tag stack and then add it to the tag stack
			if (element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
				if (element.name.charAt(0) == "/") {
					//This is a closing tag, scan the tagStack to find the matching opening tag
					//and pop the stack up to the opening tag's parent
					var baseName = element.name.substring(1);
					if (!this.isEmptyTag(element)) {
						var pos = this._tagStack.length - 1;
						while (pos > -1 && this._tagStack[pos--].name != baseName) { }
						if (pos > -1 || this._tagStack[0].name == baseName)
							while (pos < this._tagStack.length - 1)
								this._tagStack.pop();
					}
				}
				else { //This is not a closing tag
					if (!this._tagStack.last().children)
						this._tagStack.last().children = [];
					this._tagStack.last().children.push(element);
					if (!this.isEmptyTag(element)) //Don't add tags to the tag stack that can't have children
						this._tagStack.push(element);
				}
			}
			else { //This is not a container element
				if (!this._tagStack.last().children)
					this._tagStack.last().children = [];
				this._tagStack.last().children.push(element);
			}
		}
	}

	var DomUtils = {
		  testElement: function DomUtils$testElement (options, element) {
			if (!element) {
				return false;
			}
	
			for (var key in options) {
				if (key == "tag_name") {
					if (element.type != "tag" && element.type != "script" && element.type != "style") {
						return false;
					}
					if (!options["tag_name"](element.name)) {
						return false;
					}
				} else if (key == "tag_type") {
					if (!options["tag_type"](element.type)) {
						return false;
					}
				} else if (key == "tag_contains") {
					if (element.type != "text" && element.type != "comment" && element.type != "directive") {
						return false;
					}
					if (!options["tag_contains"](element.data)) {
						return false;
					}
				} else {
					if (!element.attribs || !options[key](element.attribs[key])) {
						return false;
					}
				}
			}
		
			return true;
		}
	
		, getElements: function DomUtils$getElements (options, currentElement, recurse, limit) {
			recurse = (recurse === undefined || recurse === null) || !!recurse;
			limit = isNaN(parseInt(limit)) ? -1 : parseInt(limit);

			if (!currentElement) {
				return([]);
			}
	
			var found = [];
			var elementList;

			function getTest (checkVal) {
				return(function (value) { return(value == checkVal); });
			}
			for (var key in options) {
				if ((typeof options[key]) != "function") {
					options[key] = getTest(options[key]);
				}
			}
	
			if (DomUtils.testElement(options, currentElement)) {
				found.push(currentElement);
			}

			if (limit >= 0 && found.length >= limit) {
				return(found);
			}

			if (recurse && currentElement.children) {
				elementList = currentElement.children;
			} else if (currentElement instanceof Array) {
				elementList = currentElement;
			} else {
				return(found);
			}
	
			for (var i = 0; i < elementList.length; i++) {
				found = found.concat(DomUtils.getElements(options, elementList[i], recurse, limit));
				if (limit >= 0 && found.length >= limit) {
					break;
				}
			}
	
			return(found);
		}
		
		, getElementById: function DomUtils$getElementById (id, currentElement, recurse) {
			var result = DomUtils.getElements({ id: id }, currentElement, recurse, 1);
			return(result.length ? result[0] : null);
		}
		
		, getElementsByTagName: function DomUtils$getElementsByTagName (name, currentElement, recurse, limit) {
			return(DomUtils.getElements({ tag_name: name }, currentElement, recurse, limit));
		}
		
		, getElementsByTagType: function DomUtils$getElementsByTagType (type, currentElement, recurse, limit) {
			return(DomUtils.getElements({ tag_type: type }, currentElement, recurse, limit));
		}
	}

	function inherits (ctor, superCtor) {
		var tempCtor = function(){};
		tempCtor.prototype = superCtor.prototype;
		ctor.super_ = superCtor;
		ctor.prototype = new tempCtor();
		ctor.prototype.constructor = ctor;
	}

exports.Parser = Parser;

exports.DefaultHandler = DefaultHandler;

exports.RssHandler = RssHandler;

exports.ElementType = ElementType;

exports.DomUtils = DomUtils;

})();

define("jsdom/../../node-htmlparser/lib/htmlparser", function(){});

define('jsdom/browser/index',[
    '../../url', './htmltodom', './domtohtml', './htmlencoding', '../../jsdom',
    '../selectors/index', '../level1/core', '../../util',
    '../../../node-htmlparser/lib/htmlparser'
],
function (URL, _htmltodom, _domtohtml, _htmlencoding, jsdom, selectors, core, util) {
    var HtmlToDom     = _htmltodom.HtmlToDom,
        domToHtml     = _domtohtml.domToHtml,
        HTMLEncode    = _htmlencoding.HTMLEncode,
        HTMLDecode    = _htmlencoding.HTMLDecode,
        nodeHtmlParser = Tautologistics.NodeHtmlParser;
        exports = {},
        global = this;

    function NOT_IMPLEMENTED(target) {
      return function() {
        if (!jsdom.debugMode) {
          var trigger = target ? target.trigger : this.trigger;
          trigger.call(this, 'error', 'NOT IMPLEMENTED');
        }
      };
    }

    /**
     * Creates a window having a document. The document can be passed as option,
     * if omitted, a new document will be created.
     */
    exports.windowAugmentation = function(dom, options) {
      options = options || {};
      var win = exports.createWindow(dom, options);

      if (!options.document) {
        var browser = browserAugmentation(dom, options);

        if (options.features && options.features.QuerySelector) {
          selectors.applyQuerySelectorPrototype(browser);
        }

        options.document = (browser.HTMLDocument)             ?
                            new browser.HTMLDocument(options) :
                            new browser.Document(options);

        options.document.write('<html><head></head><body></body></html>');
      }

      var doc = win.document = options.document;

      if (doc.addEventListener) {
        if (doc.readyState == 'complete') {
          var ev = doc.createEvent('HTMLEvents');
          ev.initEvent('load', false, false);
          win.dispatchEvent(ev);
        }
        else {
          doc.addEventListener('load', function(ev) {
            win.dispatchEvent(ev);
          });
        }
      }

      return win;
    };

    /**
     * Creates a document-less window.
     */
    exports.createWindow = function(dom, options) {
      var timers = [];

      function startTimer(startFn, stopFn, callback, ms) {
          var res = startFn(callback, ms);
          timers.push( [ res, stopFn ] );
          return res;
      }

      function stopTimer(id) {
          if (typeof id === 'undefined') {
              return;
          }
          for (var i in timers) {
              if (timers[i][0] === id) {
                  timers[i][1].call(this, id);
                  timers.splice(i, 1);
                  break;
              }
          }
      }

      function stopAllTimers() {
          timers.forEach(function (t) {
              t[1].call(this, t[0]);
          });
          timers = [];
      }

      function DOMWindow(options) {
        var href = (options || {}).url || 'file://' + __filename;
        this.location = URL.parse(href);
        this.location.reload = NOT_IMPLEMENTED(this);
        this.location.replace = NOT_IMPLEMENTED(this);
        this.location.toString = function() {
          return href;
        };

        var win = this.console._window = this;

        if (options && options.document) {
          options.document.location = this.location;
        }
        this.addEventListener = function() {
          dom.Node.prototype.addEventListener.apply(win, arguments);
        };
        this.removeEventListener = function() {
          dom.Node.prototype.removeEventListener.apply(win, arguments);
        };
        this.dispatchEvent = function() {
          dom.Node.prototype.dispatchEvent.apply(win, arguments);
        };
        this.trigger = function(){
          dom.Node.prototype.trigger.apply(win.document, arguments);
        };

        this.setTimeout = function (fn, ms) { return startTimer(setTimeout, clearTimeout, fn, ms); };
        this.setInterval = function (fn, ms) { return startTimer(setInterval, clearInterval, fn, ms); };
        this.clearInterval = stopTimer;
        this.clearTimeout = stopTimer;
        this.__stopAllTimers = stopAllTimers;
      }

      DOMWindow.prototype = {
        // This implements window.frames.length, since window.frames returns a
        // self reference to the window object.  This value is incremented in the
        // HTMLFrameElement init function (see: level2/html.js).
        _length : 0,
        get length () {
          return this._length;
        },
        close : function() {
          // Recursively close child frame windows, then ourselves.
          var currentWindow = this;
          (function windowCleaner (win) {
            var i;
            // We could call window.frames.length etc, but window.frames just points
            // back to window.
            if (win.length > 0) {
              for (i = 0; i < win.length; i++) {
                windowCleaner(win[i]);
              }
            }
            // We're already in our own window.close().
            if (win !== currentWindow) {
              win.close();
            }
          })(this);

          if (this.document) {
            if (this.document.body) {
              this.document.body.innerHTML = "";
            }

            if (this.document.close) {
              // We need to empty out the event listener array because
              // document.close() causes 'load' event to re-fire.
              this.document._listeners = []
              this.document.close();
            }
            delete this.document;
          }

          stopAllTimers();
          // Clean up the window's execution context.
          // dispose() is added by Contextify.
          //this.dispose();
        },
        getComputedStyle: function(node) {
          var s = node.style,
              cs = {};

          for (var n in s) {
            cs[n] = s[n];
          }
          // XXX: HACK. Workaround for evil use of __proto__ property. Original was:
          //
          // cs.__proto__ =  {
          //   getPropertyValue: function(name) {
          //     return node.style[name];
          //   }
          // }; 
          util.augment(cs, {
            getPropertyValue: function(name) {
              return node.style[name];
            }
          }); 
          return cs;
        },
        console: {
          log:   function(message) { this._window.trigger('log',   message) },
          info:  function(message) { this._window.trigger('info',  message) },
          warn:  function(message) { this._window.trigger('warn',  message) },
          error: function(message) { this._window.trigger('error', message) }
        },
        navigator: navigator, /*{
          userAgent: 'Node.js (' + process.platform + '; U; rv:' + process.version + ')',
          appName: 'Node.js jsDom',
          platform: process.platform,
          appVersion: process.version
        },*/
        XMLHttpRequest: function XMLHttpRequest() {},

        name: 'nodejs',
        innerWidth: 1024,
        innerHeight: 768,
        outerWidth: 1024,
        outerHeight: 768,
        pageXOffset: 0,
        pageYOffset: 0,
        screenX: 0,
        screenY: 0,
        screenLeft: 0,
        screenTop: 0,
        scrollX: 0,
        scrollY: 0,
        scrollTop: 0,
        scrollLeft: 0,
        alert: NOT_IMPLEMENTED(),
        blur: NOT_IMPLEMENTED(),
        confirm: NOT_IMPLEMENTED(),
        createPopup: NOT_IMPLEMENTED(),
        focus: NOT_IMPLEMENTED(),
        moveBy: NOT_IMPLEMENTED(),
        moveTo: NOT_IMPLEMENTED(),
        open: NOT_IMPLEMENTED(),
        print: NOT_IMPLEMENTED(),
        prompt: NOT_IMPLEMENTED(),
        resizeBy: NOT_IMPLEMENTED(),
        resizeTo: NOT_IMPLEMENTED(),
        scroll: NOT_IMPLEMENTED(),
        scrollBy: NOT_IMPLEMENTED(),
        scrollTo: NOT_IMPLEMENTED(),
        screen : {
          width : 0,
          height : 0
        },
        Image : NOT_IMPLEMENTED()
      };

      // XXX: HACK. Workaround for evil use of __proto__ property. Original was:
      // DOMWindow.prototype = {
      //    __proto__: dom,
      //    /* snip */
      // };
      util.augment(DOMWindow.prototype, dom);

      var win = new DOMWindow(options);

      //Contextify(window);

      // We need to set up self references using Contextify's getGlobal() so that
      // the global object identity is correct (window === this).
      // See Contextify README for more info.
      //      I think this can just be global = this
      //var global = window.getGlobal();
      var global = win;

      // Set up the window as if it's a top level window.
      // If it's not, then references will be corrected by frame/iframe code.
      // Note: window.frames is maintained in the HTMLFrameElement init function.
      win.window = win.frames
                    = win.self
                    = win.parent
                    = win.top = global;

      return win;
    };

    //Caching for HTMLParser require. HUGE performace boost.
    /**
    * 5000 iterations
    * Without cache: ~1800+ms
    * With cache: ~80ms
    */
    var defaultParser = null;
    function getDefaultParser() {
      if (defaultParser === null) {
        try {
          //      this works in the browser, dunno about this other thing
          defaultParser = nodeHtmlParser;
        }
        catch (e2) {
          defaultParser = undefined;
        }
      }
      return defaultParser;
    }

    /**
     * Augments the given DOM by adding browser-specific properties and methods (BOM).
     * Returns the augmented DOM.
     */
    var browserAugmentation = exports.browserAugmentation = function(dom, options) {

      if (dom._augmented) {
        return dom;
      }

      if(!options) {
        options = {};
      }

      // set up html parser - use a provided one or try and load from library
      var htmltodom = new HtmlToDom(options.parser || getDefaultParser());

      if (!dom.HTMLDocument) {
        dom.HTMLDocument = dom.Document;
      }
      if (!dom.HTMLDocument.prototype.write) {
        dom.HTMLDocument.prototype.write = function(html) {
          this.innerHTML = html;
        };
      }

      dom.Element.prototype.getElementsByClassName = function(className) {

        function filterByClassName(child) {
          if (!child) {
            return false;
          }

          if (child.nodeType &&
              child.nodeType === dom.Node.ENTITY_REFERENCE_NODE)
          {
            child = child._entity;
          }

          var classString = child.className;
          if (classString) {
            var s = classString.split(" ");
            for (var i=0; i<s.length; i++) {
              if (s[i] === className) {
                return true;
              }
            }
          }
          return false;
        }

        return new dom.NodeList(this.ownerDocument || this, dom.mapper(this, filterByClassName));
      };

      util.updateProperty(dom.Element.prototype, 'sourceIndex', {
          get: function() {
            /*
            * According to QuirksMode:
            * Get the sourceIndex of element x. This is also the index number for
            * the element in the document.getElementsByTagName('*') array.
            * http://www.quirksmode.org/dom/w3c_core.html#t77
            */
            var items = this.ownerDocument.getElementsByTagName('*'),
                len = items.length;

            for (var i = 0; i < len; i++) {
              if (items[i] === this) {
                return i;
              }
            }
          }
      });

      util.updateProperty(dom.Document.prototype, 'outerHTML', {
          get: function() {
            return domToHtml(this);
          }
      });

      util.updateProperty(dom.Element.prototype, 'outerHTML', {
          get: function() {
            return domToHtml(this);
          }
      });

      util.updateProperty(dom.Element.prototype, 'innerHTML', {
          get: function() {
            return domToHtml(this._childNodes, true);
          },
          set: function(html) {
            //Check for lib first

            if (html === null) {
              return null;
            }

            //Clear the children first:
            var child;
            while ((child = this._childNodes[0])) {
              this.removeChild(child);
            }

            if (this.nodeName === '#document') {
              parseDocType(this, html);
            }
            var nodes = htmltodom.appendHtmlToElement(html, this);
            return html;
          }
      });

      util.updateProperty(dom.Element.prototype, 'doctype', {
          set: function() {
            throw new core.DOMException(NO_MODIFICATION_ALLOWED_ERR);
          },
          get: function() {
            var r = null;
            if (this.nodeName == '#document') {
                if (this._doctype) {
                 r = this._doctype;
                }
            }
            return r;
          }
      });

      util.updateProperty(dom.Document.prototype, 'innerHTML', {
          get: function() {
            return domToHtml(this._childNodes, true);
          }, 
          set: function(html) {
            //Check for lib first

            if (html === null) {
              return null;
            }

            //Clear the children first:
            var child;
            while ((child = this._childNodes[0])) {
              this.removeChild(child);
            }

            if (this.nodeName === '#document') {
              parseDocType(this, html);
            }
            var nodes = htmltodom.appendHtmlToElement(html, this);
            return html;
          }
      });

      var DOC_HTML5      = /<!doctype html>/i,
          DOC_TYPE       = /<!DOCTYPE (\w(.|\n)*)">/i,
          DOC_TYPE_START = '<!DOCTYPE ',
          DOC_TYPE_END   = '">';

      function parseDocType(doc, html) {
        var publicID = '',
            systemID = '',
            fullDT = '',
            name = 'HTML',
            set = true,
            doctype = html.match(DOC_HTML5);

        //Default, No doctype === null
        doc._doctype = null;

        if (doctype && doctype[0]) { //Handle the HTML shorty doctype
          fullDT = doctype[0];
        } else { //Parse the doctype
          // find the start
          var start     = html.indexOf(DOC_TYPE_START),
              end       = html.indexOf(DOC_TYPE_END),
              docString;

          if (start < 0 || end < 0) {
            return;
          }

          docString = html.substr(start, (end-start)+DOC_TYPE_END.length);
          doctype = docString.replace(/[\n\r]/g,'').match(DOC_TYPE);

          if (!doctype) {
            return;
          }

          fullDT = doctype[0];
          doctype = doctype[1].split(' "');
          var _id1 = doctype.length ? doctype.pop().replace(/"/g, '') : '',
              _id2 = doctype.length ? doctype.pop().replace(/"/g, '') : '';

          if (_id1.indexOf('-//') !== -1) {
            publicID = _id1;
          }
          if (_id2.indexOf('-//') !== -1) {
            publicID = _id2;
          }
          if (_id1.indexOf('://') !== -1) {
            systemID = _id1;
          }
          if (_id2.indexOf('://') !== -1) {
            systemID = _id2;
          }
          if (doctype.length) {
            doctype = doctype[0].split(' ');
            name = doctype[0].toUpperCase();
          }
        }
        doc._doctype = new dom.DOMImplementation().createDocumentType(name, publicID, systemID);
        doc._doctype._ownerDocument = doc;
        doc._doctype._fullDT = fullDT;
        doc._doctype.toString = function() {
          return this._fullDT;
        };
      }

      dom.Document.prototype.getElementsByClassName = function(className) {

        function filterByClassName(child) {
          if (!child) {
            return false;
          }

          if (child.nodeType &&
              child.nodeType === dom.Node.ENTITY_REFERENCE_NODE)
          {
            child = child._entity;
          }

          var classString = child.className;
          if (classString) {
            var s = classString.split(" ");
            for (var i=0; i<s.length; i++) {
              if (s[i] === className) {
                return true;
              }
            }
          }
          return false;
        }

        return new dom.NodeList(this.ownerDocument || this, dom.mapper(this, filterByClassName));
      };

      util.updateProperty(dom.Element.prototype, 'nodeName', {
          get: function(val) {
            return this._nodeName.toUpperCase();
          }
      });

      util.updateProperty(dom.Element.prototype, 'tagName', {
          get: function(val) {
            var t = this._tagName.toUpperCase();
            //Document should not return a tagName
            if (this.nodeName === '#document') {
              t = null;
            }
            return t;
          }
      });

      dom.Element.prototype.scrollTop = 0;
      dom.Element.prototype.scrollLeft = 0;

      util.updateProperty(dom.Document.prototype, 'parentWindow', {
          get: function() {
            if (!this._parentWindow) {
              var win = exports.windowAugmentation(dom, {document: this, url: this.URL});
              // XXX: Contextify
              this._parentWindow = win;
            }
            return this._parentWindow;
          },
          set: function(win) {
            // XXX: Contextify
            this._parentWindow = win;
          }
      });

      util.updateProperty(dom.Document.prototype, 'defaultView', {
          get: function() {
            return this.parentWindow;
          }
      });

      dom._augmented = true;
      return dom;
    };

    return exports;
});

define('CSSOM',['util'], function (util) {
    var CSSOM = {};


    /**
     * @constructor
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
     */
    CSSOM.CSSStyleDeclaration = function CSSStyleDeclaration(){
        this.length = 0;

        // NON-STANDARD
        this._importants = {};
    };


    CSSOM.CSSStyleDeclaration.prototype = {

        constructor: CSSOM.CSSStyleDeclaration,

        /**
         *
         * @param {string} name
         * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
         * @return {string} the value of the property if it has been explicitly set for this declaration block. 
         * Returns the empty string if the property has not been set.
         */
        getPropertyValue: function(name) {
            return this[name] || ""
        },

        /**
         *
         * @param {string} name
         * @param {string} value
         * @param {string} [priority=null] "important" or null
         * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
         */
        setProperty: function(name, value, priority) {
            if (this[name]) {
                // Property already exist. Overwrite it.
                var index = Array.prototype.indexOf.call(this, name);
                if (index < 0) {
                    this[this.length] = name;
                    this.length++;
                }
            } else {
                // New property.
                this[this.length] = name;
                this.length++;
            }
            this[name] = value;
            this._importants[name] = priority;
        },

        /**
         *
         * @param {string} name
         * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
         * @return {string} the value of the property if it has been explicitly set for this declaration block.
         * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
         */
        removeProperty: function(name) {
            if (!(name in this)) {
                return ""
            }
            var index = Array.prototype.indexOf.call(this, name);
            if (index < 0) {
                return ""
            }
            var prevValue = this[name];
            this[name] = "";

            // That's what WebKit and Opera do
            Array.prototype.splice.call(this, index, 1);

            // That's what Firefox does
            //this[index] = ""

            return prevValue
        },

        getPropertyCSSValue: function() {
            //FIXME
        },

        /**
         *
         * @param {String} name
         */
        getPropertyPriority: function(name) {
            return this._importants[name] || "";
        },


        /**
         *   element.style.overflow = "auto"
         *   element.style.getPropertyShorthand("overflow-x")
         *   -> "overflow"
         */
        getPropertyShorthand: function() {
            //FIXME
        },

        isPropertyImplicit: function() {
            //FIXME
        },

        // Doesn't work in IE < 9
        get cssText(){
            var properties = [];
            for (var i=0, length=this.length; i < length; ++i) {
                var name = this[i];
                var value = this.getPropertyValue(name);
                var priority = this.getPropertyPriority(name);
                if (priority) {
                    priority = " !" + priority;
                }
                properties[i] = name + ": " + value + priority + ";";
            }
            return properties.join(" ")
        }

    };



    /**
     * @constructor
     * @see http://dev.w3.org/csswg/cssom/#the-cssrule-interface
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSRule
     */
    CSSOM.CSSRule = function CSSRule() {
        this.parentRule = null;
    };

    CSSOM.CSSRule.STYLE_RULE = 1;
    CSSOM.CSSRule.IMPORT_RULE = 3;
    CSSOM.CSSRule.MEDIA_RULE = 4;
    CSSOM.CSSRule.FONT_FACE_RULE = 5;
    CSSOM.CSSRule.PAGE_RULE = 6;
    CSSOM.CSSRule.WEBKIT_KEYFRAMES_RULE = 8;
    CSSOM.CSSRule.WEBKIT_KEYFRAME_RULE = 9;

    // Obsolete in CSSOM http://dev.w3.org/csswg/cssom/
    //CSSOM.CSSRule.UNKNOWN_RULE = 0;
    //CSSOM.CSSRule.CHARSET_RULE = 2;

    // Never implemented
    //CSSOM.CSSRule.VARIABLES_RULE = 7;

    CSSOM.CSSRule.prototype = {
        constructor: CSSOM.CSSRule
        //FIXME
    };



    /**
     * @constructor
     * @see http://dev.w3.org/csswg/cssom/#cssstylerule
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleRule
     */
    CSSOM.CSSStyleRule = function CSSStyleRule() {
        this.selectorText = "";
        this.style = new CSSOM.CSSStyleDeclaration;
    };

    CSSOM.CSSStyleRule.prototype = new CSSOM.CSSRule;
    CSSOM.CSSStyleRule.prototype.constructor = CSSOM.CSSStyleRule;
    CSSOM.CSSStyleRule.prototype.type = 1;

    util.updateProperty(CSSOM.CSSStyleRule.prototype, 'cssText', {
        get: function() {
            var text;
            if (this.selectorText) {
                text = this.selectorText + " {" + this.style.cssText + "}";
            } else {
                text = "";
            }
            return text;
        },
        set: function(cssText) {
            var rule = CSSOM.CSSStyleRule.parse(cssText);
            this.style = rule.style;
            this.selectorText = rule.selectorText;
        }
    });


    /**
     * NON-STANDARD
     * lightweight version of parse.js.
     * @param {string} ruleText
     * @return CSSStyleRule
     */
    CSSOM.CSSStyleRule.parse = function(ruleText) {
        var i = 0;
        var state = "selector";
        var index;
        var j = i;
        var buffer = "";

        var SIGNIFICANT_WHITESPACE = {
            "selector": true,
            "value": true
        };

        var styleRule = new CSSOM.CSSStyleRule;
        var selector, name, value, priority="";

        for (var character; character = ruleText.charAt(i); i++) {

            switch (character) {

            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                if (SIGNIFICANT_WHITESPACE[state]) {
                    // Squash 2 or more white-spaces in the row into 1
                    switch (ruleText.charAt(i - 1)) {
                        case " ":
                        case "\t":
                        case "\r":
                        case "\n":
                        case "\f":
                            break;
                        default:
                            buffer += " ";
                            break;
                    }
                }
                break;

            // String
            case '"':
                j = i + 1;
                index = ruleText.indexOf('"', j) + 1;
                if (!index) {
                    throw '" is missing';
                }
                buffer += ruleText.slice(i, index);
                i = index - 1;
                break;

            case "'":
                j = i + 1;
                index = ruleText.indexOf("'", j) + 1;
                if (!index) {
                    throw "' is missing";
                }
                buffer += ruleText.slice(i, index);
                i = index - 1;
                break;

            // Comment
            case "/":
                if (ruleText.charAt(i + 1) == "*") {
                    i += 2;
                    index = ruleText.indexOf("*/", i);
                    if (index == -1) {
                        throw SyntaxError("Missing */");
                    } else {
                        i = index + 1;
                    }
                } else {
                    buffer += character;
                }
                break;

            case "{":
                if (state == "selector") {
                    styleRule.selectorText = buffer.trim();
                    buffer = "";
                    state = "name";
                }
                break;

            case ":":
                if (state == "name") {
                    name = buffer.trim();
                    buffer = "";
                    state = "value";
                } else {
                    buffer += character;
                }
                break;

            case "!":
                if (state == "value" && ruleText.indexOf("!important", i) === i) {
                    priority = "important";
                    i += "important".length;
                } else {
                    buffer += character;
                }
                break;

            case ";":
                if (state == "value") {
                    styleRule.style.setProperty(name, buffer.trim(), priority);
                    priority = "";
                    buffer = "";
                    state = "name";
                } else {
                    buffer += character;
                }
                break;

            case "}":
                if (state == "value") {
                    styleRule.style.setProperty(name, buffer.trim(), priority);
                    priority = "";
                    buffer = "";
                } else if (state == "name") {
                    break;
                } else {
                    buffer += character;
                }
                state = "selector";
                break;

            default:
                buffer += character;
                break;

            }
        }

        return styleRule;

    };



    /**
     * @constructor
     * @see http://dev.w3.org/csswg/cssom/#cssimportrule
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSImportRule
     */
    CSSOM.CSSImportRule = function CSSImportRule() {
        this.href = "";
        this.media = new CSSOM.MediaList;
        this.styleSheet = new CSSOM.CSSStyleSheet;
    };

    CSSOM.CSSImportRule.prototype = new CSSOM.CSSRule;
    CSSOM.CSSImportRule.prototype.constructor = CSSOM.CSSImportRule;
    CSSOM.CSSImportRule.prototype.type = 3;

    util.updateProperty(CSSOM.CSSImportRule.prototype, 'cssText', {
        get: function() {
            var mediaText = this.media.mediaText;
            return "@import url(" + this.href + ")" + (mediaText ? " " + mediaText : "") + ";";
        },
        set: function(cssText) {
            var i = 0;

            /**
             * @import url(partial.css) screen, handheld;
             *        ||               |
             *        after-import     media
             *         |
             *         url
             */
            var state = '';

            var buffer = '';
            var index;
            var mediaText = '';
            for (var character; character = cssText.charAt(i); i++) {

                switch (character) {
                    case ' ':
                        case '\t':
                        case '\r':
                        case '\n':
                        case '\f':
                        if (state == 'after-import') {
                        state = 'url';
                    } else {
                        buffer += character;
                    }
                    break;

                    case '@':
                        if (!state && cssText.indexOf('@import', i) == i) {
                        state = 'after-import';
                        i += 'import'.length;
                        buffer = '';
                    }
                    break;

                    case 'u':
                        if (state == 'url' && cssText.indexOf('url(', i) == i) {
                        index = cssText.indexOf(')', i + 1);
                        if (index == -1) {
                            throw i + ': ")" not found';
                        }
                        i += 'url('.length;
                        var url = cssText.slice(i, index);
                        if (url[0] === url[url.length - 1]) {
                            if (url[0] == '"' || url[0] == "'") {
                                url = url.slice(1, -1);
                            }
                        }
                        this.href = url;
                        i = index;
                        state = 'media';
                    }
                    break;

                    case '"':
                        if (state == 'url') {
                        index = cssText.indexOf('"', i + 1);
                        if (!index) {
                            throw i + ": '\"' not found";
                        }
                        this.href = cssText.slice(i + 1, index);
                        i = index;
                        state = 'media';
                    }
                    break;

                    case "'":
                        if (state == 'url') {
                        index = cssText.indexOf("'", i + 1);
                        if (!index) {
                            throw i + ': "\'" not found';
                        }
                        this.href = cssText.slice(i + 1, index);
                        i = index;
                        state = 'media';
                    }
                    break;

                    case ';':
                        if (state == 'media') {
                        if (buffer) {
                            this.media.mediaText = buffer.trim();
                        }
                    }
                    break;

                    default:
                        if (state == 'media') {
                        buffer += character;
                    }
                    break;
                }
            }
        }
    });



    /**
     * @constructor
     * @see http://dev.w3.org/csswg/cssom/#the-medialist-interface
     */
    CSSOM.MediaList = function MediaList(){
        this.length = 0;
    };

    CSSOM.MediaList.prototype = {

        constructor: CSSOM.MediaList,

        /**
         * @return {string}
         */
        get mediaText() {
            return Array.prototype.join.call(this, ", ");
        },

        /**
         * @param {string} value
         */
        set mediaText(value) {
            var values = value.split(",");
            var length = this.length = values.length;
            for (var i=0; i<length; i++) {
                this[i] = values[i].trim();
            }
        },

        /**
         * @param {string} medium
         */
        appendMedium: function(medium) {
            if (Array.prototype.indexOf.call(this, medium) == -1) {
                this[this.length] = medium;
                this.length++;
            }
        },

        /**
         * @param {string} medium
         */
        deleteMedium: function(medium) {
            var index = Array.prototype.indexOf.call(this, medium);
            if (index != -1) {
                Array.prototype.splice.call(this, index, 1);
            }
        }
        
    };



    /**
     * @constructor
     * @see http://dev.w3.org/csswg/cssom/#cssmediarule
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSMediaRule
     */
    CSSOM.CSSMediaRule = function CSSMediaRule() {
        this.media = new CSSOM.MediaList;
        this.cssRules = [];
    };

    CSSOM.CSSMediaRule.prototype = new CSSOM.CSSRule;
    CSSOM.CSSMediaRule.prototype.constructor = CSSOM.CSSMediaRule;
    CSSOM.CSSMediaRule.prototype.type = 4;
    //FIXME
    //CSSOM.CSSMediaRule.prototype.insertRule = CSSStyleSheet.prototype.insertRule;
    //CSSOM.CSSMediaRule.prototype.deleteRule = CSSStyleSheet.prototype.deleteRule;

    // http://opensource.apple.com/source/WebCore/WebCore-658.28/css/CSSMediaRule.cpp

    util.updateProperty(CSSOM.CSSMediaRule.prototype, 'cssText', {
        get: function() {
            var cssTexts = [];
            for (var i=0, length=this.cssRules.length; i < length; i++) {
                cssTexts.push(this.cssRules[i].cssText);
            }
            return "@media " + this.media.mediaText + " {" + cssTexts.join("") + "}"
        }
    });


    /**
     * @constructor
     * @see http://www.w3.org/TR/css3-animations/#DOM-CSSKeyframesRule
     */
    CSSOM.CSSKeyframesRule = function CSSKeyframesRule() {
        this.name = '';
        this.cssRules = [];
    };

    CSSOM.CSSKeyframesRule.prototype = new CSSOM.CSSRule;
    CSSOM.CSSKeyframesRule.prototype.constructor = CSSOM.CSSKeyframesRule;
    CSSOM.CSSKeyframesRule.prototype.type = 8;
    //FIXME
    //CSSOM.CSSKeyframesRule.prototype.insertRule = CSSStyleSheet.prototype.insertRule;
    //CSSOM.CSSKeyframesRule.prototype.deleteRule = CSSStyleSheet.prototype.deleteRule;

    // http://www.opensource.apple.com/source/WebCore/WebCore-955.66.1/css/WebKitCSSKeyframesRule.cpp

    util.updateProperty(CSSOM.CSSKeyframesRule.prototype, 'cssText', {
        get: function() {
            var cssTexts = [];
            for (var i=0, length=this.cssRules.length; i < length; i++) {
                cssTexts.push("  " + this.cssRules[i].cssText);
            }
            return "@-webkit-keyframes " + this.name + " { \n" + cssTexts.join("\n") + "\n}"
        }
    });


    /**
     * @constructor
     * @see http://www.w3.org/TR/css3-animations/#DOM-CSSKeyframeRule
     */
    CSSOM.CSSKeyframeRule = function CSSKeyframeRule() {
        this.keyText = '';
        this.style = new CSSOM.CSSStyleDeclaration;
    };

    CSSOM.CSSKeyframeRule.prototype = new CSSOM.CSSRule;
    CSSOM.CSSKeyframeRule.prototype.constructor = CSSOM.CSSKeyframeRule;
    CSSOM.CSSKeyframeRule.prototype.type = 9;
    //FIXME
    //CSSOM.CSSKeyframeRule.prototype.insertRule = CSSStyleSheet.prototype.insertRule;
    //CSSOM.CSSKeyframeRule.prototype.deleteRule = CSSStyleSheet.prototype.deleteRule;

    // http://www.opensource.apple.com/source/WebCore/WebCore-955.66.1/css/WebKitCSSKeyframeRule.cpp

    util.updateProperty(CSSOM.CSSKeyframesRule.prototype, 'cssText', {
        get: function() {
            return this.keyText + " { " + this.style.cssText + " } ";
        }
    });


    /**
     * @constructor
     * @see http://dev.w3.org/csswg/cssom/#the-stylesheet-interface
     */
    CSSOM.StyleSheet = function StyleSheet(){};



    /**
     * @constructor
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleSheet
     */
    CSSOM.CSSStyleSheet = function CSSStyleSheet() {
        this.cssRules = [];
    };


    CSSOM.CSSStyleSheet.prototype = new CSSOM.StyleSheet;
    CSSOM.CSSStyleSheet.prototype.constructor = CSSOM.CSSStyleSheet;


    /**
     * Used to insert a new rule into the style sheet. The new rule now becomes part of the cascade.
     *
     *   sheet = new Sheet("body {margin: 0}")
     *   sheet.toString()
     *   -> "body{margin:0;}"
     *   sheet.insertRule("img {border: none}", 0)
     *   -> 0
     *   sheet.toString()
     *   -> "img{border:none;}body{margin:0;}"
     *
     * @param {string} rule
     * @param {number} index
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleSheet-insertRule
     * @return {number} The index within the style sheet's rule collection of the newly inserted rule.
     */
    CSSOM.CSSStyleSheet.prototype.insertRule = function(rule, index) {
        if (index < 0 || index > this.cssRules.length) {
            throw new RangeError("INDEX_SIZE_ERR")
        }
        this.cssRules.splice(index, 0, CSSOM.CSSStyleRule.parse(rule));
        return index
    };


    /**
     * Used to delete a rule from the style sheet.
     *
     *   sheet = new Sheet("img{border:none} body{margin:0}")
     *   sheet.toString()
     *   -> "img{border:none;}body{margin:0;}"
     *   sheet.deleteRule(0)
     *   sheet.toString()
     *   -> "body{margin:0;}"
     *
     * @param {number} index
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleSheet-deleteRule
     * @return {number} The index within the style sheet's rule list of the rule to remove.
     */
    CSSOM.CSSStyleSheet.prototype.deleteRule = function(index) {
        if (index < 0 || index >= this.cssRules.length) {
            throw new RangeError("INDEX_SIZE_ERR");
        }
        this.cssRules.splice(index, 1);
    };


    /**
     * NON-STANDARD
     * @return {string} serialize stylesheet
     */
    CSSOM.CSSStyleSheet.prototype.toString = function() {
        var result = "";
        var rules = this.cssRules;
        for (var i=0; i<rules.length; i++) {
            result += rules[i].cssText + "\n";
        }
        return result;
    };



    /**
     * @param {string} token
     * @param {Object} [options]
     */
    CSSOM.parse = function parse(token, options) {

        options = options || {};
        var i = options.startIndex || 0;

        /**
          "before-selector" or
          "selector" or
          "atRule" or
          "atBlock" or
          "before-name" or
          "name" or
          "before-value" or
          "value"
        */
        var state = options.state || "before-selector";

        var index;
        var j = i;
        var buffer = "";

        var SIGNIFICANT_WHITESPACE = {
            "selector": true,
            "value": true,
            "atRule": true,
            "importRule-begin": true,
            "importRule": true,
            "atBlock": true
        };

        var styleSheet = new CSSOM.CSSStyleSheet;

        // @type CSSStyleSheet|CSSMediaRule
        var currentScope = styleSheet;
        
        var selector, name, value, priority="", styleRule, mediaRule, importRule, keyframesRule, keyframeRule;

        for (var character; character = token.charAt(i); i++) {

            switch (character) {

            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                if (SIGNIFICANT_WHITESPACE[state]) {
                    buffer += character;
                }
                break;

            // String
            case '"':
                j = i + 1;
                index = token.indexOf('"', j) + 1;
                if (!index) {
                    throw '" is missing';
                }
                buffer += token.slice(i, index);
                i = index - 1;
                switch (state) {
                    case 'before-value':
                        state = 'value';
                        break;
                    case 'importRule-begin':
                        state = 'importRule';
                        break;
                }
                break;

            case "'":
                j = i + 1;
                index = token.indexOf("'", j) + 1;
                if (!index) {
                    throw "' is missing";
                }
                buffer += token.slice(i, index);
                i = index - 1;
                switch (state) {
                    case 'before-value':
                        state = 'value';
                        break;
                    case 'importRule-begin':
                        state = 'importRule';
                        break;
                }
                break;

            // Comment
            case "/":
                if (token.charAt(i + 1) == "*") {
                    i += 2;
                    index = token.indexOf("*/", i);
                    if (index == -1) {
                        throw SyntaxError("Missing */");
                    } else {
                        i = index + 1;
                    }
                } else {
                    buffer += character;
                }
                if (state == "importRule-begin") {
                    buffer += " ";
                    state = "importRule";
                }
                break;

            // At-rule
            case "@":
                if (token.indexOf("@media", i) == i) {
                    state = "atBlock";
                    mediaRule = new CSSOM.CSSMediaRule;
                    mediaRule.__starts = i;
                    i += "media".length;
                    buffer = "";
                    break;
                } else if (token.indexOf("@import", i) == i) {
                    state = "importRule-begin";
                    i += "import".length;
                    buffer += "@import";
                    break;
                } else if (token.indexOf("@-webkit-keyframes", i) == i) {
                    state = "keyframesRule-begin";
                    keyframesRule = new CSSOM.CSSKeyframesRule;
                    keyframesRule.__starts = i;
                    i += "-webkit-keyframes".length;
                    buffer = "";
                    break;
                } else if (state == "selector") {
                    state = "atRule";
                }
                buffer += character;
                break;

            case "{":
                if (state == "selector" || state == "atRule") {
                    styleRule.selectorText = buffer.trimRight();
                    styleRule.style.__starts = i;
                    buffer = "";
                    state = "before-name";
                } else if (state == "atBlock") {
                    mediaRule.media.mediaText = buffer.trim();
                    mediaRule.parentRule = currentScope;
                    currentScope = mediaRule;
                    buffer = "";
                    state = "before-selector";
                } else if (state == "keyframesRule-begin") {
                    keyframesRule.name = buffer.trimRight();
                    keyframesRule.parentRule = currentScope;
                    currentScope = keyframesRule;
                    buffer = "";
                    state = "keyframeRule-begin";
                } else if (state == "keyframeRule-begin") {
                    styleRule = new CSSOM.CSSKeyframeRule;
                    styleRule.keyText = buffer.trimRight();
                    styleRule.__starts = i;
                    buffer = "";
                    state = "before-name";
                }
                break;

            case ":":
                if (state == "name") {
                    name = buffer.trim();
                    buffer = "";
                    state = "before-value";
                } else {
                    buffer += character;
                }
                break;

            case '(':
                if (state == 'value') {
                    index = token.indexOf(')', i + 1);
                    if (index == -1) {
                        throw i + ': unclosed "("';
                    }
                    buffer += token.slice(i, index + 1);
                    i = index;
                } else {
                    buffer += character;
                }
                break;

            case "!":
                if (state == "value" && token.indexOf("!important", i) === i) {
                    priority = "important";
                    i += "important".length;
                } else {
                    buffer += character;
                }
                break;

            case ";":
                switch (state) {
                    case "value":
                        styleRule.style.setProperty(name, buffer.trim(), priority);
                        priority = "";
                        buffer = "";
                        state = "before-name";
                        break;
                    case "atRule":
                        buffer = "";
                        state = "before-selector";
                        break;
                    case "importRule":
                        importRule = new CSSOM.CSSImportRule;
                        importRule.parentRule = currentScope;
                        importRule.cssText = buffer + character;
                        currentScope.cssRules.push(importRule);
                        buffer = "";
                        state = "before-selector";
                        break;
                    default:
                        buffer += character;
                        break;
                }
                break;

            case "}":
                switch (state) {
                    case "value":
                        styleRule.style.setProperty(name, buffer.trim(), priority);
                        priority = "";
                    case "before-name":
                    case "name":
                        styleRule.__ends = i + 1;
                        styleRule.parentRule = currentScope;
                        currentScope.cssRules.push(styleRule);
                        buffer = "";
                        if (currentScope.constructor == CSSOM.CSSKeyframesRule) {
                            state = "keyframeRule-begin";
                        } else {
                            state = "before-selector";
                        }
                        break;
                    case "keyframeRule-begin":
                    case "before-selector":
                    case "selector":
                        // End of media rule.
                        // Nesting rules aren't supported yet
                        if (!currentScope.parentRule) {
                            throw "unexpected }";
                        }
                        currentScope.__ends = i + 1;
                        currentScope.parentRule.cssRules.push(currentScope);
                        currentScope = currentScope.parentRule;
                        buffer = "";
                        state = "before-selector";
                        break;
                }
                break;

            default:
                switch (state) {
                    case "before-selector":
                        state = "selector";
                        styleRule = new CSSOM.CSSStyleRule;
                        styleRule.__starts = i;
                        break;
                    case "before-name":
                        state = "name";
                        break;
                    case "before-value":
                        state = "value";
                        break;
                    case "importRule-begin":
                        state = "importRule";
                        break;
                }
                buffer += character;
                break;
            }
        }

        return styleSheet;
    };



    /**
     * Produces a deep copy of stylesheet — the instance variables of stylesheet are copied recursively.
     * @param {CSSStyleSheet|CSSOM.CSSStyleSheet} stylesheet
     * @nosideeffects
     * @return {CSSOM.CSSStyleSheet}
     */
    CSSOM.clone = function clone(stylesheet) {

        var cloned = new CSSOM.CSSStyleSheet;

        var rules = stylesheet.cssRules;
        if (!rules) {
            return cloned;
        }

        var RULE_TYPES = {
            1: CSSOM.CSSStyleRule,
            4: CSSOM.CSSMediaRule,
            //3: CSSOM.CSSImportRule,
            //5: CSSOM.CSSFontFaceRule,
            //6: CSSOM.CSSPageRule,
            8: CSSOM.CSSKeyframesRule,
            9: CSSOM.CSSKeyframeRule
        };

        for (var i=0, rulesLength=rules.length; i < rulesLength; i++) {
            var rule = rules[i];
            var ruleClone = cloned.cssRules[i] = new RULE_TYPES[rule.type];

            var style = rule.style;
            if (style) {
                var styleClone = ruleClone.style = new CSSOM.CSSStyleDeclaration;
                for (var j=0, styleLength=style.length; j < styleLength; j++) {
                    var name = styleClone[j] = style[j];
                    styleClone[name] = style[name];
                    styleClone._importants[name] = style.getPropertyPriority(name);
                }
                styleClone.length = style.length;
            }

            if ("keyText" in rule) {
                ruleClone.keyText = rule.keyText;
            }

            if ("selectorText" in rule) {
                ruleClone.selectorText = rule.selectorText;
            }

            if ("mediaText" in rule) {
                ruleClone.mediaText = rule.mediaText;
            }

            if ("cssRules" in rule) {
                rule.cssRules = clone(rule).cssRules;
            }
        }

        return cloned;

    };

    return CSSOM;
});

define('jsdom/level2/style',[
    './core', './html', '../../CSSOM', '../../util'
],
function (_core, _html, _cssom, util) {
    var core = _core.dom.level2.core,
        html = _html.dom.level2.html,
        cssom = _cssom,
        exports = {}/*,
        assert = require('assert')*/;

    // What works now:
    // - Accessing the rules defined in individual stylesheets
    // - Modifications to style content attribute are reflected in style property
    // TODO
    // - Modifications to style property are reflected in style content attribute
    // - Modifications to style element's textContent are reflected in sheet property.
    // - Modifications to style element's sheet property are reflected in textContent.
    // - Modifications to link.href property are reflected in sheet property.
    // - Less-used features of link: disabled
    // - Less-used features of style: disabled, scoped, title
    // - CSSOM-View
    //   - getComputedStyle(): requires default stylesheet, cascading, inheritance,
    //     filtering by @media (screen? print?), layout for widths/heights
    // - Load events are not in the specs, but apparently some browsers
    //   implement something. Should onload only fire after all @imports have been
    //   loaded, or only the primary sheet?

    core.StyleSheet = cssom.StyleSheet;
    core.MediaList = cssom.MediaList;
    core.CSSStyleSheet = cssom.CSSStyleSheet;
    core.CSSRule = cssom.CSSRule;
    core.CSSStyleRule = cssom.CSSStyleRule;
    core.CSSMediaRule = cssom.CSSMediaRule;
    core.CSSImportRule = cssom.CSSImportRule;
    core.CSSStyleDeclaration = cssom.CSSStyleDeclaration;

    // Relavant specs
    // http://www.w3.org/TR/DOM-Level-2-Style (2000)
    // http://www.w3.org/TR/cssom-view/ (2008)
    // http://dev.w3.org/csswg/cssom/ (2010) Meant to replace DOM Level 2 Style
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/ HTML5, of course
    // http://dev.w3.org/csswg/css-style-attr/  not sure what's new here

    // Objects that aren't in cssom library but should be:
    //   CSSRuleList  (cssom just uses array)
    //   CSSFontFaceRule
    //   CSSPageRule

    // These rules don't really make sense to implement, so CSSOM draft makes them
    // obsolete.
    //   CSSCharsetRule
    //   CSSUnknownRule

    // These objects are considered obsolete by CSSOM draft, although modern
    // browsers implement them.
    //   CSSValue
    //   CSSPrimitiveValue
    //   CSSValueList
    //   RGBColor
    //   Rect
    //   Counter

    // StyleSheetList has the same interface as NodeList, so we'll use the same
    // object.
    core.StyleSheetList = core.NodeList;

    util.updateProperty(core.Document.prototype, 'styleSheets', {
        get: function() {
            if (!this._styleSheets) {
                this._styleSheets = new core.StyleSheetList;
            }
            // TODO: each style and link element should register its sheet on creation
            // nad remove it on removal.
            return this._styleSheets;
        }
    });

    /**
     * @this {html.HTMLLinkElement|html.HTMLStyleElement}
     * @param {string} url
     * @param {cssom.CSSStyleSheet} sheet
     * @see http://dev.w3.org/csswg/cssom/#requirements-on-user-agents-implementing0
     */
    function fetchStylesheet(url, sheet) {
      core.resourceLoader.load(this, url, function(data, filename) {
        // TODO: abort if the content-type is not text/css, and the document is
        // in strict mode
        evaluateStylesheet.call(this, data, sheet, url);
      });
    }
    /**
     * @this {html.HTMLLinkElement|html.HTMLStyleElement}
     * @param {string} data
     * @param {cssom.CSSStyleSheet} sheet
     * @param {string} baseUrl
     */
    function evaluateStylesheet(data, sheet, baseUrl) {
      // this is the element
      var newStyleSheet = cssom.parse(data);
      var spliceArgs = newStyleSheet.cssRules;
      spliceArgs.unshift(0, sheet.cssRules.length);
      Array.prototype.splice.apply(sheet.cssRules, spliceArgs);
      scanForImportRules.call(this, sheet.cssRules, baseUrl);
    }
    /**
     * @this {html.HTMLLinkElement|html.HTMLStyleElement}
     * @param {cssom.CSSStyleSheet} sheet
     * @param {string} baseUrl
     */
    function scanForImportRules(cssRules, baseUrl) {
      if (!cssRules) return;
      for (var i = 0; i < cssRules.length; ++i) {
        if (cssRules[i].cssRules) {
          // @media rule: keep searching inside it.
          scanForImportRules.call(this, cssRules[i].cssRules, baseUrl);
        } else if (cssRules[i].href) {
          // @import rule: fetch the resource and evaluate it.
          // See http://dev.w3.org/csswg/cssom/#css-import-rule
          //     If loading of the style sheet fails its cssRules list is simply
          //     empty. I.e. an @import rule always has an associated style sheet.
          fetchStylesheet.call(this, cssRules[i].href, self.sheet);
        }
      }
    }

    /**
     * @param {string} data
     * @param {cssom.CSSStyleDeclaration} style
     */
    function evaluateStyleAttribute(data) {
      // this is the element.

      // currently, cssom's parse doesn't really work if you pass in
      // {state: 'name'}, so instead we just build a dummy sheet.
      var styleSheet = cssom.parse('dummy{' + data + '}')
        , style = this.style;
      //console.log('evaluating style on ' + this.tagName + ': ' + data + '  ->')
      //console.log(styleSheet);
      while (style.length > 0) {
        // TODO: find a non-n^2 way to remove all properties (this calls splice
        // n times).
        style.removeProperty(style[0]);
      }
      if (styleSheet.cssRules.length > 0 && styleSheet.cssRules[0].style) {
        var newStyle = styleSheet.cssRules[0].style;
        for (var i = 0; i < newStyle.length; ++i) {
          var prop = newStyle[i];
          style.setProperty(
              prop,
              newStyle.getPropertyValue(prop),
              newStyle.getPropertyPriority(prop));
        }
      }
    }

    /**
     * Parses style attribute if it changes.
     *
     * @this {html.HTMLElement}
     * @param {Event} e
     */
    function styleAttributeListener(e)
    {
      //console.log('style modified')
      if ('style' === e.attrName) {
        evaluateStyleAttribute.call(this, e.newValue);
      }
    }

    /**
     * Update style attribute after calling a CSSStyleDeclaration method.
     *
     * @this {html.HTMLElement}
     * @param {Function} method  CSSStyleDeclaration method
     * @param {Array} args       Arguments to pass to method
     */
    function callCSSOMAndUpdateStyle(method, args)
    {
      method.apply(this._cssStyleDeclaration, args);

      // Bypass listener so style attribute isn't parsed
      this.removeEventListener('DOMAttrModified', styleAttributeListener);
      this.setAttribute('style', this.style.cssText);
      this.addEventListener('DOMAttrModified', styleAttributeListener);
    }

    util.updateProperty(html.HTMLElement.prototype, 'style', {
        get: function() {
            if (!this._cssStyleDeclaration) {
                this._cssStyleDeclaration = new cssom.CSSStyleDeclaration;
                //console.log('creating style atribute on ' + this.nodeName)
                this.addEventListener('DOMAttrModified', styleAttributeListener);
                evaluateStyleAttribute.call(this, this.getAttribute('style'));

                // Override CSSOM to catch changes to properties and update style attribute
                var self = this;
                var oldSetProperty = this._cssStyleDeclaration.setProperty;
                var oldRemoveProperty = this._cssStyleDeclaration.removeProperty;

                this._cssStyleDeclaration.setProperty = function()
                {
                    callCSSOMAndUpdateStyle.call(self, oldSetProperty, arguments);
                };

                this._cssStyleDeclaration.removeProperty = function()
                {
                    callCSSOMAndUpdateStyle.call(self, oldRemoveProperty, arguments);
                };
            }

            Object.defineProperty(this._cssStyleDeclaration, '_element', {
                value: this,
                enumerable: false
            });
            return this._cssStyleDeclaration;
        },
        set:  function(val) {
            // copied from the define helper function within html.js to define reflected
            // attributes.
            if (!val) {
                this.removeAttribute(attr);
            }
            else {
                var s = val.toString();
                this.setAttribute('style', s);
            }
        }
    });
    
    //assert.equal(undefined, html.HTMLLinkElement._init)
    html.HTMLLinkElement._init = function() {
      this.addEventListener('DOMNodeInsertedIntoDocument', function() {
        if (!/(?:[ \t\n\r\f]|^)stylesheet(?:[ \t\n\r\f]|$)/i.test(this.rel)) {
          // rel is a space-separated list of tokens, and the original rel types
          // are case-insensitive.
          return;
        }
        if (this.href) {
          fetchStylesheet.call(this, this.href, this.sheet);
        }
      });
      this.addEventListener('DOMNodeRemovedFromDocument', function() {
      });
    };
    /**
     * @this {HTMLStyleElement|HTMLLinkElement}
     */
    var getOrCreateSheet = function() {
      if (!this._cssStyleSheet) {
        this._cssStyleSheet = new cssom.CSSStyleSheet;
      }
      return this._cssStyleSheet;
    };
    util.updateProperty(html.HTMLLinkElement.prototype, 'sheet', {
        get: getOrCreateSheet
    });

    //assert.equal(undefined, html.HTMLStyleElement._init)
    html.HTMLStyleElement._init = function() {
      //console.log('init style')
      this.addEventListener('DOMNodeInsertedIntoDocument', function() {
        //console.log('style inserted')
        //console.log('sheet: ', this.sheet);
        if (this.type && this.type !== 'text/css') {
          //console.log('bad type: ' + this.type)
          return;
        }
        evaluateStylesheet.call(this, this.textContent, this.sheet, this._ownerDocument.URL);
      });
    };
    util.updateProperty(html.HTMLStyleElement.prototype, 'sheet', {
        get: getOrCreateSheet
    });

    exports.dom = {
      level2 : {
        html : html,
        core : core
      }
    };

    return exports;
});

define('jsdom',[
    './jsdom/level3/index', './jsdom/browser/index', './jsdom/browser/documentfeatures',
    './jsdom/selectors/index', './jsdom/level2/style', './util'
],
function (_level3, _browser, _features, _selectors, _style, util) {
    var exports = {},
        dom = exports.dom = _level3.dom;

    exports.defaultLevel = dom.level3.html;
    exports.browserAugmentation = _browser.browserAugmentation;
    exports.windowAugmentation = _browser.windowAugmentation;

    // Proxy feature functions to features module.
    ['availableDocumentFeatures',
     'defaultDocumentFeatures',
     'applyDocumentFeatures'].forEach(function (propName) {
         util.updateProperty(exports, propName, {
             get: function () {
                 return _features[propName];
             },
             set: function (val) {
                 return _features[propName] = val;
             }
         });
    });

    exports.debugMode = false;

    var createWindow = exports.createWindow = _browser.createWindow;

    /*
    exports.__defineGetter__('version', function() {
      return pkg.version;
    });
    */

    /*
    exports.level = function (level, feature) {
        if(!feature) feature = 'core'
        return require('./jsdom/level' + level + '/' + feature).dom['level' + level][feature]
    }
    */

    exports.jsdom = function (html, level, options) {

      options = options || {};
      if(typeof level == "string") {
        level = exports.level(level, 'html')
      } else {
        level   = level || exports.defaultLevel;
      }

      if (!options.url) {
        options.url = location.href;
      }

      if (options.features && options.features.QuerySelector) {
        _selectors.applyQuerySelectorPrototype(level);
      }

      var browser = exports.browserAugmentation(level, options),
          doc     = (browser.HTMLDocument)             ?
                     new browser.HTMLDocument(options) :
                     new browser.Document(options);

      _features.applyDocumentFeatures(doc, options.features);
      
      if (typeof html === 'undefined' || html === null) {
        doc.write('<html><head></head><body></body></html>');
      } else {
        doc.write(html + '');
      }

      if (doc.close && !options.deferClose) {
        doc.close();
      }

      // Kept for backwards-compatibility. The window is lazily created when
      // document.parentWindow or document.defaultView is accessed.
      doc.createWindow = function() {
        // Remove ourself
        if (doc.createWindow) {
          delete doc.createWindow;
        }
        return doc.parentWindow;
      };

      return doc;
    };

    exports.html = function(html, level, options) {
      html += '';

      // TODO: cache a regex and use it here instead
      //       or make the parser handle it
      var htmlLowered = html.toLowerCase();

      // body
      if (!~htmlLowered.indexOf('<body')) {
        html = '<body>' + html + '</body>';
      }

      // html
      if (!~htmlLowered.indexOf('<html')) {
        html = '<html>' + html + '</html>';
      }
      return exports.jsdom(html, level, options);
    };

    exports.jQueryify = exports.jsdom.jQueryify = function (window /* path [optional], callback */) {

      if (!window || !window.document) { return; }

      var args = Array.prototype.slice.call(arguments),
          callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
          path,
          jQueryTag = window.document.createElement("script");

      if (args.length > 1 && typeof(args[1] === 'string')) {
        path = args[1];
      }

      var features = window.document.implementation._features;

      window.document.implementation.addFeature('FetchExternalResources', ['script']);
      window.document.implementation.addFeature('ProcessExternalResources', ['script']);
      window.document.implementation.addFeature('MutationEvents', ["1.0"]);
      jQueryTag.src = path || 'http://code.jquery.com/jquery-latest.js';
      window.document.body.appendChild(jQueryTag);

      jQueryTag.onload = function() {
        if (callback) {
          callback(window, window.jQuery);
        }

        window.document.implementation._features = features;
      };

      return window;
    };


    exports.env = exports.jsdom.env = function() {
      var
      args        = Array.prototype.slice.call(arguments),
      config      = exports.env.processArguments(args),
      callback    = config.done,
      processHTML = function(err, html) {

        html += '';
        if(err) {
          return callback(err);
        }

        config.scripts = config.scripts || [];
        if (typeof config.scripts === 'string') {
          config.scripts = [config.scripts];
        }

        config.src = config.src || [];
        if (typeof config.src === 'string') {
          config.src = [config.src];
        }

        var 
        options    = {
          features: {
            'FetchExternalResources' : false,
            'ProcessExternalResources' : false
          },
          url: config.url
        },
        window     = exports.html(html, null, options).createWindow(),
        features   = window.document.implementation._features,
        docsLoaded = 0,
        totalDocs  = config.scripts.length,
        readyState = null,
        errors     = null;

        if (!window || !window.document) {
          return callback(new Error('JSDOM: a window object could not be created.')); 
        }

        window.document.implementation.addFeature('FetchExternalResources', ['script']);
        window.document.implementation.addFeature('ProcessExternalResources', ['script']);
        window.document.implementation.addFeature('MutationEvents', ['1.0']);

        var scriptComplete = function() {
          docsLoaded++;
          if (docsLoaded >= totalDocs) {
            window.document.implementation._features = features;
            callback(errors, window);
          }
        }

        if (config.scripts.length > 0 || config.src.length > 0) {
          throw 'config.scripts is not supported'
          config.scripts.forEach(function(src) {
            var script = window.document.createElement('script');
            script.onload = function() {
              scriptComplete()
            };

            script.onerror = function(e) {
              if (!errors) {
                errors = [];
              }
              errors.push(e.error);
              scriptComplete();
            };

            script.src = src;
            try {
              // project against invalid dom
              // ex: http://www.google.com/foo#bar
              window.document.documentElement.appendChild(script);
            } catch(e) {
              if(!errors) {
                errors=[];
              }
              errors.push(e.error || e.message);
              callback(errors, window);
            }
          });

          config.src.forEach(function(src) {
            var script = window.document.createElement('script');
            script.onload = function() {
              process.nextTick(scriptComplete);
            };

            script.onerror = function(e) {
              if (!errors) {
                errors = [];
              }
              errors.push(e.error || e.message);
              // nextTick so that an exception within scriptComplete won't cause
              // another script onerror (which would be an infinite loop)
              process.nextTick(scriptComplete);
            };

            script.text = src;
            window.document.documentElement.appendChild(script);
            window.document.documentElement.removeChild(script);
          });
        } else {
          callback(errors, window);
        }
      };

      config.html += '';

      // Handle markup
      if (config.html.indexOf("\n") > 0 || config.html.match(/^\W*</)) {
        processHTML(null, config.html);

      // Handle url/file
      } else {
        throw 'Loading markup from a URL or file is not supported'
        /*
        var url = URL.parse(config.html);
        config.url = config.url || url.href;
        if (url.hostname) {
          request({ uri: url,
                    encoding: config.encoding || 'utf8',
                    headers: config.headers || {}
                  },
                  function(err, request, body) {
                    processHTML(err, body);
          });
        } else {
          fs.readFile(url.pathname, processHTML);
        }
        */
      }
    };

    /*
      Since jsdom.env() is a helper for quickly and easily setting up a
      window with scripts and such already loaded into it, the arguments
      should be fairly flexible.  Here are the requirements

      1) collect `html` (url, string, or file on disk)  (STRING)
      2) load `code` into the window (array of scripts) (ARRAY)
      3) callback when resources are `done`             (FUNCTION)
      4) configuration                                  (OBJECT)

      Rules:
      + if there is one argument it had better be an object with atleast
        a `html` and `done` property (other properties are gravy)

      + arguments above are pulled out of the arguments and put into the
        config object that is returned
    */
    exports.env.processArguments = function(args) {
      if (!args || !args.length || args.length < 1) {
        throw new Error('No arguments passed to jsdom.env().');
      }

      var
      props = {
        'html'    : true,
        'done'    : true,
        'scripts' : false,
        'config'  : false,
        'url'     : false  // the URL for location.href if different from html
      },
      propKeys = Object.keys(props),
      config = {
        code : []
      },
      l    = args.length
      ;
      if (l === 1) {
        config = args[0];
      } else {
        args.forEach(function(v) {
          var type = typeof v;
          if (!v) {
            return;
          }
          if (type === 'string' || v + '' === v) {
            config.html = v;
          } else if (type === 'object') {
            // Array
            if (v.length && v[0]) {
              config.scripts = v;
            } else {
              // apply missing required properties if appropriate
              propKeys.forEach(function(req) {

                if (typeof v[req] !== 'undefined' &&
                    typeof config[req] === 'undefined') {

                  config[req] = v[req];
                  delete v[req];
                }
              });
              config.config = v;
            }
          } else if (type === 'function') {
            config.done = v;
          }
        });
      }

      propKeys.forEach(function(req) {
        var required = props[req];
        if (required && typeof config[req] === 'undefined') {
          throw new Error("jsdom.env requires a '" + req + "' argument");
        }
      });
      return config;
    };

    return exports;
});
