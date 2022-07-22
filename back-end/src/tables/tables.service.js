const knex = require("../db/connection");
const tableName = "tables";

function list() {
  return knex(tableName).select().orderBy("table_name");
}

function readReservation(reservation_id) {
  return knex("reservations").select().where({ reservation_id }).first();
}

function readTable(table_id) {
  return knex(tableName).select().where({ table_id }).first();
}

function create(newTable) {
  return knex(tableName)
    .insert(newTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

function updateTables({ table_id, reservation_id }) {
  return knex(tableName)
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id })
    .then(function () {
      return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update({ status: "seated" })
        .returning("*");
    });
}

module.exports = {
  list,
  readTable,
  readReservation,
  create,
  updateTables,
};
