const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

/**
 * Post handler for creating a reservation in the database
 */
async function create(req, res) {
  console.log(req)
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

module.exports = {
  list,
  create: asyncErrorBoundary(create),
};
