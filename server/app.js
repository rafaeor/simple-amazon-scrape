import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { getInfo } from "./getAmazonInfo.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

//Use express to get the data from post in json
app.use(express.json());
//Allow the index.html to send the content using forms
app.use(express.urlencoded({ extended: false }));

// Here we're sending the index.html using express
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});
app.post("/", function (request, respond) {
  getInfo(request.body.keyword).then((data) => {
    respond.json(data);
  });
});
app.listen(port);
console.log("Server started at http://localhost:" + port);
