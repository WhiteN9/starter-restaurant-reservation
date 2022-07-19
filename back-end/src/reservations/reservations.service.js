const knex = require("../db/connection");

function list(date) {
  return knex("reservations").select().where("reservation_date", date);
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  create,
};
