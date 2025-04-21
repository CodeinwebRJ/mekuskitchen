import React, { useState, useEffect, useRef } from "react";
import style from "../../styles/AboutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import Heading from "../../Component/UI-Components/Heading";

const AboutPage = () => {
  const [foundingYear, setFoundingYear] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState(0);
  const [menuCount, setMenuCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const infoContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (infoContainerRef.current) {
      observer.observe(infoContainerRef.current);
    }

    return () => {
      if (infoContainerRef.current) {
        observer.unobserve(infoContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animate founding year
      const foundingYearInterval = setInterval(() => {
        setFoundingYear((prev) => {
          if (prev >= 2023) {
            clearInterval(foundingYearInterval);
            return 2023;
          }
          return prev + 10;
        });
      }, 10);

      // Animate happy customers
      const happyCustomersInterval = setInterval(() => {
        setHappyCustomers((prev) => {
          if (prev >= 100) {
            clearInterval(happyCustomersInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 10);

      // Animate menu count
      const menuCountInterval = setInterval(() => {
        setMenuCount((prev) => {
          if (prev >= 10) {
            clearInterval(menuCountInterval);
            return 10;
          }
          return prev + 1;
        });
      }, 200);

      return () => {
        clearInterval(foundingYearInterval);
        clearInterval(happyCustomersInterval);
        clearInterval(menuCountInterval);
      };
    }
  }, [isVisible]);

  return (
    <div>
      <Header />

      {/* banner */}
      <Banner name={"About us"} />

      {/* about container */}
      <div className={style.aboutContainer}>
        <div className={style.aboutContainer2}>
          {/* left image container */}
          <div className={style.aboutLeftImageContainer}>
            <img
              src="/AboutUs.png"
              alt="about us"
              className={style.aboutLeftImage}
            />
          </div>

          {/* right container */}
          <div className={style.aboutRightContainer}>
            <Heading title="About Our" titleColor="Kitchen" />

            <p className={style.aboutDescription}>
              At Meku's Kitchen, we believe that enjoying the food is more than
              just eating; it's an opportunity to create cherished memories. Our
              story began when our customers were missing Indian taste in the
              local food. With a focus on using the freshest, Indian sourced
              ingredients, chef's and our talented culinary team have earned
              Meku's Kitchen, a reputation for exceptional taste and impeccable
              service.
              <br />
              <br />
              Discover a culinary journey like no other at Meku's Kitchen. Our
              passion for food and commitment to excellence are evident in every
              dish we create. Whether you're celebrating a special occasion or
              simply craving a memorable dining experience, we invite you to
              savor the flavors of our carefully crafted menu.
            </p>
          </div>
        </div>
      </div>

      {/* info section */}
      <div className={style.infoContainer} ref={infoContainerRef}>
        <div className={style.infoLeftContainer}>
          <h2 className={style.infoLeftTitle}>
            We believe that enjoying the <br /> food is more than just eating
          </h2>
          <p className={style.infoLeftDescription}>
            WE COOK IT FOR YOU WITH LOVE
          </p>
        </div>
        <div className={style.infoRightContainer}>
          <div className={style.infoRightCountContainer}>
            <div className={style.countContainer}>
              <div className={style.foundrdYearCount}>
                <h1 className={style.countNumber}>{foundingYear}</h1>
                <p className={style.countText}>FOUNDING YEAR</p>
              </div>
              <div className={style.happyCustomersCount}>
                <h1 className={style.countNumber}>{happyCustomers}</h1>
                <p className={style.countText}>HAPPY COSTUMERS</p>
              </div>
            </div>

            <div className={style.menuCount}>
              <h1 className={style.countNumber}>{menuCount}</h1>
              <p className={style.countText}>MENU</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
