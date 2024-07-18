import React from "react";
import { MappedinLocation, MappedinPolygon, MapView } from "@mappedin/mappedin-js";

interface SearchSectionProps {
  searchResults: MappedinLocation[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<MappedinLocation | undefined>
  >;
  mapView: MapView | undefined;
  departure: MappedinPolygon | null;
  destination: MappedinPolygon | null;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchResults,
  setSelectedLocation,
}) => {
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          willChange: "transform",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
          }}
        >
          {searchResults.map((location) => (
            <div
              key={location.id}
              style={{
                display: "flex",
                padding: "12px 0px",
                flexDirection: "row",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedLocation(location);
              }}
            >
              <div
                style={{
                  display: "flex",
                  // flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "2.25rem",
                    height: "2.25rem",
                    justifyContent: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={location.logo?.["66x66"]}
                    alt=""
                  />
                </div>
                <p
                  style={{
                    marginLeft: "1rem",
                    fontSize: "14px",
                    fontFamily: "SF-Pro-Medium, Inter-Medium",
                    letterSpacing: "0px",
                    lineHeight: "1.267em",
                    fontWeight: "500",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "0px",
                  }}
                >
                  {location.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
