// Weirdly this works on refresh but doesn't work on first load!

var eejs = require('ep_etherpad-lite/node/eejs/');
var padManager = require('ep_etherpad-lite/node/db/PadManager');
var ERR = require("ep_etherpad-lite/node_modules/async-stacktrace");
var async = require('ep_etherpad-lite/node_modules/async');

exports.eejsBlock_body = function (hook_name, args, cb) {

  var pad;

  async.series([

    function(callback){ // Get the pad Text
      var padText = padManager.getPad(args.renderContext.req.params.pad, function(err, _pad){
        console.warn("Got Pad Text", _pad.text());
        pad = _pad;
        ERR(err);
        callback();
      });
    },
  
    function(callback){ // Append the pad Text to the Body
      console.warn("adding pad text", pad.text());
      args.content = args.content + "<noscript>"+safe_tags(pad.text())+"</noscript>";
      callback();
    },

    function(callback){ // Return the callback to EEJS
      return cb();
      callback();
    }
  ]);

}




function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}
