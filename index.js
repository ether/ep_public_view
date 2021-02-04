'use strict';

const padManager = require('ep_etherpad-lite/node/db/PadManager');
const exporthtml = require('ep_etherpad-lite/node/utils/ExportHtml');
const db = require('ep_etherpad-lite/node/db/DB');

exports.expressServer = (hookName, args, cb) => {
  args.app.get('/public/:padId(*)', async (req, res) => {
    const padId = req.params.padId.replace(/\.\./g, '').split('?')[0];

    const pad = await padManager.getPad(padId);
    let html = await exporthtml.getPadHTMLDocument(padId);
    const meta = await db.getSub(`pad:${padId}:revs:${pad.head}`, ['meta']);

    const link = `/p/${padId}`;
    html += `<p><a title='Edit this pad' href='${link}'>Link to the Pad</a></p>`;

    res.setHeader('Last-Modified', (new Date(meta.timestamp)).toUTCString());
    res.send(html);
  });
  cb();
};
