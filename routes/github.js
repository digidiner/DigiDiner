const express = require('express');
const crypto = require('crypto');
const { execSync } = require("child_process");

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

const verifySignature = (req) => {
  const signature = crypto
    .createHmac("sha256", GITHUB_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");
  return `sha256=${signature}` === req.get("x-hub-signature-256");
};

const router = express.Router();

/* POST github webhook. */
router.post('/webhook', function(req, res) {
  if (!verifySignature(req)) {
    res.status(401).send("Unauthorized");
    return;
  }
  res.status(200).send("Webhook Accepted");
  execSync("git pull");
  exec("systemctl restart digidiner");
});

module.exports = router;
