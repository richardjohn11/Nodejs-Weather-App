const geocode = require("../utils/geocode");
const forecast = require("../utils/forecast");
const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Chad"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About"
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "You must provide an address" });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("*", (req, res) => {
  res.render("404", { title: "404 Page not Found" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
