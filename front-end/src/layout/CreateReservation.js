import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import CreateReservationForm from "./CreateReservationForm";
import { createReservations } from "../utils/api";

//Manage the state of the reservation form
function CreateReservation() {
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

  useEffect(() => {
    setReservationInfo({ ...reservationInfo });
  }, ["?"]);

  const handleCreateReservations = async (evt) => {
    evt.preventDefault();
    const controller = new AbortController();
    await createReservations("");
    setReservationInfo();
  };

  const onCancel = () => {
    setReservationInfo(initialFormInfo);
    history.goBack();
  };

  return (
    <React.Fragment>
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
