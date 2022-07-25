import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import CreateReservationForm from "../CreateReservationForm";
import ErrorAlert from "../../ErrorAlert";
import { readReservation, editReservation } from "../../../utils/api";

function EditReservation() {
  const history = useHistory();
  const { resId } = useParams();

  const initialFormInfo = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);
  const [errors, setErrors] = useState([]);

  useEffect(loadSeatPage, []);
  function loadSeatPage() {
    const abortController = new AbortController();
    setErrors([]);

    readReservation(resId, abortController.signal)
      .then(setReservationInfo)
      .catch((error) => setErrors([...errors, error]));

    return () => abortController.abort();
  }

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

    //If there is any error, set the error objects and render the error instead of submitting form
    if (errorsArray.length === 0) {
      return true;
    } else {
      console.log(errorsArray);
      setErrors(errorsArray);
      return false;
    }
  };

  //Create element to display errors on the CreateReservation component
  //If index is not acceptable, use unique number generator: measuring time from current/present date in millisecond
  const reservationErrorsList = () => {
    return errors.map((error, index) => {
      return <ErrorAlert key={index} error={error} />;
    });
  };

  //Send the reservation info to the express server
  const handleEditReservation = async (evt) => {
    evt.preventDefault();

    try {
      if (validateReservationDateTime()) {
        await editReservation({
          ...reservationInfo,
          people: parseInt(reservationInfo.people),
        });
      }
      setReservationInfo(initialFormInfo);
      history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors(error);
      } else return;
    }
  };
  console.log(errors);

  //Go back to the previous page or to the dashboard after clicking cancel
  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };

  return (
    <main>
      <h1>Edit Reservation</h1>
      {errors.length > 0 ? reservationErrorsList() : null}
      <CreateReservationForm
        onSubmit={handleEditReservation}
        onCancel={onCancel}
        reservationInfo={reservationInfo}
        setReservationInfo={setReservationInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default EditReservation;
