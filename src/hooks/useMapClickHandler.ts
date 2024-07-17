import { CAMERA_EASING_MODE, Mappedin, MappedinMap, MappedinPolygon } from "@mappedin/mappedin-js";
import { useCallback } from "react";

export const useMapClickHandler = (
  mapView: MappedinMap | null,
  departure: MappedinPolygon | null,
  setDeparture: (polygon: MappedinPolygon | null) => void,
  destination: MappedinPolygon | null,
  setDestination: (polygon: MappedinPolygon | null) => void,
  resetAllThings: () => void
) => {
  return useCallback(({ polygons }: { polygons: MappedinPolygon[] }) => {
    if (!mapView || polygons.length === 0) {
      resetAllThings();
      return;
    }

    const clickedPolygon = polygons[0];

    if (!departure) {
      setDeparture(clickedPolygon);
      mapView.setPolygonColor(clickedPolygon, "red");
    } else if (!destination && clickedPolygon !== departure) {
      setDestination(clickedPolygon);
      mapView.setPolygonColor(clickedPolygon, "blue");

      const directions = departure.directionsTo(clickedPolygon);

      // const newSteps = directions.instructions

      mapView.Journey.draw(directions);
      mapView.Camera.focusOn(
        {
          nodes: directions.path,
          polygons: [departure, clickedPolygon]
        },
        {
          minZoom: 2000,
          duration: 1000,
          easing: CAMERA_EASING_MODE.EASE_IN_OUT
        }
      );
    } else {
      resetAllThings();
    }
  }, [mapView, departure, destination, setDeparture, setDestination, resetAllThings]);
};