const { MailtrapClient } = require("mailtrap");
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_API_TOKEN;
const ENDPOINT = "https://send.api.mailtrap.io/";

console.log(TOKEN, "mailtrap");

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Kalai",
};
