import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import style from "../../styles/SearchCompo.module.css";
import NoDataFound from "./NoDataFound";
import Loading from "../UI-Components/Loading";
import { useDebouncedValue } from "../../Hook/useDebouced";
import { SearchProduct } from "../../axiosConfig/AxiosConfig";
import WishlistItem from "../Cards/WishlistItemsCard";

const SearchComponent = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const debouncedSearch = useDebouncedValue(search, 500);

  const fetchProducts = async () => {
    if (!debouncedSearch) {
      setData([]);
      return;
    }
    try {
      setLoading(true);
      const res = await SearchProduct(debouncedSearch);
      setData(res.data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch]);

  useEffect(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={style.searchOverlay}>
      <div className={`${style.searchContainer} ${isOpen ? style.open : ""}`}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Start typing to see products you are looking for..."
          className={style.searchInput}
          autoFocus
        />
        <IoClose className={style.closeIcon} onClick={onClose} />
      </div>

      <div className={`${style.cardsContainer} ${isOpen ? style.show : ""}`}>
        {loading ? (
          <Loading />
        ) : data && data.length > 0 ? (
          <div className={style.gridWrapper}>
            {data.map((card) => (
              <WishlistItem key={card._id} product={card} />
            ))}
          </div>
        ) : (
          <div className={style.noResults}>
            <NoDataFound />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
