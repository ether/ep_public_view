   var eejs = require('ep_etherpad-lite/node/eejs/'),
 padManager = require('ep_etherpad-lite/node/db/PadManager'),
        ERR = require("ep_etherpad-lite/node_modules/async-stacktrace"),
      async = require('ep_etherpad-lite/node_modules/async'),
    express = require('ep_etherpad-lite/node_modules/express');

exports.expressConfigure = function(hook_name, args, cb) {
}

exports.expressServer = function (hook_name, args, cb) {
  args.app.get('/public/:padId(*)', function(req, res) { 
    var padId = req.params.padId.replace(/\.\./g, '').split("?")[0];

    var pad;
    async.series([
      function(callback){ // Get the pad Text
        var padText = padManager.getPad(padId, function(err, _pad){
           console.warn(_pad);
          pad = _pad;
          text = safe_tags(pad.text()).replace(/\n/g,"<br/>");
          ERR(err);
          callback();
        });
      },

      function(callback){ // Append the pad Text to the Body

        /* Why don't we use EEJS require here?  Well EEJS require isn't ASYNC so on first load
        it would bring in the .ejs content only and then on second load pad contents would be included..
        Sorry this is ugly but that's how the plugin FW was designed by @redhog -- bug him for a fix! */

        args.content = "<html><body>";
        args.content += "<style>body{font-family:arial;font-size:14px;margin-top:20px;max-width:800px;margin-left:auto;margin-right:auto;}#editLink{float:right;font-weight:bold;margin-top:20px;}</style>";
        args.content += "<div id='padContents'>"+text+"</div>";
        args.content += "<div id='editLink'><a href='/p/"+padId+"'>Edit this pad</a></div>";
        args.content += "</body></html>";
        res.send(args.content);
        callback();
      },
    ]);
  });
}


function safe_tags(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}
