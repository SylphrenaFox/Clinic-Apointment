import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./request-form.module.css";

export const RequestForm = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    if (!fullName || !phone) {
      alert("Пожалуйста, заполните все обязательные поля.");
      setIsSubmitting(false);
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 11) {
      alert("Пожалуйста, введите корректный номер телефона (11 цифр).");
      setIsSubmitting(false);
      return;
    }

    const requestData = { fullName, phoneNumber: phone, problemDescription };

    try {
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setSuccessMessage("Заявка успешно отправлена!");
        setFullName("");
        setPhone("");
        setProblemDescription("");
      } else {
        alert("Произошла ошибка при отправке заявки.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при отправке заявки.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={() => navigate("/login")}>
        Войти
      </button>
      <h2 className={styles.title}>Оставьте заявку</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          ФИО:
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Номер телефона:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Опишите Вашу проблему:
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            className={styles.textarea}
          />
        </label>
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Отправка..." : "Отправить"}
        </button>
      </form>
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
    </div>
  );
};
