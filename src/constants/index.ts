import { TGetVenueOptions } from "@mappedin/mappedin-js";

export const options: TGetVenueOptions = {
  venue: "mappedin-demo-mall",
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
}

export const walkingSpeed = 1.4;