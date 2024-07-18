import {
  CAMERA_EASING_MODE,
  E_SDK_EVENT,
  MappedinCategory,
  MappedinLocation,
  MappedinPolygon,
  STATE,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { CategoryList } from "./components/CategoryList";
import { LocationInfo } from "./components/LocationInfo";
import { MapSelector } from "./components/MapSelector";
// import { MostPopular } from "./components/MostPopular";
import { SearchBar } from "./components/SearchBar";
import { SearchSection } from "./components/SearchSection";
import { options, walkingSpeed } from "./constants";
import { useMapView } from "./hooks/useMapView";
import { useOfflineSearch } from "./hooks/useOfflineSearch";
import { useSelectedLocation } from "./hooks/useSelectedLocation";
import { useVenue } from "./hooks/useVenue";
import { calculateWalkingTime } from "./utils";

interface MapSelector {
  selectedMap: string[];
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => Promise<void>;
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departure, setDeparture] = useState<MappedinPolygon | null>(null);
  const [destination, setDestination] = useState<MappedinPolygon | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedMap, setSelectedMap] = useState("Planta Baja");
  const [steps, setSteps] = useState<string[]>([]);
  const [showCategorySection, setShowCategorySection] = useState(false);
  const [showSearchSection, setShowSearchSection] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [totalWalkingTime, setTotalWalkingTime] = useState(0);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<MappedinCategory | null>(null);
  const [categories, setCategories] = useState<MappedinCategory[]>([]);

  const venue = useVenue(options);

  useEffect(() => {
    if (venue) {
      const sortedCategories = [...venue.categories].sort((a, b) =>
        a.name && b.name ? (a.name > b.name ? 1 : -1) : 0
      );
      setCategories(sortedCategories);
    }
  }, [venue]);

  const { elementRef, mapView } = useMapView(venue, {
    multiBufferRendering: true,
    xRayPath: true,
    loadOptions: {
      outdoorGeometryLayers: [
        "__TEXT__",
        "__AUTO__BORDER__",
        "Base",
        "Void",
        "Outdoor Obstruction",
        "Water Feature",
        "Parking Below",
        "Landscape Below",
        "Sidewalk Below",
        "Details Below",
        "Landscape",
        "Sidewalk",
        "Entrance Arrows",
        "Parking Lot Standard",
        "Parking Icon",
        "OD Tree Base",
        "OD Tree Top",
      ],
    },
    outdoorView: {
      enabled: true,
    },
    shadingAndOutlines: true,
  });

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

  useEffect(() => {
    if (!mapView || !departure || !destination) {
      setSteps([]);
      setTotalWalkingTime(0);
      return;
    }

    const directions = departure.directionsTo(destination);

    mapView.Journey.draw(directions, {
      pathOptions: {
        color: "#fc0",
      },
    });

    mapView.Camera.focusOn(
      {
        nodes: directions.path,
        polygons: [departure, destination],
      },
      {
        minZoom: 2000,
        duration: 1000,
        easing: CAMERA_EASING_MODE.EASE_IN_OUT,
      }
    );

    let totalDistance = 0;
    const newSteps = directions.instructions.map(
      (step: { instruction: string; distance: number }) => {
        const distanceInMeters = Math.round(step.distance);
        totalDistance += distanceInMeters;

        return `${step.instruction} (${distanceInMeters} meters)`;
      }
    );
    console.log("new steps", newSteps);

    setSteps(newSteps);
    setTotalWalkingTime(
      Number(calculateWalkingTime(totalDistance, walkingSpeed))
    );
  }, [mapView, departure, destination]);

  useEffect(() => {
    if (!mapView) return;

    const handleMapClick = ({ polygons }: { polygons: MappedinPolygon[] }) => {
      if (polygons.length === 0) return;

      const clickedPolygon = polygons[0];

      if (!departure) {
        setDeparture(clickedPolygon);
        mapView.setPolygonColor(clickedPolygon, "red");
      } else if (!destination && clickedPolygon !== departure) {
        setDestination(clickedPolygon);
        mapView.setPolygonColor(clickedPolygon, "blue");
      } else {
        setDeparture(null);
        setDestination(null);
        mapView.Journey.clear();
        mapView.clearAllPolygonColors();
        setSelectedLocation(undefined);
      }
    };

    mapView.on(E_SDK_EVENT.CLICK, handleMapClick);
    mapView.addInteractivePolygonsForAllLocations();
    mapView.FloatingLabels.labelAllLocations();

    mapView.on(E_SDK_EVENT.CLICK, () => {
      // TODO - Use STACKED_MAPS_STATE.ZOOMED_IN when availabe
      if (mapView.state === STATE.STACKED) {
        mapView.StackedMaps.showOverview();
      }
    });

    return () => {
      mapView.off(E_SDK_EVENT.CLICK, handleMapClick);
    };
  }, [mapView, departure, destination, setSelectedLocation]);

  const handleMapChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
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
        console.warn(`No se encontró un mapa con el nombre ${selectedOption}`);
      }
    },
    [mapView, venue]
  );

  if (!venue) {
    return <div>Loading...</div>;
  }

  const handleCategoryClick = () => {
    setShowCategoryList(true);
    setShowCategorySection(false);
    setShowSearchSection(false);
    setSelectedCategory(null);
    // setSelectedLocation(undefined);
    // setInputFocused(false);
  };

  const handleCategorySelect = (category: MappedinCategory) => {
    setSelectedCategory(category);
  };

  const handleLocationSelect = (location: MappedinLocation) => {
    setSearchQuery(location.name);
    setShowCategoryList(false);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleInputFocus = () => {
    setShowSearchSection(true);
    setShowCategorySection(false);
    setInputFocused(true);
    setSelectedLocation(undefined);
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

  const maxLength = 100;
  const description = selectedLocation?.description || "";
  const shortDescription = showFullDescription
    ? description
    : description?.substring(0, maxLength);

  return (
    <>
      <div
        style={{ height: "100%", width: "100%", position: "absolute" }}
        ref={elementRef}
      ></div>
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
                    <SearchBar
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
                {showCategoryList && !showSearchSection && (
                  <CategoryList
                    categories={categories}
                    onCategorySelect={handleCategorySelect}
                    onLocationSelect={handleLocationSelect}
                    selectedCategory={selectedCategory}
                    onBackClick={handleBackToCategories}
                  />
                )}
                {/* <MostPopular
                  key="most-popular"
                  locations={
                    venue?.venue.topLocations as MappedinLocation[] | undefined
                  }
                /> */}
                {showSearchSection && (
                  <SearchSection
                    searchResults={searchResults.filter(
                      (result): result is MappedinLocation =>
                        result instanceof MappedinLocation
                    )}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    setSelectedLocation={setSelectedLocation}
                    mapView={mapView}
                    departure={departure}
                    destination={destination}
                  />
                )}
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
        />
      </div>
    </>
  );
}

export default App;
