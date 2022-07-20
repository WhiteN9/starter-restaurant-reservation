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
  console.log(reservationList);
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
//Check if reservation date is in a valid date format, YYYY-MM-DD
//reservation_date = string '2022-07-27T06:00:00.000Z'
//It can be convert back to Date object and be compared against today's date
function validateResDate(req, res, next) {
  const dateRegex = /^20[2-9][0-9]-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;
  const { data: { reservation_date } = {} } = req.body;

  const today = new Date();
  const newResDate = new Date(reservation_date);
  if (
    !reservation_date ||
    !dateRegex.test(reservation_date || newResDate < today)
  ) {
    return next({
      status: 400,
      message: `reservation_date must be present or future dates only`,
    });
  }
  next();
}

//Check if reservation date is not on a Tuesday
function validateResDateIsNotTuesday(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  const dayOfTheWeek = new Date(reservation_date).getUTCDay();
  if (dayOfTheWeek === 2) {
    return next({
      status: 400,
      message: `the store is closed on tuesday`,
    });
  }
  next();
}

//Check if reservation time is in a valid time format and within a loose timeframe, 10:00 - 21:59
function validateResTime(req, res, next) {
  const hour24Regex = /^(1[0-9]|2[0-1]):[0-5][0-9]$/;
  const { data: { reservation_time } = {} } = req.body;
  if (!reservation_time || !hour24Regex.test(reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time must be a number within 23:59`,
    });
  }
  next();
}

//Check if the reservation time is in a strict timeframe, 10:30 - 21:30
//reservation_date = string '2022-07-27T06:00:00.000Z'
function validateResTimeStrict(req, res, next) {
  const { data: { reservation_time, reservation_date } = {} } = req.body;
  const reservationDateTime = new Date(
    `${reservation_date.slice(0, 10)}T${reservation_time}`
  );
  console.log(reservationDateTime);
  const resHour = reservationDateTime.getHours();
  const resMinutes = reservationDateTime.getMinutes();
  if ((resHour === 10 && resMinutes <= 29) || resHour < 10) {
    return next({
      status: 400,
      message: `reservation_time must be a number within 23:59`,
    });
  } else if ((resHour === 21 && resMinutes >= 31) || resHour > 21) {
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
    validateResDateIsNotTuesday,
    validateResTime,
    validateResTimeStrict,
    validatePeople,
    asyncErrorBoundary(create),
  ],
};
