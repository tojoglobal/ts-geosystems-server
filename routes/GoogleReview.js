import express from "express";
import dotenv from "dotenv";
dotenv.config();

const GoogleReviewRoute = express.Router();

GoogleReviewRoute.get("/reviews", async (req, res) => {
  const { GOOGLE_API_KEY, PLACE_ID } = process.env;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();
    res.json(data.result.reviews || []);
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default GoogleReviewRoute;
