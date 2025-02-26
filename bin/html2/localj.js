// localj

"use strict";


var jdo1 = Module.cwrap('em_jdo','string',['string'])
//sets a noun using a string
var jsetstr = Module.cwrap('em_jsetstr','void',['string','string'])
//sets a noun using a Module._malloc'd pointer
var jsetstrPtr = Module.cwrap('em_jsetstr','void',['string','int'])
var jgetstr = Module.cwrap('em_jgetstr','string',['string'])

var localjserver = {
  send: function(cmd, show=false) {
    //don't execute blank links, instead just execute tcmreturn to reset state
    
    if (cmd.trim()=='') {
      tcmreturn('');
    } else {
      jsetstr('CODE_jrx_',cmd);
      var ret = jdo1("(0!:101) CODE_jrx_");

    //if show filter out the output_jrx_lines
    //else filter out the cmd from the output
    if (show) {
      let n = ret.indexOf("output_jrx_\n")
      ret = (n === -1) ? "" : ret.slice(12 + n);
    } else {
      ret = ret.replace(cmd, "");
      ret = ret.slice(1 + ret.indexOf("\n"));
     }

      //generate permalink so the user can copy the executed code
      genPermalink();

      if (ret.length>0) {
        tcmreturn('1'+ ret + '\n');
      } else {
        tcmreturn('');
      }

    }
  }
}

function genPermalink() {
  let bytes = new TextEncoder("utf-8").encode(ecmget());
  let base64 = btoa(String.fromCodePoint(...bytes));
  document.getElementById("mn_plink").childNodes[0].href = '#base64=' + base64;
}

function checkPermalink() {
  var code = decodeURIComponent(window.location.hash).substr(1);
  if (code.substring(0,7) == 'base64=') {
    let base64 = code.substr(7);
    let arr = Uint8Array.from(atob(base64), (b) => b.codePointAt(0));
    ecmset(new TextDecoder("utf-8").decode(arr));
  }
  else if (code.substring(0,5) == 'code=') {
    ecmset(code.substring(5));
  }
  else if (code.toLowerCase().substring(0,4) == 'url=') {
      let url = code.substring(4);
      console.log(url);
      fetch(url).then(response=>response.text()).then(data=>{
          ecmset(data);
      });
  }
}

