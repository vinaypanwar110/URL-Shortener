const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
require("dotenv").config();
const app = express();

// mongoose.connect("mongodb://localhost/urlShortener");

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) {
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.post("/deleteUrl/:id", async (req, res) => {
  await ShortUrl.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

const PORT = (process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
