// For ES6, set type: "module" in package.json.
import { SendMailClient } from "zeptomail";

// For CommonJS
var { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const token = "";

let client = new SendMailClient({ url, token });

client
  .sendMail({
    from: {
      address: "test@example.com",
      name: "test",
    },
    to: [
      {
        email_address: {
          address: "test1@example.com",
          name: "test1",
        },
      },
    ],
    reply_to: [
      {
        address: "test2@example.com",
        name: "test2",
      },
    ],
    subject: "Sending with ZeptoMail to have good experience",
    textbody: "Easy to do from anywhere, with  Node.js",
    htmlbody: "Easy to do from anywhere, with  Node.js",
    cc: [
      {
        email_address: {
          address: "test3@example.com",
          name: "test3",
        },
      },
    ],
    bcc: [
      {
        email_address: {
          address: "test4@example.com",
          name: "test4",
        },
      },
    ],
    track_clicks: true,
    track_opens: true,
    client_reference: "",
    mime_headers: {
      "X-Zylker-User": "test-xxxx",
    },
    attachments: [
      {
        content: "..x+SEXa3zKfnDnBA2qExtXikBpUAFABQAhGSPY/0IoAWgD/2Q==",
        mime_type: "image/jpg",
        name: "DM-welcome-guide",
      },
      {
        file_cache_key: "",
        name: "DM-reports",
      },
    ],
    inline_images: [
      {
        mime_type: "image/jpg",
        content: "...x+SEXa3zKfnDnBA2qExtXikBpUAFABQAhGSPY/0IoAWgD/2Q==",
        cid: "img-welcome-design",
      },
      {
        file_cache_key: "",
        cid: "img-CTA",
      },
    ],
  })
  .then((resp) => console.log("success"))
  .catch((error) => console.log("error"));
