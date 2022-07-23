import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";
import { listReservations } from "../utils/api";

function Search() {
  const [mobileNumber, setMobileNumber] = useState({ mobile_number: "" });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // useEffect(renderTableHead(), [reservations]);

  // function renderTableHead() {
  //   return;
  // }
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

  const findHandler = async (evt) => {
    evt.preventDefault();
    setReservations([]);
    setReservationsError(null);
    try {
      const abortController = new AbortController();

      const mobileNumberDigitsOnly = mobileNumber.mobile_number.replace(
        /\D/g,
        ""
      );
      await listReservations(
        {
          mobile_number: mobileNumberDigitsOnly,
        },
        abortController.signal
      )
        .then((response) => {
          if (response.length > 0) {
            setReservations(response);
          } else throw Error("No reservations found.");
        })
        .catch(setReservationsError);
      setMobileNumber(mobileNumber);
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      } else return;
    }
  };

  console.log(reservationsError);
  return (
    <main>
      <h1>Search Reservations</h1>
      <SearchForm
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        onSubmit={findHandler}
        submitLabel="Find"
      />
      {reservations.length > 0 ? (
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
      ) : null}

      {reservationsError ? (
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
            <tbody>
              <tr>
                <td colSpan={7}>{"No reservations found."}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}

export default Search;
