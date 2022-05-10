const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const PORT = process.env.PORT || 3000;
const fs = require("fs");

const website = "https://www.nytimes.com/";

try {
  axios(website).then((res) => {
    const data = res.data;
    const cher = cheerio.load(data);

    const content = [];

    cher(".story-wrapper", data).each(function () {
      const title = cher(this).find("h3").text();
      const url = cher(this).find("a").attr("href");

      content.push({
        title,
        url,
      });

      app.get("/", (req, res) => {
        res.json(content);
      });
    });
    const jsonContent = JSON.stringify(content);
    fs.writeFile("./data.json", jsonContent, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(PORT);
