import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import CreateReservationForm from "./CreateReservationForm";
import { createReservations } from "../utils/api";

//Manage the state of the reservation form
//onsubmit needs to work on
function CreateReservation({ date }) {
  const history = useHistory();

  const initialFormInfo = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date,
    reservation_time: "",
    people: 1,
  };
  const [reservationInfo, setReservationInfo] = useState(initialFormInfo);

  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    const controller = new AbortController();
    await createReservations({ data: reservationInfo }, controller.signal);
    setReservationInfo(initialFormInfo);
    history.go(0);
  };

  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    history.goBack();
  };

  return (
    <React.Fragment>
      <h1>Create Reservation</h1>
      <CreateReservationForm
        onSubmit={handleCreateReservations}
        onCancel={onCancel}
        reservationInfo={reservationInfo}
        setReservationInfo={setReservationInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
        date={date}
      />
    </React.Fragment>
  );
}

export default CreateReservation;
