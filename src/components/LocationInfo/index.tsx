import React from "react";
import { SvgPerson } from "../svg";
import styles from "./LocationInfo.module.css";

interface Location {
  name: string;
  description?: string;
}

interface LocationInfoProps {
  selectedLocation: Location | null;
  shortDescription: string;
  showFullDescription: boolean;
  setShowFullDescription: (show: boolean) => void;
  maxLength: number;
  steps: string[];
  totalWalkingTime: number;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({
  selectedLocation,
  shortDescription,
  showFullDescription,
  setShowFullDescription,
  maxLength,
  steps,
  totalWalkingTime,
}) => {
  console.log('steps', steps)
  return (
    <div className={styles.containen_location_info}>
      {steps.length < 1 && selectedLocation && (
        <div>
          <h3>{selectedLocation.name}</h3>
          <p>
            {shortDescription}
            {selectedLocation.description &&
              selectedLocation.description.length > maxLength && (
                <span
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  style={{
                    color: "rgb(27, 146, 237)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginLeft: "0.5rem",
                  }}
                >
                  {showFullDescription ? "Show Less" : "...Show More"}
                </span>
              )}
          </p>
        </div>
      )}
      <div className={styles.container_step_by_step}>
        {steps.length > 0 && <h3>Step by Step</h3>}
        {steps.map((step, index) => (
          <p key={index}>{step}</p>
        ))}
        {steps.length > 0 && (
          <div className={styles.steps_time}>
            <div className={styles.container_step_by_step}>
              <p>Time to destination</p>
              <div>
                <SvgPerson />
                <span>{totalWalkingTime} minutes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
