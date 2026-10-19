const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

/** open CORS policy */
app.use(cors());

/** allow to read 'request' with json type & urlencoded */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** route to access uploaded file safely */
app.use('/image', express.static(path.join(__dirname, 'image')));

/** load all routes */
const userRoute = require('./routes/user.route');
const diskonRoute = require('./routes/diskon.route');
const eventRoute = require('./routes/event.route');
const ticketRoute = require('./routes/ticket.route');
const seatRoute = require('./routes/seat.route');
const authRoute = require('./routes/auth.route');
const subdistrict = require("./routes/subdistrict.route");

/** define prefix for each route */
app.use('/user', userRoute);
app.use('/diskon', diskonRoute);
app.use('/event', eventRoute);
app.use('/ticket', ticketRoute);
app.use('/seat', seatRoute);
app.use('/auth', authRoute);
app.use("/api/subdistrict", subdistrict);

/** Global error handler (opsional tapi recommended) */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
});

/** run server based on defined port */
app.listen(PORT, () => {
  console.log(`Server of Ticket Sales runs on port ${PORT}`);
});