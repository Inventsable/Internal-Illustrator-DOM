dispatchEvent('mighty.start', extFolder())
loadUniversalJSXLibraries();
var csInterface = new CSInterface();
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);

Vue.config.devtools = false;

var xpath = require('xpath')
  , dom = require('xmldom').DOMParser
var source = {
  xml : myT.readFile('./client/ILSTlibFull.xml'),
};
var xdom = {};

source['doc'] = new dom().parseFromString(source.xml);
source['package'] = xpath.select("//package", source.doc);
source.package = new dom().parseFromString(source.package[0].toString());

var classes = xpath.select("//classdef", source.package);
classes.forEach(function(v,i,a){
  getProperties(v, i);
  if (i == (a.length - 1))
    console.log(v);
})
console.log(xdom);


function getProperties(classdef, index) {
  var reflect = {
    props: [],
    desc: {},
    elements: {
      properties: {
        data: {},
        desc: {},
      },
    },
  }
  if (hasDescription(classdef)) {
    reflect.desc = hasDescription(classdef)
  }
  if (/classdef/gm.test(classdef.tagName))
    reflect.kind = trimR(classdef.tagName, 3);
  else
    reflect.kind = classdef.tagName;
  for (var n = 0; n < classdef.attributes.length; n++)
    reflect[classdef.attributes[n].name] = classdef.attributes[n].value;

  // console.log(classdef);

  xdomclass = new dom().parseFromString(classdef.toString());
  reflect.elements = xpath.select("//elements", xdomclass);
  // console.log(reflect.elements);
  // console.log(reflect.elements);
  reflect.elements = reflect.elements[0];
  reflect.key = index;
  // console.log(reflect.elements);
  reflect.elements.attr = getAttributes(reflect.elements);
  reflect.elements.properties = xpath.select("//property", reflect.elements)
  reflect.props = [];
  for (var e = 0; e < reflect.elements.properties.length; e++) {
    var obj = {
      attrList : [],
      datatype : {},
      kind : reflect.elements.properties[e].tagName
    };
    if (hasDescription(reflect.elements.properties[e])) {
      obj.desc = hasDescription(reflect.elements.properties[e]);
    }
    for (var u = 0; u < reflect.elements.properties[e].attributes.length; u++) {
      obj[reflect.elements.properties[e].attributes[u].name] = reflect.elements.properties[e].attributes[u].value;
      var propStr = reflect.elements.properties[e].toString();
      if (/<type>[\s\S]*?<\/type>/gm.test(propStr)) {
        var desc = propStr.match(/<type>[\s\S]*?(?=<\/type>)/gm);
        obj.datatype.type = strReplace(desc[0], '<type>')
      }
      if (/<value>[\s\S]*?<\/value>/gm.test(propStr)) {
        var val = propStr.match(/<value>[\s\S]*?(?=<\/value>)/gm);
        obj.datatype.value = strReplace(val[0], '<value>')
      }
      obj.attrList.push(reflect.elements.properties[e].attributes[u].name);
    }
    reflect.props.push(obj)
  }
  xdom[reflect.name] = reflect;
}

function getAttributes(source) {
  var mirror = {};
  try {
    for (var e = 0; e < source.attributes.length; e++)
      mirror[source.attributes[e].name] = source.attributes[e].value;
  } catch(e) {
    mirror = 'No attributes'
  }
  // console.log(mirror);
  return mirror;
}

function hasDescription(source) {
  var str = source.toString();
  var result = false;
  if (/<shortdesc>[\s\S]*?<\/shortdesc>/gm.test(str)) {
    var desc = str.match(/<shortdesc>[\s\S]*?(?=<\/shortdesc>)/gm);
    result = strReplace(desc[0], '<shortdesc>')
  }
  return result;
}


var testDOM = {
  testClass : {
    kind: "class",
    desc: "Dynamic object used to create data-driven graphics.",
    dynamic: "true",
    name: "Variable",
    props : [
      {
        attrList : ["name", "rwaccess"],
        datatype : {
          type : "int",
          value : 1
        },
        desc: "The object's container",
        name: "parent",
        kind: "property",
        rwaccess: "readonly"
      },
      {
        attrList : ["name", "rwaccess"],
        datatype : {
          type : "int",
          value : 1
        },
        desc: "The classname of the object",
        name: "typename",
        kind: "property",
        rwaccess: "readonly"
      },
    ]
  }
};


Vue.component('selector', {
  template: `
    <div class="selectLine">
      <div class="selectPrefix">
        <div :class="(this.toggle.isSelect) ? 'xtag-select-active' : 'xtag-select-idle'" @click="setActive('select')">
          <span class="adobe-icon-cursor"></span>
        </div>
        <div :class="(this.toggle.isFind) ? 'xtag-find-active' : 'xtag-find-idle'" @click="setActive('find')">
          <span class="adobe-icon-find"></span>
        </div>
        <input :class="(toggle.isActive) ? 'select-input-active' : 'select-input-idle'" type="text" v-model="msg">
      </div>
      <div class="selectSuffix">
        <div :class="(this.isPlus) ? 'xtag-plus-active' : 'xtag-plus-idle'" @click="setFavorite('plus')">
          <span class="adobe-icon-plus"></span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      msg: 'app.selection',
      toggleList : ['isActive', 'isSelect', 'isFind'],
      // toggle : [
      //   {isActive: false,
      //   {isSelect: true},
      //   {isFind: false},
      // ]
      toggle : {
        isActive: false,
        isSelect: false,
        isFind: false,
      },
      isPlus: false,
    }
  },
  methods : {
    setFavorite: function(lower) {
      // console.log(this.msg);
      var upper = lower.charAt(0).toUpperCase() + lower.substr(1);
      this.isPlus = !this.isPlus;
      if (this.isPlus)
        changeCSSVar('colorPlusIcon', getCSSVar('colorPlusActive'))
      else
        changeCSSVar('colorPlusIcon', getCSSVar('colorPlusIdle'))
      console.log(this.isPlus);
      console.log(getCSSVar('colorNoteIcon'));
    },
    setActive : function(lower) {
      var upper = lower.charAt(0).toUpperCase() + lower.substr(1);
      var lock = '';
      for (var m = 0; m < this.toggleList.length; m++) {
        var select = this.toggleList[m];
        if (select !== 'is' + upper) {
          this.toggle[select] = false;
        } else {
          this.toggle[select] = !this.toggle[select];
          lock = upper;
          if (this.toggle[select])
            changeCSSVar('color' + upper + 'Icon', getCSSVar('color' + upper + 'Active'))
          else
            changeCSSVar('color' + upper + 'Icon', getCSSVar('color' + upper + 'Idle'))
        }
      }
      for (var n = 0; n < this.toggleList.length; n++) {
        var select = trimL(this.toggleList[n], 2);
        if (select !== lock) {
          // console.log('matching ' + select);
          changeCSSVar('color' + select + 'Icon', '#a1a1a1')
        }
      }
      // console.log(upper + ' is ' + this.toggle['is' + upper]);
      // console.log(getCSSVar('color' + upper + 'Active'));
      // console.log(getCSSVar('color' + upper + 'Idle'));
      // console.log(getCSSVar('color' + upper + 'Icon'));
    }
  }
})

Vue.component('pulley', {
  template: `
    <div class="xpull" @click="drag(100)"></div>
  `,
  methods: {
    drag: function(e) {
      console.log(this);
      console.log(e);
      console.log('Is dragging');
    }
  }
})

Vue.component('classdeflist', {
  template: `
    <div class="library">
      <div class="libraryNote" v-for="classdef in omv">
        <div class="clickParent" @click="toggleChild">
          <classdef :key="classdef.key" :label="classdef.name" :kind="classdef.kind"></classdef>
        </div>
        <div v-for="prop in classdef.props" @click="toggleDesc(prop.name)">
          <div v-if="hasChild">
            <detail v-if="getDesc(prop.name)" :key="prop.key" :label="prop.name" :kind="prop.kind" :parent="prop.kind" :description="(false) ? prop.desc : false" :tabtype="classdef.kind"></detail>
          </div>
        </div>
      </div>
    </div>
  `,
  //           <descript v-if="showDesc" v-text="prop.desc"></descript>
  methods: {
    toggleChild: function() {
      console.log(this.hasChild + ' is child');
      this.hasChild = !this.hasChild;
    },
    toggleDesc: function(name) {
      console.log(this.showDesc[name]);
      if (typeof this.showDesc[name] === 'undefined') {
        this.showDesc[name] = false;
      }
      this.showDesc[name] = !this.showDesc[name];
      console.log(this.showDesc);
    },
    getDesc: function(name) {
      console.log(this.showDesc[name]);
      if (typeof this.showDesc[name] === 'undefined') {
        this.showDesc[name] = false;
      }
      console.log(name + ' result is ' + this.showDesc[name]);
      // return this.showDesc[name]
      return true;
    }
  },
  computed : {
    // testComp() {
    //   if
    //   return false;
    // },
    allDesc() {
      var res = [];
      for (var count = 0; count < this.omv.testClass.props.length; count++) {
        var target = this.omv.testClass.props[count].name;
        console.log(target + ' is name');
        this.showDesc[target] = false;
      }
      console.log(this.showDesc);
      return 'booting';
    }
  },
  mounted() {
    console.log(this.allDesc);
  },
  data() {
    return {
      showDesc: {},
      hasChild: false,
      thisChild: '',
      // omv : xdom
      omv : testDOM
    }
  }
})

Vue.component('classdef', {
  props: ['label', 'kind'],
  template: `
  <div class="slot" @mouseover="hoverThis(kind)" @mouseout="returnThis(kind)">
    <div class="slot-prefix">
      <div :class="'xtag-' + kind">{{kind.charAt(0)}}</div>
      <div class="xtype" v-text="kind"></div>
      <div class="xdesc"> {{ label }} </div>
    </div>
    <div class="slot-suffix">
      <div class="xpreview"></div>
      <div class="xetc">...</div>
      <div class="xpath">
        <span class="adobe-icon-angleDown"></span>
      </div>
    </div>
  </div>
  `,
  methods : {
    hoverThis : function(kind) {
      changeCSSVar('colorTag' + kind, 1)
    },
    returnThis : function(kind) {
      changeCSSVar('colorTag' + kind, 0.5)
    },
  },
  data() {
    return {
      showDetails : true,
    }
  }
})

Vue.component('childProps', {
  // props:['propList'],
  template: `
    <div class="xdetail">
      <slot></slot>
    </div>
  `,
  data() {
    return {
      // propList : testDOM.testClass.props,
      // showDesc : false,
    }
  },
  computed: {
    // propList() {
    //   return testDOM.testClass.props[0];
    // }
  },
  // methods: {
  //   toggleDesc: function() {
  //     console.log(this.showDesc);
  //     this.showDesc = !this.showDesc;
  //   }
  // },
})

Vue.component('descript', {
  template: `
    <div class="xdesc">
      <span>Hello</span>
    </div>
  `,
  methods: {

  },
  data() {
    return {

    }
  }
})

Vue.component('detail', {
  props: ['kind', 'label', 'description', 'parent', 'tabtype'],
  template: `
    <div class="in-slot">
      <div class="slot-prefix">
        <div :class="'xtab-' + tabtype"></div>
        <div :class="'xtag-' + kind">{{kind.charAt(0)}}</div>
        <div class="xtype" v-text="parent"></div>
        <div class="xdesc">{{label}}</div>
      </div>
      <div class="slot-suffix">
        <div class="xpreview"></div>
        <div class="xpath">
          <span class="adobe-icon-angleDown"></span>
        </div>
      </div>
      <div v-if="description" class="xdetail">
        <div :class="'xtab-' + tabtype"></div>
        <div :class="'xtab-' + kind"></div>
        <div :class="'xprev-' + kind">{{description}}</div>
      </div>
    </div>
  `,
  data() {
    return {

    }
  }
})


var src = new Vue({
  el: '#app',
  data : {
    // OMV : xdom,
    OMV : testDOM
  },
  mounted: function () {
    this.$nextTick(function () {
      for (let [key, value] of Object.entries(this.OMV)) {
        // console.log(this.OMV[key].name);
      }
    })
  },
  computed : {

  },
  methods : {

  },
});



// source['classdef'] = xpath.select("//classdef", source.package);
// source.classdef = new dom().parseFromString(source.classdef[0].toString());
// source['elements'] = xpath.select("//elements", source.classdef);
// source.elements = new dom().parseFromString(source.elements[0].toString());
// source['props'] = xpath.select("//property", source.elements);


// function clearObjectValues(objToClear) {
//   Object.keys(objToClear).forEach((param) => {
//     if ( (objToClear[param]).toString() === "[object Object]" ) {
//       clearObjectValues(objToClear[param]);
//     } else {
//       objToClear[param] = undefined;
//     }
//   })
//   return objToClear;
// };
// // console.log(source);
// // console.log(source.xml);
// // console.log(`${source.props.length} props`);
//
// source['data'] = [];
// // setClassDefs(source.package)
// for (var i = 0; i < source.props.length; i++) {
//   // console.log();
//   // source.data.push(setAttrs(source.props[i]));
//   // source.data.push(setClassDefs(source.props[i]))
// }
// // console.log(source);
//
//
// function setClassDefs(source) {
//   var mirror = {};
//   var str = source.toString();
//   // console.log(source);
//   var target = source;
//   // var target = source.documentElement.childNodes[1];
//   for (var e = 0; e < target.attributes.length; e++)
//     mirror[target.attributes[e].name] = target.attributes[e].value;
//
//   console.log(target);
//
//   console.log(target.childNodes[0]);
//   // if (target.childNodes[0] instanceof Text)
//   if (typeof target.childNodes[0] === 'Text')
//     console.log("Has an element");
//   else {
//     console.log("Is not an element");
//   }
//   // for (var a = 0; a < target.childNodes.length; a++) {
//   //
//   //
//   // }
//
//
//     // mirror[target.attributes[e].name] = target.attributes[e].value;
//   mirror['children'] = setAttrs(source);
//
//   // console.log(source.documentElement.childNodes[1]);
//   // mirror[source.documentElement.childNodes[1].name] = source.documentElement.childNodes[1].value;
//   if (/<shortdesc>[\s\S]*?<\/shortdesc>/gm.test(str)) {
//     var desc = str.match(/<shortdesc>[\s\S]*?(?=<\/shortdesc>)/gm);
//     mirror.desc = strReplace(desc[0], '<shortdesc>');
//   }
//   if (/<classdef>[\s\S]*?<\/classdef>/gm.test(str)) {
//     console.log('yes');
//     // var desc = str.match(/<shortdesc>[\s\S]*?(?=<\/shortdesc>)/gm);
//     // mirror.desc = strReplace(desc[0], '<shortdesc>');
//     // console.log(desc);
//   }
//   console.log(mirror);
//   return mirror;
// }
//
//
// function setAttrs(source) {
//   var mirror = {};
//   var str = source.toString();
//   if (/<shortdesc>[\s\S]*?<\/shortdesc>/gm.test(str)) {
//     var desc = str.match(/<shortdesc>[\s\S]*?(?=<\/shortdesc>)/gm);
//     mirror.desc = strReplace(desc[0], '<shortdesc>')
//     // console.log(desc);
//   }
//   try {
//     for (var e = 0; e < source.attributes.length; e++) {
//       mirror[source.attributes[e].name] = source.attributes[e].value;
//       // console.log(source.localName + ' has ' + source.attributes[e].name  + ' with ' + source.attributes[e].value);
//     }
//   } catch(e) {
//     mirror = false
//   }
//   // console.log(mirror);
//   return mirror;
// }
//
// // console.log(source.classdef[0].localName + ": " + source.classdef[0].firstChild.data)
// // console.log("Node: " + source.package[0].toString())
// // console.log(source.classdef[0]);
