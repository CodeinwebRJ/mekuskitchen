import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { HomeProductCard } from "../../Component/Cards/HomeProductCard";
import style from "../../styles/NewArrival.module.css";
import { useSelector } from "react-redux";
import Loading from "../../Component/UI-Components/Loading";

const NewArrivals = () => {
  const { data, loading } = useSelector((state) => state.home);

  const products = Array.isArray(data?.NewProducts) ? data.NewProducts : [];
  const enableLoop = products.length >= 4;
  const enableAutoplay = products.length >= 4;

  return (
    <div className={style.wrapper}>
      <div>
        <h2 className={style.newArrival}>
          <span className={style.blueText}>New </span>
          <span>Arrival</span>
        </h2>
      </div>

      {loading ? <Loading/> : products.length === 0 ? (
        <p className={style.noProducts}>No new products available.</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          loop={enableLoop}
          autoplay={
            enableAutoplay
              ? { delay: 2500, disableOnInteraction: false }
              : false
          }
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className={style.swiperContainer}
        >
          {products?.map((product) => (
            <SwiperSlide key={product.id}>
              <div className={style.slideWrapper}>
                <HomeProductCard
                  data={product}
                  image={product.images}
                  name={product.name}
                  subtitle={product?.subtitle || ""}
                  price={product.sellingPrice}
                  alt={`Image of ${product.name || "product"}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default NewArrivals;
