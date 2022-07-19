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
    if (queryDate) {
      setDate(queryDate);
    } else setDate(today());
  }

  //after receiving an array of reservations, we need to format it and put it in the table
  const reservationTable = reservations.map(
    ({
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    }) => {
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
          <td>
            <a href="#">Button</a>
          </td>
          <td>
            <a href="#">Button</a>
          </td>
          <td>
            <a href="#">Button</a>
          </td>
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
                </tr>
              </thead>
              <tbody>{reservationTable}</tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          {/* RENDER A TABLE OF AVAILABLE TABLES */}

          <div className="this is the table"></div>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;
