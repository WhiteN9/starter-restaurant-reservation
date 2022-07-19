import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import CreateReservationForm from "./CreateReservationForm";
import { createReservations } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function CreateReservation({ date }) {
  const history = useHistory();

  const initialFormInfo = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);
  const [reservationErrors, setReservationErrors] = useState([]);

  //Validate dates prior to sending the form
  const validateReservationDateTime = () => {
    const errorsArray = [];

    const resDate = reservationInfo.reservation_date;
    const dayOfTheWeek = new Date(resDate).getUTCDay();
    if (dayOfTheWeek === 2) {
      errorsArray.push({ message: "The restaurant is closed on Tuesday." });
    }
    if (resDate < date) {
      errorsArray.push({
        message: "Reservation date/time must occur in the future.",
      });
    }

    const resTime = reservationInfo.reservation_time;
    console.log(resTime)
    //resTime cannot be before 10:30 or after 21:30
    //resTime cannot be before the current time of making reservation
    
    if (errorsArray.length === 0) {
      return true;
    } else {
      setReservationErrors(errorsArray);
      return false;
    }
  };

  const reservationErrorsList = () => {
    return reservationErrors.map((error, index) => {
      return <ErrorAlert key={index} error={error} />;
    });
  };
  //send the reservation info to the express server
  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    if (validateReservationDateTime()) {
      await createReservations({
        ...reservationInfo,
        people: parseInt(reservationInfo.people),
      });
      setReservationInfo(initialFormInfo);
      history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
    }
  };

  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    history.goBack();
  };

  return (
    <React.Fragment>
      <h1>Create Reservation</h1>
      {reservationErrors.length > 0 ? reservationErrorsList() : null}
      <CreateReservationForm
        onSubmit={handleCreateReservations}
        onCancel={onCancel}
        reservationInfo={reservationInfo}
        setReservationInfo={setReservationInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </React.Fragment>
  );
}

export default CreateReservation;
