import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {
  listReservations,
  listTables,
  clearFinishedTable,
  cancelReservation,
} from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

//Maybe an error handler for table, in case of no table?
function Dashboard() {
  const [date, setDate] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  const query = useQuery();
  //initialize the querydate, it will be null because on initial load there is nothing in the url
  let queryDate = query.get("date");
  console.log(queryDate);
  //every time we click a button, there is a param change in the url
  //and somehow the queryDate is updated every time we click,
  //so, we make use of that,
  //we use useEffect to observe the change in `queryDate`
  //when there is a change, we set the `date` to be the `queryDate`
  //we display `date` on the board

  useEffect(dateChange, [queryDate]);

  function dateChange() {
    if (queryDate) {
      setDate(queryDate);
    } else setDate(today());
  }

  const handleClearTable = async (evt) => {
    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        const tableId = evt.target.getAttribute("data-table-id-finish");
        await clearFinishedTable(tableId, abortController.signal);
        loadDashboard();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      } else return;
    }
  };

  const handleCancelClick = async (evt) => {
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        const abortController = new AbortController();
        const reservation_id = evt.target.getAttribute(
          "data-reservation-id-cancel"
        );
        await cancelReservation(
          { status: "cancelled" },
          reservation_id,
          abortController.signal
        );
        loadDashboard();
      }
    } catch (error) {}
  };

  //after receiving an array of reservations, we need to format it and put it in the table
  const reservationList =
    reservations.length > 0 ? (
      reservations.map(
        ({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          reservation_date,
          reservation_time,
          people,
          status,
        }) => {
          if (status === "finished") {
            return null;
          } else if (status === "seated") {
            return (
              <tr key={reservation_id}>
                <th scope={reservation_id}>{reservation_id}</th>
                <td>
                  {last_name}, {first_name}
                </td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
              </tr>
            );
          } else if (status === "booked") {
            return (
              <tr key={reservation_id}>
                <th scope={reservation_id}>{reservation_id}</th>
                <td>
                  {last_name}, {first_name}
                </td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                <td>
                  <Link
                    className="btn btn-secondary"
                    to={`reservations/${reservation_id}/seat`}
                  >
                    Seat
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn btn-secondary"
                    to={`reservations/${reservation_id}/edit`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-reservation-id-cancel={reservation_id}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            );
          }
        }
      )
    ) : (
      <tr>
        <td colSpan={6}>No reservations found.</td>
      </tr>
    );

  const tableList = tables.map(
    ({ table_id, table_name, capacity, reservation_id }) => {
      return (
        <tr key={table_id}>
          <td>{table_id}</td>
          <td>{table_name}</td>
          <td>{capacity}</td>
          <td data-table-id-status={table_id}>
            {reservation_id === null ? "Free" : "Occupied"}
          </td>
          {reservation_id ? (
            <td>
              <button
                type="button"
                data-table-id-finish={table_id}
                className="btn btn-light"
                onClick={handleClearTable}
              >
                Finish
              </button>
            </td>
          ) : null}
        </tr>
      );
    }
  );
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {date}</h4>
          </div>
          <div className="btn-group">
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${previous(date)}`}
            >
              <span className="oi oi-chevron-left"></span>
              &nbsp;Previous
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${today()}`}
            >
              Today
            </Link>
            <Link
              className="btn btn-secondary"
              to={`/dashboard?date=${next(date)}`}
            >
              <span className="oi oi-chevron-right"></span>
              &nbsp;Next
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NAME</th>
                  <th scope="col">PHONE</th>
                  <th scope="col">DATE</th>
                  <th scope="col">TIME</th>
                  <th scope="col">PEOPLE</th>
                  <th scope="col">STATUS</th>
                </tr>
              </thead>
              <tbody>{reservationList}</tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="table-responsive">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">TABLE NAME</th>
                  <th scope="col">CAPACITY</th>
                  <th scope="col">Free?</th>
                </tr>
              </thead>
              <tbody>{tableList}</tbody>
            </table>
          </div>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;
