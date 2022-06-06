// const Env = require("@ioc:Adonis/Core/Env");
const Env = require("@ioc:Adonis/Core/Env")
const accountSid = Env.get("TWILIO_ACCOUNT_SID");
const authToken = Env.get("TWILIO_AUTH_TOKEN");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
console.log(accountSid, authToken);
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+18309475829",
    to: "+2347033680599",
  })
  .then((message) => console.log(message.sid));
