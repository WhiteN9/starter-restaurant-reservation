import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import { previous, next } from "../utils/date-time";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

//I was able to create a handle date click, but not sure how to get it update immediately
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [dateTraverse, setDateTraverse] = useState(date);

  useEffect(loadDashboard, [date]);
  // useEffect(setPreviousDate(date), []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handlePreviousClick = () => {
    setDateTraverse(previous(dateTraverse));
  };
  const handleNextClick = () => {
    setDateTraverse(next(dateTraverse));
  };
  const handleTodayClick = () => {
    setDateTraverse(date);
  };

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
              onClick={handlePreviousClick}
              to={`/dashboard?date=${dateTraverse}`}
            >
              <span className="oi oi-chevron-left"></span>
              &nbsp;Previous
            </Link>
            <Link
              className="btn btn-secondary"
              onClick={handleTodayClick}
              to={`/dashboard?date=${date}`}
            >
              Today
            </Link>
            <Link
              className="btn btn-secondary"
              onClick={handleNextClick}
              to={`/dashboard?date=${dateTraverse}`}
            >
              <span className="oi oi-chevron-right"></span>
              &nbsp;Next
            </Link>
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
