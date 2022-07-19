import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import CreateReservationForm from "./CreateReservationForm";
import { createReservations } from "../utils/api";

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

  //send the reservation info to the express server in form of an object with the key named `data`
  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    const controller = new AbortController();
    await createReservations({ data: reservationInfo }, controller.signal);
    setReservationInfo(initialFormInfo);
    history.push("/");
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
