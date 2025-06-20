import { useState, useMemo } from "react";
import { IoSearch, IoChevronDown, IoChevronUp } from "react-icons/io5";
import style from "../styles/FilterSection.module.css"; 
import InputField from "./UI-Components/InputField";
import CheckboxField from "./UI-Components/CheckboxFeild";

const FilterSection = ({
  title,
  items = [],
  searchTerm,
  setSearchTerm,
  selectedItems = [],
  onChange,
  showAll,
  setShowAll,
  maxItems = 6,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  return (
    <div className={style.filterGroup}>
      <div
        className={style.accordionHeader}
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        aria-expanded={isOpen}
      >
        <div>{title}</div>
        {isOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
      </div>
      {isOpen && (
        <>
          <InputField
            type="text"
            placeholder={`Search ${title}`}
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={`Search ${title}`}
            id={`search-${title.toLowerCase()}`}
            icon={<IoSearch size={20} color="var(--gray-medium)" />}
          />
          <div className={style.checkboxGroup}>
            {filteredItems.length > 0 ? (
              filteredItems
                .slice(0, showAll ? filteredItems.length : maxItems)
                .map((item) => (
                  <div key={item.name} className={style.checkboxItem}>
                    <CheckboxField
                      size="small"
                      value={item.name}
                      onChange={() => onChange(item.name)}
                      checked={selectedItems.includes(item.name)}
                      aria-label={`${title}: ${item.name}`}
                      id={`checkbox-${title.toLowerCase()}-${item.name}`}
                    />
                    <label
                      htmlFor={`checkbox-${title.toLowerCase()}-${item.name}`}
                    >
                      {item.name}
                    </label>
                  </div>
                ))
            ) : (
              <p>No {title.toLowerCase()} available</p>
            )}
            {filteredItems.length > maxItems && (
              <button
                onClick={() => setShowAll(!showAll)}
                className={style.linkButton}
                aria-expanded={showAll}
              >
                {showAll
                  ? "Show Less"
                  : `${filteredItems.length - maxItems} MORE`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSection;
