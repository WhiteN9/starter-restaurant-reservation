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
    people: "",
  };
  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);

  const [reservationErrors, setReservationErrors] = useState([]);

  //Validate numbers
  //Validate dates
  const validateReservationDate = () => {
    const resDate = reservationInfo.reservation_date;
    const errorsArray = [];
    const dayOfTheWeek = new Date(resDate).getDay();
    console.log(dayOfTheWeek);
    //UTC? local?
    if (dayOfTheWeek === 1) {
      errorsArray.push({ message: "The restaurant is closed on Tuesday." });
    }
    if (resDate < date) {
      errorsArray.push({
        message: "Reservation date/time must occur in the future.",
      });
    }

    console.log(errorsArray);

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
  //send the reservation info to the express server in form of an object with the key named `data`
  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    console.log(reservationInfo.mobile_number);
    const controller = new AbortController();
    if (validateReservationDate()) {
      await createReservations({ data: reservationInfo }, controller.signal);
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
