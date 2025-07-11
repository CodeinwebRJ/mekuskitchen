import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState, useEffect } from "react";
import style from "../../styles/Category.module.css";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Category = () => {
  const { data, loading } = useSelector((state) => state.home);

  const swiperRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    setShowArrows(data?.Category?.length > 1);
  }, [data]);

  const handlePrev = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  if (!data?.Category?.length) {
    return <div>No Category available</div>;
  }

  return (
    <section className={style.dishesSection}>
      <div className={style.headingContainer}>
        <h2 className={style.heading}>
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
                disabled={!swiperRef.current?.swiper}
              >
                <LuArrowLeft size={22} />
              </button>
              <button
                className={style.circularButton}
                onClick={handleNext}
                aria-label="Next set of dishes"
                disabled={!swiperRef.current?.swiper}
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
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={data.Category.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: Math.min(1, data.Category.length) },
            768: { slidesPerView: Math.min(2, data.Category.length) },
            800: { slidesPerView: Math.min(3, data.Category.length) },
            1110: { slidesPerView: Math.min(4, data.Category.length) },
          }}
        >
          {data.Category.map((card) => (
            <SwiperSlide className={style.swiperSlide} key={card.id}>
              <Link to={`/product-category?category=${card?.category}`}>
                <div className={style.relatedProductCard}>
                  <div className={style.card} role="listitem">
                    <img
                      src={card.images?.[0]?.url || "/fallback-image.jpg"}
                      alt={card.name || card.title || "Gujarati dish"}
                      className={style.image}
                      loading="lazy"
                    />
                    <div className={style.overlay}>
                      <h3>{card?.category?.toUpperCase() || "Dish"}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Category;
