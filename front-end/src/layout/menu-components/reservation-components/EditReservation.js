import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../../ErrorAlert";
import { readReservation, editReservation } from "../../../utils/api";
import { validateReservationDateTime } from "../../../utils/date-time";

/**
 * This component takes the user to the Edit page of the Reservation to edit information of the reservation.
 * @returns {JSX.Element}
 */
//adding errors as dependencies cause crash/memoryleak?
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
  const [reservationErrors, setReservationErrors] = useState([]);

  useEffect(loadSeatPage, [resId]);
  function loadSeatPage() {
    const abortController = new AbortController();
    setReservationErrors([]);

    readReservation(resId, abortController.signal)
      .then(setReservationInfo)
      .catch((error) => setReservationErrors([...reservationErrors, error]));

    return () => abortController.abort();
  }

  //Validate dates prior to sending the form
  const validateResDateTime = () => {
    const errorsArray = validateReservationDateTime(reservationInfo);

    //If there is any error, set the error objects and render the error instead of submitting form
    if (errorsArray.length === 0) {
      return true;
    } else {
      setReservationErrors(errorsArray);
      return false;
    }
  };

  //Create element to display errors on the CreateReservation component
  //If index is not acceptable, use unique number generator: measuring time from current/present date in millisecond
  const reservationErrorsList = () => {
    return reservationErrors.map((error) => {
      return <ErrorAlert key={Date.now()} error={error} />;
    });
  };

  //Send the edited reservation info to the express server
  const handleEditReservation = async (evt) => {
    evt.preventDefault();
    setReservationInfo(initialFormInfo);
    setReservationErrors([]);
    try {
      const abortController = new AbortController();
      if (validateResDateTime()) {
        await editReservation(
          {
            ...reservationInfo,
            people: parseInt(reservationInfo.people),
          },
          abortController.signal
        );
      }
      history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationErrors([...reservationErrors, error]);
      } else return;
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
    <main>
      <h1>Edit Reservation</h1>
      {reservationErrors.length > 0 ? reservationErrorsList() : null}
      <ReservationForm
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
