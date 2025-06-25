import style from "../../styles/RefundPolicy.module.css";
import Header from "../../Component/MainComponents/Header";
import Footer from "../../Component/MainComponents/Footer"; 
import Banner from "../../Component/MainComponents/Banner";

const RefundPolicyPage = () => {
  return (
    <div>
      <Header />
      <Banner name={"Refund Policy"} />
      <div className={style.container}>
        <div className={style.content}>
          <section className={style.section}>
            <h2>Overview</h2>
            <p>
              Suggested text: Our website address is:
              https://meksikukitchen.com/.
            </p>
          </section>

          <section className={style.section}>
            <h2>Comments</h2>
            <p>
              Suggested text: When visitors leave comments on the site we
              collect the data shown in the comments form, and also the
              visitor's IP address and browser user agent string to help spam
              detection.
            </p>
            <p>
              An anonymized string created from your email address (also called
              a hash) may be provided to the Gravatar service to see if you are
              using it. The Gravatar service privacy policy is available here:
              https://automattic.com/privacy/. After approval of your comment,
              your profile picture is visible to the public in the context of
              your comment.
            </p>
          </section>

          <section className={style.section}>
            <h2>Media</h2>
            <p>
              Suggested text: If you upload images to the website, you should
              avoid uploading images with embedded location data (EXIF GPS)
              included. Visitors to the website can download and extract any
              location data from images on the website.
            </p>
          </section>

          <section className={style.section}>
            <h2>Cookies</h2>
            <p>
              Suggested text: If you leave a comment on our site you may opt-in
              to saving your name, email address and website in cookies. These
              are for your convenience so that you do not have to fill in your
              details again when you leave another comment. These cookies will
              last for one year.
            </p>
            <p>
              If you visit our login page, we will set a temporary cookie to
              determine if your browser accepts cookies. This cookie contains no
              personal data and is discarded when you close your browser.
            </p>
          </section>
        </div>
        <aside className={style.sidebar}>
          <h3>CATEGORIES</h3>
          <ul>
            <li>Decoration</li>
            <li>Design trends</li>
            <li>Furniture</li>
            <li>Inspiration</li>
          </ul>

          <h3>RECENT COMMENTS</h3>
          <ul>
            <li>mp1255800 on Dabelli</li>
          </ul>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
