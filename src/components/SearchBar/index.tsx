import { SvgArrowLeft, SvgCancel, SvgCategory, SvgSearch } from "../svg";
import styles from './SearchBar.module.css';

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  inputFocused,
  handleInputFocus,
  handleCancelClick,
  handleArrowClick,
  handleCategoryClick,
  showCategorySection,
}) => {
  return (
    <div role="search" className={styles.searchBar}>
      <div className={styles.iconContainer}>
        <div
          role="presentation"
          className={`${styles.iconPresentation} ${inputFocused || showCategorySection ? styles.hidden : ''}`}
        >
          <SvgSearch />
        </div>
        <div
          role="navigation"
          className={`${styles.iconPresentation} ${inputFocused || showCategorySection ? '' : styles.hidden}`}
        >
          <div role="button" className={styles.iconButton} onClick={handleArrowClick}>
            <SvgArrowLeft />
          </div>
        </div>
      </div>
      <input
        aria-autocomplete="both"
        aria-label="Buscar"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        spellCheck="false"
        className={styles.input}
        onFocus={handleInputFocus}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={styles.iconContainer}>
        <div
          role="presentation"
          className={`${styles.iconPresentation} ${inputFocused ? '' : styles.hidden}`}
        >
          <div role="button" className={styles.iconButton} onClick={handleCancelClick}>
            <SvgCancel />
          </div>
        </div>
        <div
          role="navigation"
          className={`${styles.iconPresentation} ${inputFocused ? styles.hidden : ''}`}
        >
          <div role="button" className={styles.iconButton} onClick={handleCategoryClick}>
            <SvgCategory />
          </div>
        </div>
      </div>
    </div>
  );
};
