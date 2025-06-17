import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Carousel from "../../Component/MainComponents/Carousel";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/HomePage.module.css";
import BestSellerProduct from "./BestSellerProduct";
import Category from "./Category";
import NewArrivals from "./NewArrivals";
import OurProduct from "./OurProducts";
import Cooking from "./Cooking";
import { Link } from "react-router-dom";
import { IoArrowUpOutline } from "react-icons/io5";
import ReviewComponent from "../../Component/MainComponents/ReviewComponent";

const HomePage = () => {
  const { data } = useSelector((state) => state.home);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={style.pageContainer}>
      <Header />
      <Carousel />

      <div className={style.container}>
        <NewArrivals data={data} />
        <Category data={data} />

        <section className={style.dishesSection}>
          <div className={style.headingContainer}>
            <h2 className={style.heading}>
              <span className={style.blueText}>Discover </span>
              <span>Our Kitchen</span>
              <span className={style.blueText}> Services</span>
            </h2>
          </div>
          <div className={style.services}>
            <div className={style.service}>
              <img
                src="https://c.ndtvimg.com/2022-03/j5jbs6g_khichdi_625x300_25_March_22.jpg?im=FeatureCrop,algorithm=dnn,width=384,height=384"
                alt="Delicious Gujarati meal with khichdi"
                className={style.image}
                loading="lazy"
              />
            </div>
            <div className={style.service}>
              <img
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/0f/f0/a6/tg-s-the-oriental-grill.jpg?w=600&h=-1&s=1"
                alt="Elegant dining area with traditional decor"
                className={style.image}
                loading="lazy"
              />
            </div>
            <div className={style.service}>
              <img
                src="https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg"
                alt="Well-stocked pantry with fresh ingredients"
                className={style.image}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <BestSellerProduct data={data} />

        <section className={style.thaliSection}>
          <div className={style.contentBox}>
            <h2 className={style.experience}>
              <span className={style.blueText}>Experience </span>
              <span>the </span>
              <strong className={style.blueText}>Authentic Gujarati</strong>
              <span> Thali</span>
            </h2>
            <p className={style.subText}>
              Enjoy our Gujarati thali with fresh dal, farsan, rotis, rice,
              sabzis, chutneys, and sweets—balanced flavors made with love.
            </p>
            <div className={style.benefitsBox}>
              <h4 className={style.benefitsHeading}>Why Choose Our Thali:</h4>
              <ul className={style.benefitsList}>
                <li>Seasonal veggies and classic dishes.</li>
                <li>Perfect blend of sweet, tangy, and spicy.</li>
                <li>Nutritious and comforting, just like home.</li>
              </ul>
            </div>
          </div>

          <div className={style.imageBox}>
            <img
              src="https://t4.ftcdn.net/jpg/12/90/77/87/360_F_1290778767_epgewoyheL9P1GXrVlB13gzpNu0TVmOu.jpg"
              alt="Authentic Gujarati Thali with a variety of dishes"
              className={style.mainThaliImg}
              loading="lazy"
            />
          </div>
        </section>

        <OurProduct data={data} />
        <Cooking />

        <ReviewComponent data={data} />

        <section className={style.hero}>
          <div className={style.container}>
            <h1 className={style.title}>
              <span className={style.highlight}>Freshly</span> Cooked Meals Just
              <br />
              Like <span className={style.highlight}>Home</span>
            </h1>
            <p className={style.subtitle}>
              From comforting tiffins to full thalis, enjoy homemade-style food.
            </p>
            <Link to={"/product-category"}>
              <button className={style.button}>
                Explore Our Products <span className={style.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>
      </div>

      <button
        className={`${style.scrollTopButton} ${
          showScrollTop ? style.visible : ""
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <IoArrowUpOutline />
      </button>

      <Footer />
    </div>
  );
};

export default HomePage;
