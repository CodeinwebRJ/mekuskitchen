import { useState } from "react";
import { useSelector } from "react-redux";
import style from "../../styles/DailyTiffinPage.module.css";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import TiffinCard from "../../Component/Cards/TiffinCard";
import Header from "../../Component/MainComponents/Header";
import Heading from "../../Component/UI-Components/Heading";
import Pagination from "../../Component/Pagination";
import Loading from "../../Component/UI-Components/Loading";

const ITEMS_PER_PAGE = 5;

const DailyTiffinPage = () => {
  const { tiffins, loading } = useSelector((state) => state.tiffin);
  const [customPage, setCustomPage] = useState(1);
  const [regularPage, setRegularPage] = useState(1);

  const customisedTiffins =
    tiffins?.filter(
      (item) =>
        item?.isCustomized === true ||
        item?.isCustomized === "true" ||
        item?.isCustomized === 1
    ) || [];

  const regularTiffins =
    tiffins?.filter(
      (item) =>
        item?.isCustomized === false ||
        item?.isCustomized === "false" ||
        item?.isCustomized === 0 ||
        item?.isCustomized === undefined
    ) || [];

  const paginatedCustomTiffins = customisedTiffins.slice(
    (customPage - 1) * ITEMS_PER_PAGE,
    customPage * ITEMS_PER_PAGE
  );

  const paginatedRegularTiffins = regularTiffins.slice(
    (regularPage - 1) * ITEMS_PER_PAGE,
    regularPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <Header />
      <Banner name={"Daily Tiffin"} />
      <div className={style.TiffinContainer}>
        <div className={style.CustomiseTiffinContainer}>
          <Heading title="Customise Your Tiffin" size="sm" />
          <div>
            <span>Week {customPage}</span>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className={style.TiffinCardContainer}>
              {paginatedCustomTiffins.map((item, index) => (
                <TiffinCard key={index} item={item} />
              ))}
            </div>
          )}
          {customisedTiffins.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={customPage}
              totalPages={Math.ceil(customisedTiffins.length / ITEMS_PER_PAGE)}
              onPageChange={setCustomPage}
            />
          )}
        </div>
        <div className={style.RegularTiffinContainer}>
          <Heading title="Order A Regular Tiffin" size="sm" />
          <div>
            <span>Week {regularPage}</span>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className={style.TiffinCardContainer}>
              {paginatedRegularTiffins.map((item, index) => (
                <TiffinCard key={index} item={item} />
              ))}
            </div>
          )}
          {regularTiffins.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={regularPage}
              totalPages={Math.ceil(regularTiffins.length / ITEMS_PER_PAGE)}
              onPageChange={setRegularPage}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DailyTiffinPage;
