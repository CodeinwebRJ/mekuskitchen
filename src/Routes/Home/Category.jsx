import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState, useEffect } from "react";
import style from "../../styles/Category.module.css";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const Category = () => {
  const swiperRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const DISHES = [
    {
      title: "Thepla",
      imageUrl:
        "https://rrtravelscabs.com/wp-content/uploads/2023/11/pexels-aditya-mara-17433337-1024x819.jpg",
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
    {
      title: "Thepla",
      imageUrl:
        "https://uk.ooni.com/cdn/shop/articles/20220211142645-margherita-9920_e41233d5-dcec-461c-b07e-03245f031dfe.jpg?v=1737105431&width=1080",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
    {
      title: "Thepla",
      imageUrl:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
    {
      title: "Thepla",
      imageUrl:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
    {
      title: "Thepla",
      imageUrl:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
    {
      title: "Thepla",
      imageUrl:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
    {
      title: "Thepla",
      imageUrl:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
    {
      title: "Thepla",
      imageUrl:
        "https://www.indubenkhakhrawala.com/wp-content/uploads/2025/04/Gujarati-Methi-Thepla-Made-By-Induben-Khakhrawala.jpg",
      id: "thepla-2",
      alt: "Traditional Gujarati Methi Thepla",
    },
  ];

  useEffect(() => {
    setShowArrows(DISHES.length > 1);
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.swiper.slideNext();
  };

  return (
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
            Authentic meals made fresh with homely flavors — always satisfying,
            just the way you like it.
          </p>
          {showArrows && (
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
          )}
        </div>
      </div>

      <div className={style.dishGrid}>
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          loop={DISHES.length > 1}
          freeMode={true}
          breakpoints={{
            640: { slidesPerView: Math.min(1, DISHES.length) },
            768: { slidesPerView: Math.min(2, DISHES.length) },
            800: { slidesPerView: Math.min(3, DISHES.length) },
            1110: { slidesPerView: Math.min(4, DISHES.length) },
          }}
        >
          {DISHES.map((card) => (
            <SwiperSlide key={card.id}>
              <div className={style.relatedProductCard}>
                <div className={style.card} role="listitem">
                  <img
                    src={card.imageUrl}
                    alt={card.alt || `Image of ${card.title}`}
                    className={style.image}
                    loading="lazy"
                  />
                  <div className={style.overlay}>
                    <h3>{card.title}</h3>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Category;
