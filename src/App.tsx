import { useState, useMemo, useEffect, useCallback } from "react";
import {
  E_SDK_EVENT,
  Mappedin,
  MappedinLocation,
  MappedinPolygon,
  TGetVenueOptions,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import "./App.css";
import { useMapView } from "./hooks/useMapView";
import { useOfflineSearch } from "./hooks/useOfflineSearch";
import { useSelectedLocation } from "./hooks/useSelectedLocation";
import { useVenue } from "./hooks/useVenue";
import { useMapClickHandler } from "./hooks/useMapClickHandler";
// components
import { MostPopular } from "./components/MostPopular";
import { SearchBar } from "./components/SearchBar";
import { CategorySection } from "./components/CategorySection";
import { SearchSection } from "./components/SearchSection";
import { MapSelector } from "./components/MapSelector";
import { LocationInfo } from "./components/LocationInfo";
// constants
import { options, walkingSpeed } from "./constants";
// utils
import { calculateWalkingTime, resetAllThings, handleMapChange } from "./utils";

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [departure, setDeparture] = useState<MappedinPolygon | null>(null);
  const [destination, setDestination] = useState<MappedinPolygon | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedMap, setSelectedMap] = useState("Planta Baja");
  const [steps, setSteps] = useState<string[]>([]);
  const [showCategorySection, setShowCategorySection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSearchSection, setShowSearchSection] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [totalWalkingTime, setTotalWalkingTime] = useState(0);

  useEffect(() => {
    if (!departure || !destination) {
      setSteps([]);
      setTotalWalkingTime(0);
      return;
    }

    const directions = departure.directionsTo(destination);

    let totalDistance = 0;
    const newSteps = directions.instructions.map((step) => {
      const distanceInMeters = Math.round(step.distance);
      totalDistance += distanceInMeters;

      return (
        <div>
          <p>{step.instruction}</p>
          <small>{distanceInMeters} meters</small>
        </div>
      );
    });
    setSteps(newSteps);
    setTotalWalkingTime(calculateWalkingTime(totalDistance, walkingSpeed));
  }, [departure, destination]);

  const venue = useVenue(options);
  useEffect(() => {});
  const { elementRef, mapView } = useMapView(venue, {
    multiBufferRendering: true,
    antialiasQuality: "high",
    outdoorView: {
      enabled: true,
    },
    shadingAndOutlines: true,
  });

  const topLocations = venue?.venue.topLocations;

  const { selectedLocation, setSelectedLocation } =
    useSelectedLocation(mapView);
  const results = useOfflineSearch(venue, searchQuery);
  const searchResults = useMemo(
    () =>
      results
        .filter((result) => result.type === "MappedinLocation")
        .map((result) => result.object),
    [results]
  );

  const resetAllThings = useCallback(() => {
    if (!mapView) return;

    setDeparture(null);
    setDestination(null);
    mapView.Journey.clear();
    mapView.clearAllPolygonColors();
    setSelectedLocation(null);
  }, [mapView]);

  const handleMapClick = useMapClickHandler(
    mapView,
    departure,
    setDeparture,
    destination,
    setDestination,
    resetAllThings
  );

  const handleMapChange = useCallback(
    async (event) => {
      const selectedOption = event.target.value;
      setSelectedMap(selectedOption);

      if (!mapView) return;

      const selectedMapObj = venue?.maps.find(
        (map) => map.name === selectedOption
      );
      if (selectedMapObj) {
        try {
          await mapView.setMap(selectedMapObj);
        } catch (error) {
          console.error("Error al cambiar el mapa:", error);
        }
      } else {
        console.warn(
          `No se encontró un mapa con el nombre "${selectedOption}"`
        );
      }
    },
    [mapView, venue]
  );

  useEffect(() => {
    if (!mapView) return;

    mapView.on(E_SDK_EVENT.CLICK, handleMapClick);
    mapView.addInteractivePolygonsForAllLocations();
    mapView.FloatingLabels.labelAllLocations();

    return () => {
      mapView.off(E_SDK_EVENT.CLICK, handleMapClick);
    };
  }, [mapView, handleMapClick]);

  if (!venue) {
    return <div>Loading...</div>;
  }

  const handleCategoryClick = () => {
    setShowCategorySection(!showCategorySection);
    setShowSearchSection(false);
    setInputFocused(false);
    setSelectedLocation(null);
  };

  const handleInputFocus = () => {
    setShowSearchSection(true);
    setShowCategorySection(false);
    setInputFocused(true);
    setSelectedLocation(null);
  };

  const handleCancelClick = () => {
    setShowSearchSection(false);
    setShowCategorySection(false);
    setInputFocused(false);
    setSearchQuery("");
  };

  const handleArrowClick = () => {
    setShowSearchSection(false);
    setShowCategorySection(false);
    setInputFocused(false);
  };

  console.log("venue structure:", venue);

  const maxLength = 100;
  const description = selectedLocation?.description || "";
  const shortDescription = showFullDescription
    ? description
    : description?.substring(0, maxLength);

  const handleClickInput = (event) => {
    alert("click in input");
  };

  return (
    <>
      <div
        style={{ height: "100%", width: "100%", position: "absolute" }}
        ref={elementRef}
      ></div>
      {/* modal contenedor informacion */}
      <div
        role="main"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "flex-start",
          maxWidth: "100%",
        }}
      >
        <div></div>
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "auto",
            zIndex: "1",
            margin: "1rem",
            maxHeight: "calc(100% - 2rem)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              height: "auto",
              maxHeight: "80vh",
              position: "relative",
              width: "100%",
              willChange: "transform",
              zIndex: "1",
            }}
          >
            <div style={{ height: "100%", position: "relative" }}>
              <div
                style={{
                  color: "rgb(0, 0, 0)",
                  display: "flex",
                  flexDirection: "column",
                  flex: "1 1 auto",
                  zIndex: "3",
                  borderRadius: "1.5rem",
                  backgroundColor: "rgb(255, 255, 255)",
                  boxShadow: "rgba(83, 83, 83, 0.15) 0px 4px 100px 10px",
                  padding: "1rem",
                  height: "100%",
                  width: "100%",
                  maxWidth: "350px",
                  maxHeight: "80vh",
                  overflow: "auto",
                  pointerEvents: "all",
                  position: "relative",
                }}
              >
                <div style={{ width: "100%", height: "44px" }}>
                  <div
                    style={{
                      opacity: "1",
                      zIndex: "1",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    {/* Search bar */}
                    <SearchBar
                      inputClick={handleClickInput}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      inputFocused={inputFocused}
                      handleInputFocus={handleInputFocus}
                      handleCancelClick={handleCancelClick}
                      handleArrowClick={handleArrowClick}
                      handleCategoryClick={handleCategoryClick}
                      showCategorySection={showCategorySection}
                    />
                    <div />
                  </div>
                </div>
                <MostPopular locations={topLocations} />
                {/* Seccion de categorias */}
                {showCategorySection && (
                  <CategorySection
                    categories={venue.categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    mapView={mapView}
                  />
                )}
                {/* Seccion de busqueda */}
                {showSearchSection && (
                  <SearchSection
                    searchResults={searchResults}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    setSelectedLocation={setSelectedLocation}
                    mapView={mapView}
                    departure={departure}
                    destination={destination}
                  />
                )}
                {/* Contenedor informacion lugar */}
                {selectedLocation &&
                  !showSearchSection &&
                  !showCategorySection && (
                    <LocationInfo
                      selectedLocation={selectedLocation}
                      shortDescription={shortDescription}
                      showFullDescription={showFullDescription}
                      setShowFullDescription={setShowFullDescription}
                      maxLength={maxLength}
                      steps={steps}
                      totalWalkingTime={totalWalkingTime}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
        <MapSelector
          selectedMap={selectedMap}
          handleMapChange={handleMapChange}
          maps={venue.maps}
        />
      </div>
    </>
  );
}

export default App;
