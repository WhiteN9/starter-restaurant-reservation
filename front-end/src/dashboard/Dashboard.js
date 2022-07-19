import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

//I was able to create a handle date click, but not sure how to get it update immediately
function Dashboard() {
  const [date, setDate] = useState(today());
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
    queryDate = query.get("date");
    if (queryDate) {
      setDate(queryDate);
    } else setDate(today());
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
          <div className="this is the resevation list"></div>
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
