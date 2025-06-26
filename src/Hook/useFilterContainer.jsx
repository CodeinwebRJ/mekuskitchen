// src/hooks/useFilterContainer.js

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setPage,
  setCategories,
  setSubCategories,
  setProductCategories,
  setBrands,
  setRatings,
  setAttributes,
  resetFilters,
  setPrices,
} from "../../Store/Slice/FilterDataSlice";

export const useFilterContainer = ({
  categoryList = [],
  products = [],
  priceRange,
  handlePriceChange,
}) => {
  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.filterData);
  const { combinations } = useSelector((state) => state.product);

  // Local search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [searchProductCategory, setSearchProductCategory] = useState("");

  // Show all toggles
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [showAllProductCategories, setShowAllProductCategories] =
    useState(false);

  // Selected filters
  const [selectedBrands, setSelectedBrands] = useState(filterData.brands || []);
  const [selectedRatings, setSelectedRatings] = useState(
    filterData.ratings || []
  );
  const [selectedFilters, setSelectedFilters] = useState(
    filterData.attributes || {}
  );
  const [selectedCategories, setSelectedCategories] = useState(
    filterData.categories || []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    filterData.subCategories || []
  );
  const [selectedProductCategories, setSelectedProductCategories] = useState(
    filterData.productCategories || []
  );

  // Sync price range
  useEffect(() => {
    dispatch(setPrices(priceRange));
  }, [priceRange]);

  // Brands
  const brands = useMemo(() => {
    const unique = new Set(
      products?.data?.map((p) => p?.brand).filter(Boolean)
    );
    return [...unique];
  }, [products]);

  // Derived sub-categories and product categories
  const subCategoryList = useMemo(() => {
    if (!categoryList.length) return [];
    return selectedCategories.length
      ? categoryList
          .filter((c) => selectedCategories.includes(c.name))
          .flatMap((c) => c.subCategories || [])
      : categoryList.flatMap((c) => c.subCategories || []);
  }, [categoryList, selectedCategories]);

  const productCategoryList = useMemo(() => {
    return selectedSubCategories.length
      ? subCategoryList
          .filter((s) => selectedSubCategories.includes(s.name))
          .flatMap((s) => s.subSubCategories || [])
      : subCategoryList.flatMap((s) => s.subSubCategories || []);
  }, [subCategoryList, selectedSubCategories]);

  const attributeOptions = useMemo(() => {
    if (!combinations?.length) return {};
    return combinations.reduce((acc, item) => {
      Object.entries(item || {}).forEach(([key, value]) => {
        if (!["Price", "Stock"].includes(key) && value) {
          if (!acc[key]) acc[key] = new Set();
          acc[key].add(value);
        }
      });
      return acc;
    }, {});
  }, [combinations]);

  const sortedAttributeOptions = useMemo(() => {
    return Object.entries(attributeOptions).reduce((acc, [key, values]) => {
      acc[key] = [...values].sort();
      return acc;
    }, {});
  }, [attributeOptions]);

  // Handlers
  const handleBrandChange = useCallback(
    (brand) => {
      const updated = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand];
      setSelectedBrands(updated);
      dispatch(setBrands(updated));
      dispatch(setPage(1));
    },
    [selectedBrands]
  );

  const handleRatingChange = useCallback(
    (value) => {
      const updated = selectedRatings.includes(value)
        ? selectedRatings.filter((r) => r !== value)
        : [...selectedRatings, value];
      setSelectedRatings(updated);
      dispatch(setRatings(updated));
      dispatch(setPage(1));
    },
    [selectedRatings]
  );

  const handleCategoryChange = useCallback(
    (category) => {
      const updated = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      setSelectedCategories(updated);
      dispatch(setCategories(updated));
      dispatch(setPage(1));
    },
    [selectedCategories]
  );

  const handleSubCategoryChange = useCallback(
    (subCategory) => {
      const updated = selectedSubCategories.includes(subCategory)
        ? selectedSubCategories.filter((s) => s !== subCategory)
        : [...selectedSubCategories, subCategory];
      setSelectedSubCategories(updated);
      dispatch(setSubCategories(updated));
      dispatch(setPage(1));
    },
    [selectedSubCategories]
  );

  const handleProductCategoryChange = useCallback(
    (productCategory) => {
      const updated = selectedProductCategories.includes(productCategory)
        ? selectedProductCategories.filter((p) => p !== productCategory)
        : [...selectedProductCategories, productCategory];
      setSelectedProductCategories(updated);
      dispatch(setProductCategories(updated));
      dispatch(setPage(1));
    },
    [selectedProductCategories]
  );

  const handleAttributeChange = useCallback(
    (attr, value) => {
      const current = selectedFilters[attr] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const newAttrs = { ...selectedFilters, [attr]: updated };
      setSelectedFilters(newAttrs);
      dispatch(setAttributes(newAttrs));
      dispatch(setPage(1));
    },
    [selectedFilters]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(setPage(1));
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedFilters({});
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedProductCategories([]);
    setSearchTerm("");
    setSearchBrand("");
    setSearchCategory("");
    setSearchSubCategory("");
    setSearchProductCategory("");
    handlePriceChange([0, 2000]);
  }, [dispatch, handlePriceChange]);

  return {
    searchTerm,
    setSearchTerm,
    searchBrand,
    setSearchBrand,
    searchCategory,
    setSearchCategory,
    searchSubCategory,
    setSearchSubCategory,
    searchProductCategory,
    setSearchProductCategory,

    showAllBrands,
    setShowAllBrands,
    showAllCategories,
    setShowAllCategories,
    showAllSubCategories,
    setShowAllSubCategories,
    showAllProductCategories,
    setShowAllProductCategories,

    selectedBrands,
    selectedRatings,
    selectedFilters,
    selectedCategories,
    selectedSubCategories,
    selectedProductCategories,

    brands,
    categoryList,
    subCategoryList,
    productCategoryList,
    attributeOptions: sortedAttributeOptions,

    handleBrandChange,
    handleRatingChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleProductCategoryChange,
    handleAttributeChange,
    handleClearFilters,
  };
};
