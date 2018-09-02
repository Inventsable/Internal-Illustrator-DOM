dispatchEvent('mighty.start', extFolder())
loadUniversalJSXLibraries();
var csInterface = new CSInterface();
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);

// As a class
window.Event = new class {
  constructor() {
    this.vue = new Vue()
  }
  fire(event, data = null) {
    this.vue.$emit(event, data);
  }
  listen(event, callback) {
    this.vue.$on(event, callback);
  }
}

var xpath = require('xpath')
  , dom = require('xmldom').DOMParser

// var xml = "<book><title>Harry Potter</title></book>"
// var doc = new dom().parseFromString(xml)
// var nodes = xpath.select("//title", doc)
//
// console.log(nodes[0].localName + ": " + nodes[0].firstChild.data)
// console.log("Node: " + nodes[0].toString())


Vue.component('adobe-toolbar', {
  template : `
  <div class="adobe-toolbar">
    <slot></slot>
  </div>
  `,
})

Vue.component('adobe-btn', {
  props: ['icon', 'click-func'],
  template : `
  <div :class="'adobe-btn'" v-on:click="showDoc">
    <span :class="'adobe-icon-' + icon"></span>
  </div>
  `,
  data : function(){
    return {
      self : this,
      xml : '<book><title>Harry Potter</title></book>',
      dock : self.xml,
      // doc : new dom().parseFromString(this.test.xml),
      // nodes : xpath.select("//property", this.test.doc),
      // firstOne : this.test.nodes[0].localName + ": " + this.test.nodes[0].firstChild.data,
      // total : this.test.nodes[0],
    }
  },
  methods: {
    showAlert() {
      console.log(readFile);
    },
    showDoc() {
      console.log(this.xml);
    },
  },
  computed: {
    readFile : function() {
      // var str = csInterface.getSystemPath(SystemPath.EXTENSION);
      // var parent = str.substring(str.lastIndexOf('/') + 1, str.length);
      var parent = 'hello';
        // var xmlFile = window.cep.fs.readFile(parent + '/client/ILSTlib22.xml');
      return parent;
    },
  }
})

Vue.component('adobe-toolbar-divider', {
  template : `
    <div class="adobe-toolbar-divider"></div>
  `,
})


var app = new Vue({
  el: '#app',
  data: {
  },
  created() {
    Event.listen('input', function(e) {
       alert('Handling ' + e)
     });
  },
});
