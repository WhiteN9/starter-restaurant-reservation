const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  create,
};
