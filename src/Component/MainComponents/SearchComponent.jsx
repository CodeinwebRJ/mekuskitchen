import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import style from "../../styles/SearchCompo.module.css";
import NoDataFound from "./NoDataFound";
import Loading from "../UI-Components/Loading";
import { setSearch } from "../../../Store/Slice/FilterDataSlice";

const SearchComponent = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { search } = useSelector((state) => state.filterData);
  const { loading, products } = useSelector((state) => state.product);

  useEffect(() => {
    setIsOpen(true);
  }, []);

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
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Start typing to see products you are looking for..."
          className={style.searchInput}
          autoFocus
        />
        <IoClose className={style.closeIcon} onClick={onClose} />
      </div>

      <div className={`${style.cardsContainer} ${isOpen ? style.show : ""}`}>
        {loading ? (
          <Loading />
        ) : products?.length > 0 ? (
          products.map((card) => (
            <div key={card.id} className={style.card}>
              <h3>{card.title}</h3>
              <p>{card.price}</p>
            </div>
          ))
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
