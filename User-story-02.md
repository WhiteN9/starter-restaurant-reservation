Use formatDate and formatTime to format the returned UTC from the database

There is a problem with sending date to the backend, because we are sending a time that the database thinks the Date is in UTC, so we treat the Date in there differently compare to the Date we see prior to sending the form
i.e getDay() prior to submit vs getUTCDay() in the validation