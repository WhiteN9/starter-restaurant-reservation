const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  const reservationList = await service.list(date);
  res.json({ data: reservationList });
}

/**
 * Post handler for creating a reservation in the database
 */
async function create(req, res) {
  const newReservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);

  const createdReservation = await service.create(newReservation);

  res.status(201).json({ data: createdReservation });
}
/**
 * Middleware validations for a post request
 */
//Check if reservation date is not a date, YYYY-MM-DD
function validateResDate(req, res, next) {
  const dateRegex = /^20[2-9][0-9]-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;

  const { data: { reservation_date } = {} } = req.body;
  console.log(reservation_date);
  console.log(typeof reservation_date);
  if (!reservation_date || !dateRegex.test(reservation_date)) {
    return next({
      status: 400,
      message: `reservation_date must be a date from today to future dates`,
    });
  }
  next();
}
//Check if reservation time is not a time, 00:00 - 23:59
function validateResTime(req, res, next) {
  const hour24Regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const { data: { reservation_time } = {} } = req.body;
  console.log(reservation_time);
  console.log(typeof reservation_time);
  if (!reservation_time || !hour24Regex.test(reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time must be a number within 23:59`,
    });
  }
  next();
}
//Check if people is not a number
function validatePeople(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (!people || typeof people !== "number") {
    return next({
      status: 400,
      message: `people need to be a number`,
    });
  }
  next();
}
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    validateResDate,
    validateResTime,
    validatePeople,
    asyncErrorBoundary(create),
  ],
};
