const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// instantiate an express app
const app = express();
// cors
app.use(cors({ origin: "*" }));

app.use("/public", express.static(process.cwd() + "/public")); //make public static

const transporter = nodemailer.createTransport({
  host: process.env.EMAILHOST,
  port: process.env.EMAILPORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: "abraham@propulsar.com", // receiver email,
      subject: "Nuevo contacto en web",
      text: `${data.name} <${data.email}> \n${data.categoria} \n${data.message}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});

app.post("/send-newsletter", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      sender: `Web Propulsar`,
      to: "abraham@propulsar.com", // receiver email,
      subject: "Nuevo suscriptor al newsletter",
      text: `Correo: ${data.correo}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
