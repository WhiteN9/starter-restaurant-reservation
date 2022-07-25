import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import SeatForm from "./SeatForm";
import ErrorAlert from "../../ErrorAlert";
import { listTables, readReservation, updateTable } from "../../../utils/api";

function Seat() {
  const history = useHistory();
  const { resId } = useParams();

  //create a new table state
  //if there is a change in table state, meaning a table is selected.

  const [reservationById, setReservationById] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(loadSeatPage, [resId, selectedTable]);
  function loadSeatPage() {
    const abortController = new AbortController();
    setErrors([]);
    listTables(abortController.signal)
      .then(setTables)
      .catch((error) => setErrors([...errors, error]));
    readReservation(resId, abortController.signal)
      .then(setReservationById)
      .catch((error) => setErrors([...errors, error]));

    return () => abortController.abort();
  }

  //Create an array of table options to display in the select tag
  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  //Create an element to display the reservation information
  const renderReservation = reservationById ? (
    <h3>
      # {reservationById.reservation_id} - {reservationById.first_name}{" "}
      {reservationById.last_name} on {reservationById.reservation_date} at{" "}
      {reservationById.reservation_time} for {reservationById.people}
    </h3>
  ) : null;

  //Create an element to display errors on the Seat component
  const reservationErrorsList = () => {
    return errors.map((error, index) => {
      return <ErrorAlert key={index} error={error} />;
    });
  };

  const handleTableSubmission = async (evt) => {
    evt.preventDefault();
    if (reservationById.people > selectedTable.capacity) {
      setErrors([
        ...errors,
        {
          message: `Table does not have enough capacity. Seating for ${reservationById.people} is needed.`,
        },
      ]);
      return;
    }
    await updateTable(selectedTable.table_id, {
      reservation_id: reservationById.reservation_id,
    });
    setReservationById(null);
    setSelectedTable(null);
    history.push(`/dashboard`);
  };

  const onCancel = () => {
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };

  return (
    <main>
      <h1>Seat Reservation</h1>
      {errors.length > 0 ? reservationErrorsList() : renderReservation}
      <SeatForm
        onSubmit={handleTableSubmission}
        onCancel={onCancel}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        submitLabel="Submit"
        cancelLabel="Cancel"
        tableOptions={tableOptions}
        tables={tables}
      />
    </main>
  );
}

export default Seat;
