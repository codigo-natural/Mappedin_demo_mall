import React from "react";

import styles from "./CategoryList.module.css";
import { MappedinCategory, MappedinLocation } from "@mappedin/mappedin-js";

interface CategoryListProps {
  categories: MappedinCategory[];
  onCategorySelect: (category: MappedinCategory) => void;
  onLocationSelect: (location: MappedinLocation) => void;
  selectedCategory: MappedinCategory | null;
  onBackClick: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategorySelect,
  onLocationSelect,
  selectedCategory,
  onBackClick,
}) => {
  if (selectedCategory) {
    return (
      <div className={styles.categoryList}>
        <button onClick={onBackClick} className={styles.backButton}>
          ← Back to Categories
        </button>
        <h2>{selectedCategory.name}</h2>
        <ul>
          {selectedCategory.locations.map((location) => (
            <li
              className={styles.locationItem}
              key={location.id}
              onClick={() => onLocationSelect(location)}
            >
              <div>
                <div className={styles.items_location}>
                  <div className={styles.items_location_image}>
                    <img src={location.logo?.["66x66"]} alt="" />
                  </div>
                  <p>{location.name}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.categoryList}>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.name} onClick={() => onCategorySelect(category)}>
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
