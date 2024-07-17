import styles from "./MapSelector.module.css";

export const MapSelector = ({ selectedMap, handleMapChange, maps }) => {
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
