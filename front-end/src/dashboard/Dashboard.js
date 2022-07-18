import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {date}</h4>
          </div>
          <div className="btn-group">
            <a className="btn btn-secondary" href="#">
              <span className="oi oi-chevron-left"></span>
              &nbsp;Previous
            </a>
            <a className="btn btn-secondary" href="#">
              Today
            </a>
            <a className="btn btn-secondary" href="#">
              <span className="oi oi-chevron-right"></span>
              &nbsp;Next
            </a>
          </div>
          <div className="this is the table"></div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          {/* RENDER A TABLE OF AVAILABLE TABLES */}
          <div className="this is the table"></div>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;

//Create a previous/today/next button
