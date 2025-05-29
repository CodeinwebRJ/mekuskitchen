import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { HomeProductCard } from "../../Component/Cards/HomeProductCard";
import style from "../../styles/NewArrival.module.css";

const BestSellerProduct = ({ data }) => {
  const products = Array.isArray(data?.NewProducts) ? data.NewProducts : [];
  const enableLoop = products.length >= 4;
  const enableAutoplay = products.length >= 4;

  return (
    <div className={style.container}>
      <h2 className={style.newArrival}>
        <span className={style.blueText}>Best </span>
        <span>Seller Products</span>
      </h2>

      {products.length === 0 ? (
        <p>No new products available.</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          loop={enableLoop}
          autoplay={
            enableAutoplay
              ? { delay: 2000, disableOnInteraction: false }
              : false
          }
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: Math.min(products.length, 1) },
            480: { slidesPerView: Math.min(products.length, 2) },
            768: { slidesPerView: Math.min(products.length, 3) },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 4 },
          }}
          className={style.swiperContainer}
        >
          {products.map((product) => (
            <SwiperSlide className={style.container} key={product.id}>
              <HomeProductCard
                image={product.images}
                title={product.name}
                subtitle={product?.subtitle || ""}
                price={product.sellingPrice}
                alt={`Image of ${product.name || "product"}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BestSellerProduct;
