import { SumsubWebhook } from "wasp/server/api";

export const sumsubWebhook: SumsubWebhook = (req, res, context) => {
  // Extract data from the request body
  console.log("sumsun req");
  console.log(req.body);

  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");

  // Respond with a JSON message
  res.json({ msg: `Hello, ${req.body || "stranger"}!` });
}