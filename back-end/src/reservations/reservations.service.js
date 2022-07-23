const knex = require("../db/connection");

function list(date, status) {
  return knex("reservations")
    .select()
    .where("reservation_date", date)
    .whereNot("status", status)
    .orderBy("reservation_time");
}

function read(id) {
  return knex("reservations").select("*").where("reservation_id", id).first();
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function updateNewStatus({ reservation_id, status }) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  read,
  create,
  updateNewStatus,
};
