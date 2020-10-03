
const express = require("express");
const multer = require("multer");
const zlib = require("zlib");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

var app = express();

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post("/compress", upload.single("file"), async (req, res) => {
  try {
    if (!fs.existsSync("compressed")) {
      fs.mkdirSync("compressed");
    }

    const destination = `compressed/${req.file.originalname}.gz`;
    let buffer = req.file.buffer;

    await zlib.gzip(buffer, (err, response) => {
      if (err) {
        console.log(err);
      }

      fs.writeFile(path.join(__dirname, destination), response, (err, data) => {
        if (err) {
          console.log(err);
        }
        res.download(path.join(__dirname, destination), function (err) {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(
    `Server application is runnuing on host ${process.env.SERVER_HOST} port ${process.env.SERVER_PORT}`
  );
});
