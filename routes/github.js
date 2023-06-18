const express = require('express');
const crypto = require('crypto');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const verifySignature = (req) => {
  const signature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");
  return `sha256=${signature}` === req.headers.get("x-hub-signature-256");
};

const router = express.Router();

/* POST github webhook. */
router.post('/webhook', function(req, res) {
  if (!verifySignature(req)) {
    res.status(401).send("Unauthorized");
    return;
  }
  res.status(200);
});

module.exports = router;
