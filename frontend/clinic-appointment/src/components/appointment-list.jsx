import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./appointment-list.module.css";

export const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          setError("Failed to fetch appointments");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="text-center">Загрузка...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className={styles.appointmentContainer}>
      <h2 className={styles.appointmentTitle}>Список заявок</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>ФИО</th>
              <th className={styles.tableHeader}>Номер телефона</th>
              <th className={styles.tableHeader}>Проблема</th>
              <th className={styles.tableHeader}>Дата и время</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className={styles.tableCell}>{appointment.fullName}</td>
                <td className={styles.tableCell}>{appointment.phoneNumber}</td>
                <td className={styles.tableCell}>
                  {appointment.problemDescription || "-"}
                </td>
                <td className={styles.tableCell}>
                  {new Date(appointment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Выйти
      </button>
    </div>
  );
};
