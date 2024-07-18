import React from 'react';
import styles from "./MapSelector.module.css";

interface MapSelectorProps {
  selectedMap: string;
  handleMapChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const MapSelector: React.FC<MapSelectorProps> = ({ selectedMap, handleMapChange }) => {
  return (
    <div className={styles.map_selector_container}>
      <select
        aria-label="Select map"
        className={styles.map_selector}
        value={selectedMap}
        onChange={handleMapChange}
      >
        <option value="Lower Level">Planta Baja</option>
        <option value="Upper Level">Planta Superior</option>
      </select>
    </div>
  );
};