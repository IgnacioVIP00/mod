const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        "hello": "Hi"
    });
});

app.use("/.netlify/functions/api", router);

require("./index");

module.exports.handler = serverless(app);