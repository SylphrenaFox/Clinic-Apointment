const chalk = require("chalk");
const Appointments = require("./models/Appointments");
async function addAppointment(fullName, phoneNumber, problemDescription) {
  await Appointments.create({ fullName, phoneNumber, problemDescription });
  console.log(chalk.bgGreen("Appointment was added!"));
}

async function getAppointments() {
  const appointments = await Appointments.find().sort({ createdAt: -1 });
  return appointments;
}

module.exports = { addAppointment, getAppointments };
