const knex = require("../db/connection");

function list(date, status) {
  return knex("reservations")
    .select()
    .where("reservation_date", date)
    .whereNot("status", status)
    .orderBy("reservation_time");
}

//Search the mobile number column.
//For each mobile number, if it has any symbols ()- or whitespace, replaces with empty string.
//If the mobile number is anything %LIKE% the input number (input also will be formatted), return that mobile number.
function listByPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
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
  listByPhone,
  read,
  create,
  updateNewStatus,
};
