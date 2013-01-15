var eejs = require('ep_etherpad-lite/node/eejs/');
var padManager = require('ep_etherpad-lite/node/db/PadManager');
var ERR = require("ep_etherpad-lite/node_modules/async-stacktrace");

exports.eejsBlock_body = function (hook_name, args, cb) {
  var padText = padManager.getPad(args.renderContext.req.params.pad, function(err, pad)
  {
    ERR(err);
    args.content = args.content + "<noscript>"+safe_tags(pad.text())+"</noscript>";
    return cb();
  });
}

function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}
