require("dotenv").config();

const express = require("express");
const chalk = require("chalk");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  addAppointment,
  getAppointments,
} = require("./appointments.controller");
const { loginUser } = require("./users.controller");
const auth = require("./middlewares/auth");

const port = 3000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/appointments", async (req, res) => {
  try {
    const { fullName, phoneNumber, problemDescription } = req.body;
    await addAppointment(fullName, phoneNumber, problemDescription);
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.json({ token });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get("/api/appointments", auth, async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.json(appointments);
  } catch (e) {
    res.status(500).json({ error: "Failed to get appointments" });
  }
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  })
  .catch((err) => {
    console.error(chalk.red("MongoDB connection error:"), err);
  });
