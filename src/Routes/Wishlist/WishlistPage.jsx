import { useEffect, useState } from "react";
import style from "../../styles/WishlistPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import { RiShareLine } from "react-icons/ri";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import WishlistItem from "../../Component/Cards/WishlistItemsCard";
import FilterAndShorting from "../../Component/UI-Components/FilterAndShorting";
import { getUserWishlist } from "../../axiosConfig/AxiosConfig";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice";
import Loading from "../../Component/UI-Components/Loading";

const WishlistPage = () => {
  const { items } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await getUserWishlist(user.userid);
      dispatch(setWishlist(res.data.data));
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const filterAndShortingOptions = [
    { id: 1, label: "Sort by price: low to high", value: "priceLowToHigh" },
    { id: 2, label: "Sort by price: high to low", value: "priceHighToLow" },
  ];

  return (
    <div>
      <Header />
      <Banner name="Wishlist" />
      <div className={style.wishlistContainer}>
        <div className={style.headingContainer}>
          <h3 className={style.headingTitle}>Your Wishlist</h3>
          <div className={style.headerContainer}>
            <div className={style.headerRightSide}>
              <RiShareLine className={style.icon} />
              <IoReorderThreeOutline
                className={`${style.icon} ${style.listIcon}`}
              />
              <FilterAndShorting
                options={filterAndShortingOptions}
                placeholder="Filter & Short"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div>
            <Loading />
          </div>
        ) : items?.length > 0 ? (
          items?.map((product, index) => (
            <WishlistItem
              key={product._id || index}
              product={product}
              fetchWishlist={fetchWishlist}
            />
          ))
        ) : (
          <p>No items in wishlist.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
