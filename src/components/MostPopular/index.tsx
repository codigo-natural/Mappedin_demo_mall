import React from "react";
import { MappedinLocation } from "@mappedin/mappedin-js";
import { SvgFire } from "../svg";

interface MostPopularProps {
  locations: MappedinLocation[] | undefined;
}

export const MostPopular: React.FC<MostPopularProps> = ({ locations }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ marginBottom: "1em" }}>Top Locations</h3>
        <SvgFire />
      </div>
      <ul style={{ display: "flex", gap: "16px", listStyle: "none" }}>
        {locations?.map((location, index) => (
          <li key={index} style={{ marginBottom: "1em" }}>
            {location.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
