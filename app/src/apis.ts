import { SumsubWebhook } from "wasp/server/api";
import { checkDigest } from "./server/actions"


export const sumsubWebhook: SumsubWebhook = async (req, res, context) => {
  try {
    if (!checkDigest(req)) {
      return res.status(401).json({ msg: "Invalid digest" });
    }
    //Log that a request was received
    console.log("sumsun req");

    // Log the request body to the console
    console.log(req.body);

    // Extract relevant data from the request body
    const {
      externalUserId,
      reviewResult: { reviewAnswer }
    } = req.body;

    // Check if reviewAnswer is GREEN
    if (reviewAnswer === 'GREEN') {
      const data = { isSumsubVerified: true };
      const updatedUser = await context.entities.User.update({
        where: {
          id: Number(externalUserId),
        },
        data,
      });
    }

    // Set CORS headers to allow requests from any origin
    res.set("Access-Control-Allow-Origin", "*");

    // Respond with a JSON message indicating success
    res.json({ msg: `1`, status: 'success' });

  } catch (error) {
    console.error("Error handling Sumsub webhook:", error);

    // Respond with a JSON message indicating an error
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
}