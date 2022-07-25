const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;
// const date = '2022-07-19-00:010Z'
// date.toUTC('2022-07-19-00:010Z') // 2022-07-19-00:010Z
/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
export function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {*}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today() {
  return asDateString(new Date());
}

/**
 * Subtracts one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate) {
  let [year, month, day] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate) {
  let [year, month, day] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}

//Validate dates prior to sending the form
export function validateReservationDateTime(reservationInfo) {
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

  return errorsArray
}
