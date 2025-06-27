import { useState } from "react";
import style from "../../styles/ContactPage.module.css";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import InputField from "../../Component/UI-Components/InputField";
import Header from "../../Component/MainComponents/Header";
import { SendQuestions } from "../../axiosConfig/AxiosConfig";
import { useSelector } from "react-redux";
import Heading from "../../Component/UI-Components/Heading";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const User = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const data = {
      userId: User?.userid || "",
      ...formData,
    };

    setLoading(true);
    try {
      const res = await SendQuestions(data);
      console.log("Response:", res);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Banner name={"Contact us"} />

      <div className={style.ContactContainer}>
        <div className={style.ContactContainer2}>
          {/* Left Section */}
          <div className={style.leftContainer}>
            <Heading title=" Get in" titleColor="Touch" />
            <p className={style.leftContainerDescription}>
              Have questions or special requests? We're here to assist you.
              Contact us for reservations, event inquiries, or any other
              information you may need. We look forward to hearing from you!
            </p>

            <div className={style.leftContainerContact}>
              <button className={style.leftContainerTelephonetButton}>
                <img src="/telephone.png" alt="phone icon" />
              </button>
              <span className={style.leftContainerContactNumber}>
                +1(672)-377-4949
              </span>
            </div>

            <div className={style.leftContainerMail}>
              <button className={style.leftContainerMailButton}>
                <img src="/email.png" alt="email icon" />
              </button>
              <span className={style.leftContainerMailNumber}>
                <Link
                  to="https://mail.google.com/mail/?view=cm&fs=1&to=mekuskitchen@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.mailLink}
                >
                  mekuskitchen@gmail.com
                </Link>
              </span>
            </div>

            <div className={style.leftContainerSocialMedia}>
              <button className={style.leftContainerSocialMediaButton}>
                <img src="/facebook.png" alt="facebook icon" />
              </button>
              <button className={style.leftContainerSocialMediaButton}>
                <img src="/instagram.png" alt="instagram icon" />
              </button>
            </div>
          </div>

          <div className={style.rightContainer}>
            <Heading title="Contact Us For Any" titleColor="Questions" />

            <form onSubmit={handleSubmit} className={style.rightContainerForm}>
              <div className={style.formFieldsColumn2}>
                <div className={style.inputFieldContainer}>
                  <InputField
                    label={true}
                    labelName="Your Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="errorMessage">{errors.name}</div>
                  )}
                </div>

                <div className={style.inputFieldContainer}>
                  <InputField
                    label={true}
                    labelName="Your Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="errorMessage">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className={style.formFieldsColumn1}>
                <div className={style.inputFieldContainer}>
                  <InputField
                    label={true}
                    labelName="Phone Number"
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <div className="errorMessage">{errors.phone}</div>
                  )}
                </div>
              </div>

              <div className={style.messageContainer}>
                <label className={style.label} htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={style.textarea}
                  rows="5"
                ></textarea>
                {errors.message && (
                  <div className="errorMessage">{errors.message}</div>
                )}
              </div>

              <div className={style.submitButtonContainer}>
                <button type="submit" className="Button md" disabled={loading}>
                  {loading ? "Sending..." : "Ask A Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
