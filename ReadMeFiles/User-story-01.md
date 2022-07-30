CreateReservation: Rework the submit button
Ask why Routes use useQuery()
Manage time in UTC for alignment

---

Assume our app works in UTC time,

We assume the input time will be in UTC? >> We will make that date/time to be UTC, as in set it to be ZERO offset.
vvv
And before sending the form, convert the reservation_date to UTC format before sending to database.

When we get the date and time back from the database, we just need to display it to local time

---

Right now the database is returning time in UTC, which is ok, we just need to display it to local time.
i.e var date = new Date('7/20/2022 4:52:48 PM UTC');

> > date.toString() // "July 20 2022 09:52:48 GMT -0700(PDT)"

--  
Example
const date1 = new Date('2022-07-26')
console.log(date1)
> > 2022-07-26T00:00.000Z //time at UTC

const date2 = new Date('2022-07-26T00:00')
console.log(date2)
> > 2022-07-26T06:00.000Z //time at UTC

date1.getDay() >> 1, because //time at local = 2022-07-25T18:00
date2.getDay() >> 2, because //time at local  = 2022-07-26T00:00

date1.getUTCDay() >> 2, tuesday
date2.getUTCDay() >> 2, tuesday
