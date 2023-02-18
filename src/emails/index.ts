import nodemailer from "nodemailer";
import { buildSendMail } from "mailing-core";

const transport = nodemailer.createTransport({
  pool: true,
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: "EventLite <accounts@eventlite.org>",
  configPath: "./mailing.config.json",
});

export default sendMail;
