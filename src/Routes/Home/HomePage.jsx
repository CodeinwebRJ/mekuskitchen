import { useSelector } from "react-redux";
import Carousel from "../../Component/MainComponents/Carousel";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/HomePage.module.css";
import BestSellerProduct from "./BestSellerProduct";
import Category from "./Category";
import NewArrivals from "./NewArrivals";
import OurProduct from "./OurProducts";
import Cooking from "./Cooking";

const HomePage = () => {
  const { data } = useSelector((state) => state.home);
  return (
    <div className={style.pageContainer}>
      <Header />
      <Carousel />

      <div className={style.container}>
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
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/0f/f0/a6/tg-s-the-oriental-grill.jpg?w=600&h=-1&s=1"
                alt="Elegant dining area with traditional decor"
                className={style.image}
                loading="lazy"
              />
            </div>
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
                src="data:image/jpeg;base64,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"
                alt="Well-stocked pantry with fresh ingredients"
                className={style.image}
                loading="lazy"
              />
            </div>
          </div>
        </section>

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
              src="https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg"
              alt="Authentic Gujarati Thali with a variety of dishes"
              className={style.mainThaliImg}
              loading="lazy"
            />
          </div>
        </section>

        <NewArrivals data={data} />

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
            <button className={style.button}>
              Explore Our Kitchen <span className={style.arrow}>→</span>
            </button>
          </div>
        </section>

        <BestSellerProduct data={data} />
        <OurProduct data={data} />
        <Cooking />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
