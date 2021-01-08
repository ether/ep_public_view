const eejs = require('ep_etherpad-lite/node/eejs/');
const padManager = require('ep_etherpad-lite/node/db/PadManager');
const ERR = require('ep_etherpad-lite/node_modules/async-stacktrace');
const async = require('ep_etherpad-lite/node_modules/async');
const db = require('ep_etherpad-lite/node/db/DB').db;
const express = require('ep_etherpad-lite/node_modules/express');

db.dbSettings.cache = 0;

exports.expressConfigure = function (hook_name, args, cb) {
};

exports.expressServer = function (hook_name, args, cb) {
  args.app.get('/public/:padId(*)', (req, res) => {
    const padId = req.params.padId.replace(/\.\./g, '').split('?')[0];
    let title;

    // ep_set_title_on_pad exposes this database value, let's see if we have it.
    db.get(`title:${padId}`, (err, dbTitle) => {
      if (dbTitle) {
        title = dbTitle;
      }
    });

    let pad;
    async.series([
      function (callback) { // Get the pad Text
        const padText = padManager.getPad(padId, (err, _pad) => {
          pad = _pad;

          db.getSub(`pad:${padId}:revs:${pad.head}`, ['meta', 'timestamp'], (err, timestamp) => {
            pad.timestamp = timestamp;
          });

          text = safe_tags(pad.text()).replace(/\n/g, '<br/>');
          ERR(err);
          callback();
        });
      },

      function (callback) { // Append the pad Text to the Body
        /* Why don't we use EEJS require here?  Well EEJS require isn't ASYNC so on first load
        it would bring in the .ejs content only and then on second load pad contents would be included..
        Sorry this is ugly but that's how the plugin FW was designed by @redhog -- bug him for a fix! */
        args.content = '<html><head>';
        if (title) args.content += `<title>${title}</title>`;
        args.content += '</head><body>';
        args.content += '<style>body{font-family:arial;font-size:14px;margin-top:20px;max-width:800px;margin-left:auto;margin-right:auto;}#editLink{float:right;font-weight:bold;margin-top:20px;}</style>';
        args.content += `<div id='padContents'>${text}</div>`;
        args.content += `<div id='editLink'><a href='/p/${padId}'>Edit this pad</a></div>`;
        args.content += '</body></html>';
        res.setHeader('Last-Modified', (new Date(pad.timestamp)).toUTCString());
        res.send(args.content);
        callback();
      },
    ]);
  });
};


function safe_tags(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
