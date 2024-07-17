import styles from "./categorySection.module.css";

export const CategorySection = ({
  categories,
  setSelectedCategory,
  setShowCategorySection,
}) => {
  return (
    <div className={styles.container}>
      <h3>Categoríes </h3>
      {categories.map((category) => (
        <div
          className={styles.category}
          key={category.id}
          onClick={() => {
            setSelectedCategory(category);
            setShowCategorySection(false);
          }}
        >
          <div className={styles.category_text}>
            <p>{category.name} </p>
            <ul>
              {category.lo}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
