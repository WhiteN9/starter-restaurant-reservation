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
    const currentDateTime = new Date();
    const reservationDateTimeString =
      reservationInfo.reservation_date +
      "T" +
      reservationInfo.reservation_time +
      ":00";

    //Check if the reservation date is not a tuesday or in the past
    const reservationDateTime = new Date(reservationDateTimeString);
    if (reservationDateTime.getDay() === 2) {
      errorsArray.push({ message: "The restaurant is closed on Tuesday." });
    }
    if (reservationDateTime < currentDateTime) {
      errorsArray.push({
        message: "Reservation date/time must occur in the future.",
      });
    }

    //Check if the reservation time is within the valid timeframe
    const resHour = reservationDateTime.getHours();
    const resMinutes = reservationDateTime.getMinutes();
    if ((resHour === 10 && resMinutes <= 29) || resHour < 10) {
      errorsArray.push({
        message: "Please select a time between 10:30 and 21:30",
      });
    } else if ((resHour === 21 && resMinutes >= 31) || resHour > 21) {
      errorsArray.push({
        message: "Please select a time between 10:30 and 21:30",
      });
    }

    // const dailyOpenDateTime = new Date(`${date}T10:30:00`)
    // const dailyCloseDateTime = new Date(`${date}T21:30:00`)
    // console.log(dailyOpenDateTime)
    // console.log(dailyCloseDateTime)

    //If there is any error, set the error objects and render the error instead of submitting form
    if (errorsArray.length === 0) {
      return true;
    } else {
      setReservationErrors(errorsArray);
      return false;
    }
  };

  //Create element to display errors on the CreateReservation component
  const reservationErrorsList = () => {
    return reservationErrors.map((error, index) => {
      return <ErrorAlert key={index} error={error} />;
    });
  };

  //Send the reservation info to the express server
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

  //Go back to the previous page or to the dashboard after clicking cancel
  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
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
