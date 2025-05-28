import { useState, useCallback, useMemo } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import Carousel from "../../Component/MainComponents/Carousel";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/HomePage.module.css";
import { HomeProductCard } from "../../Component/Cards/HomeProductCard";

// Constants for better maintainability
const VISIBLE_CARDS = 4;
const DISHES = [
  {
    title: "Thepla",
    imageUrl:
      "https://t3.ftcdn.net/jpg/01/89/21/44/360_F_189214466_yxceW8ye3qWFUcJnjteC4wVCQaNoVfdJ.jpg",
    id: "thepla-1",
    alt: "Freshly made Gujarati Thepla with spices",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-2",
    alt: "Traditional Gujarati Methi Thepla",
  },
];

const dishes = [...new Map(DISHES.map((dish) => [dish.id, dish])).values()];

const HomePage = () => {
  const [startIndex, setStartIndex] = useState(0);

  // Memoize handlers to prevent re-creation
  const handlePrev = useCallback(() => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? dishes.length - VISIBLE_CARDS : prevIndex - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    setStartIndex((prevIndex) =>
      prevIndex + VISIBLE_CARDS >= dishes.length ? 0 : prevIndex + 1
    );
  }, []);

  // Memoize visible dishes to avoid unnecessary recalculations
  const visibleDishes = useMemo(() => {
    if (dishes.length === 0) return [];
    const endIndex = startIndex + VISIBLE_CARDS;
    return endIndex > dishes.length
      ? [
          ...dishes.slice(startIndex),
          ...dishes.slice(0, endIndex - dishes.length),
        ]
      : dishes.slice(startIndex, endIndex);
  }, [startIndex]);

  return (
    <div className={style.pageContainer}>
      <Header />
      <Carousel />

      <div className={style.container}>
        <section className={style.dishesSection}>
          <div className={style.headingContainer}>
            <h2 id="gujarati-dishes-heading" className={style.heading}>
              <span>Crave-Worthy </span>
              <span className={style.blueText}>Gujarati Dishes</span>
              <span> You’ll Keep </span>
              <span className={style.blueText}>Coming Back To</span>
            </h2>

            <div className={style.description}>
              <p>
                Authentic meals made fresh with homely flavors — always
                satisfying, just the way you like it.
              </p>
              <div className={style.arrowButton}>
                <button
                  className={style.circularButton}
                  onClick={handlePrev}
                  aria-label="Previous set of dishes"
                >
                  <LuArrowLeft size={22} />
                </button>
                <button
                  className={style.circularButton}
                  onClick={handleNext}
                  aria-label="Next set of dishes"
                >
                  <LuArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>

          <div
            className={style.dishGrid}
            role="list"
            aria-label="Featured dishes"
          >
            {visibleDishes.map((dish) => (
              <div className={style.card} key={dish.id} role="listitem">
                <img
                  src={dish.imageUrl}
                  alt={dish.alt || `Image of ${dish.title}`}
                  className={style.image}
                  loading="lazy"
                />
                <div className={style.overlay}>
                  <h3>{dish.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                src="https://media.self.com/photos/599c997a774b667d3bbe1214/master/pass/groceries-family-month.jpg"
                alt="Well-stocked pantry with fresh ingredients"
                className={style.image}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className={style.thaliSection} aria-labelledby="thali-heading">
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
            <div className={style.imageWrapper}>
              <img
                src="https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg"
                alt="Authentic Gujarati Thali with a variety of dishes"
                className={style.mainThaliImg}
                loading="lazy"
              />
            </div>
          </div>
        </section>

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

        <div>
          <h2 className={style.newArrival}>
            <span className={style.blueText}>New </span>
            <span>Arrival</span>
          </h2>
          <div className={style.productGrid}>
            <HomeProductCard
              image="https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg"
              title="Cheese Vada Pav Special"
              subtitle="Meku’s"
              price="15.00"
            />
            <HomeProductCard
              image="https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg"
              title="Cheese Vada Pav Special"
              subtitle="Meku’s"
              price="15.00"
            />
            <HomeProductCard
              image="https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg"
              title="Cheese Vada Pav Special"
              subtitle="Meku’s"
              price="15.00"
            />
            <HomeProductCard
              image="https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg"
              title="Cheese Vada Pav Special"
              subtitle="Meku’s"
              price="15.00"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
