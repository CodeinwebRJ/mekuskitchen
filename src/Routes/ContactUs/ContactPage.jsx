import { useState } from "react";
import style from "../../styles/ContactPage.module.css";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import InputField from "../../Component/UI-Components/InputField";
import Header from "../../Component/MainComponents/Header";
import { SendQuestions } from "../../axiosConfig/AxiosConfig";
import { useSelector } from "react-redux";
import Heading from "../../Component/UI-Components/Heading";
import SelectField from "../../Component/UI-Components/SelectField";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCode: "+1",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 7 to 15 digits";
    }

    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData };
    setLoading(true);

    try {
      await SendQuestions(payload);
      setFormData({
        name: "",
        email: "",
        phone: "",
        phoneCode: "+1",
        message: "",
      });
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Banner name="Contact us" />
      <div className={style.ContactContainer}>
        <div className={style.ContactContainer2}>
          <div className={style.leftContainer}>
            <Heading title="Get in" titleColor="Touch" />
            <p className={style.leftContainerDescription}>
              Have questions or special requests? We're here to assist you.
              Contact us for reservations, event inquiries, or any other
              information you may need.
            </p>

            <div className={style.leftContainerMail}>
              <button
                className={style.leftContainerMailButton}
                aria-label="Email"
              >
                <img src="/email.png" alt="Email icon" />
              </button>
              <span className={style.leftContainerMailNumber}>
                <a
                  href="mailto:mekuskitchen@gmail.com"
                  className={style.mailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mekuskitchen@gmail.com
                </a>
              </span>
            </div>

            <div className={style.leftContainerSocialMedia}>
              <button
                className={style.leftContainerSocialMediaButton}
                aria-label="Facebook"
              >
                <img src="/facebook.png" alt="Facebook icon" />
              </button>
              <button
                className={style.leftContainerSocialMediaButton}
                aria-label="Instagram"
              >
                <img src="/instagram.png" alt="Instagram icon" />
              </button>
            </div>
          </div>

          <div className={style.rightContainer}>
            <Heading title="Contact Us For Any" titleColor="Questions" />
            <form
              onSubmit={handleSubmit}
              className={style.rightContainerForm}
              noValidate
            >
              <div className={style.formFieldsColumn2}>
                <div className={style.inputFieldContainer}>
                  <InputField
                    label
                    labelName="Your Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="errorMessage">{errors.name}</div>
                  )}
                </div>
                <div className={style.inputFieldContainer}>
                  <InputField
                    label
                    labelName="Your Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div className="errorMessage">{errors.email}</div>
                  )}
                </div>
              </div>

              <div>
                <label className={style.label} htmlFor="phone">
                  Phone Number
                </label>
                <div className={style.phoneNumber}>
                  <div>
                    <SelectField
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleChange}
                      options={[
                        { label: "+1", value: "+1" },
                        { label: "+91", value: "+91" },
                        { label: "+44", value: "+44" },
                        { label: "+61", value: "+61" },
                      ]}
                      className={style.phoneCodeSelect}
                    />
                  </div>
                  <div className={style.phoneNumberInput}>
                    <InputField
                      label={false}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                {errors.phone && (
                  <div className="errorMessage">{errors.phone}</div>
                )}
              </div>

              <div className={style.messageContainer}>
                <label htmlFor="message" className={style.label}>
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={style.textarea}
                  rows="5"
                  placeholder="Type your message here..."
                />
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
