import React from "react";

function CreateReservationForm({
  onSubmit,
  onCancel,
  reservationInfo,
  setReservationInfo,
  submitLabel,
  cancelLabel,
}) {
  const handleInputChange = (evt) => {
    setReservationInfo({
      ...reservationInfo,
      [evt.target.name]: evt.target.value,
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          value={reservationInfo["first_name"]}
          onChange={handleInputChange}
          required
          placeholder="First Name"
        ></input>
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          value={reservationInfo["last_name"]}
          onChange={handleInputChange}
          required
          placeholder="Last Name"
        ></input>
      </div>
      <div>
        <label htmlFor="mobile_number">Mobile Number</label>
        <input
          id="mobile_number"
          name="mobile_number"
          type="tel"
          value={reservationInfo["mobile_number"]}
          onChange={handleInputChange}
          required
          placeholder="Mobile Number"
          pattern="[0-9{3}-[0-9]{2}-[0-9]{4}"
        ></input>
      </div>
      <div>
        <label htmlFor="reservation_date">Date</label>
        <input
          id="reservation_date"
          name="reservation_date"
          type="date"
          value={reservationInfo["reservation_date"]}
          onChange={handleInputChange}
          required
        ></input>
      </div>
      <div>
        <label htmlFor="reservation_time">Time</label>
        <input
          id="reservation_time"
          name="reservation_time"
          type="time"
          value={reservationInfo["reservation_time"]}
          onChange={handleInputChange}
          required
        ></input>
      </div>
      <div>
        <label htmlFor="people">People</label>
        <input
          id="people"
          name="people"
          type="number"
          value={reservationInfo["people"]}
          onChange={handleInputChange}
          required
          step="1"
          min="1"
        ></input>
      </div>
      <div>
        <button type="button" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
      <div>
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

export default CreateReservationForm;
