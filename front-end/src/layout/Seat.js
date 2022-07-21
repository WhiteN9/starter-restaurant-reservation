import React from "react";

import SeatForm from "./SeatForm";
import { useHistory } from "react-router-dom";
function Seat() {
  const history = useHistory();
  const handleTableAssignment = async (evt) => {
    evt.preventDefault();

    // await updateReservation({});

    // history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
  };
  const onCancel = () => {
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };
  return (
    <main>
      <h1>Seat Reservation</h1>
      <h3>Insert reservation info</h3>
      <SeatForm
        onSubmit="{}"
        onCancel="{}"
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default SeatForm;
