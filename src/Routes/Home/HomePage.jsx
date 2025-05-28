import { useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import Carousel from "../../Component/MainComponents/Carousel";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/HomePage.module.css";

const dishes = [
  {
    title: "Thepla",
    imageUrl:
      "https://t3.ftcdn.net/jpg/01/89/21/44/360_F_189214466_yxceW8ye3qWFUcJnjteC4wVCQaNoVfdJ.jpg",
    id: "thepla-1",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-2",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6R8r3eqTZ2SF-VvCYAXPOTCcNiNkc62PtMlOfOmQglsm79SuMh7yXSaWWWHQCXP6kgo&usqp=CAU",
    id: "thepla-3",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-4",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-5",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-6",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-7",
  },
  {
    title: "Thepla",
    imageUrl:
      "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
    id: "thepla-8",
  },
];

const VISIBLE_CARDS = 4;

const HomePage = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? dishes.length - VISIBLE_CARDS : prevIndex - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      prevIndex + VISIBLE_CARDS >= dishes.length ? 0 : prevIndex + 1
    );
  };

  const visibleDishes =
    dishes.slice(startIndex, startIndex + VISIBLE_CARDS).length < VISIBLE_CARDS
      ? [
          ...dishes.slice(startIndex),
          ...dishes.slice(0, VISIBLE_CARDS - dishes.slice(startIndex).length),
        ]
      : dishes.slice(startIndex, startIndex + VISIBLE_CARDS);

  return (
    <div className={style.pageContainer}>
      <Header />
      <Carousel />

      <section className={style.wrapper} aria-labelledby="dishes-heading">
        <div className={style.headingContainer}>
          <h2 id="dishes-heading" className={style.heading}>
            <span>Crave-Worthy </span>
            <span className={style.blueText}>Gujarati Dishes</span>
            <span> You’ll Keep </span>
            <span className={style.blueText}>Coming Back To</span>
          </h2>

          <div className={style.des}>
            <p>
              Authentic meals made fresh with homely flavors — always
              satisfying, just the way you like it.
            </p>
            <div className={style.arrowButton}>
              <button
                className={style.circularButton}
                onClick={handlePrev}
                aria-label="Previous dish"
              >
                <LuArrowLeft size={22} />
              </button>
              <button
                className={style.circularButton}
                onClick={handleNext}
                aria-label="Next dish"
              >
                <LuArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>

        <div className={style.dishGrid} role="list">
          {visibleDishes.map((dish) => (
            <div className={style.card} key={dish.id} role="listitem">
              <img
                src={dish.imageUrl}
                alt={`Image of ${dish.title}`}
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

      <Footer />
    </div>
  );
};

export default HomePage;
