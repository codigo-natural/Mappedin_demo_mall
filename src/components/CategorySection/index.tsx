import React, { useState } from "react";
import styles from "./categorySection.module.css";

interface Category {
  id?: string | number | null;
  name: string;
  locations: MappedinLocation[];
}

interface MappedinLocation {
  name: string;
}

interface CategorySectionProps {
  categories: Category[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  setShowCategorySection?: (show: boolean) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  setSelectedCategory,
  // setShowCategorySection,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | number | null
  >(null);

  // Ordena las categorías alfabéticamente
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleCategoryClick = (category: Category) => {
    if (selectedCategoryId === category.id) {
      // Si la categoría ya está seleccionada, la deseleccionamos
      setSelectedCategoryId(null);
      setSelectedCategory(null);
    } else {
      // Seleccionamos la nueva categoría
      setSelectedCategoryId(category.id ?? null);
      setSelectedCategory(category);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h3>Categorías</h3>
      </div>
      {sortedCategories.map((category) => (
        <div key={category.id} className={styles.categoryGroup}>
          <h4
            onClick={() => handleCategoryClick(category)}
            className={styles.categoryName}
          >
            {category.name}
          </h4>
          {selectedCategoryId === category.id && (
            <ul>
              {category.locations
                .map((location) => location.name)
                .sort((a, b) => a.localeCompare(b))
                .map((locationName, index) => (
                  <li key={index}>{locationName}</li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
