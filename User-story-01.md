CreateReservation: Rework the submit button
Ask why Routes use useQuery()
Manage time in UTC for alignment
---
Assume our app works in UTC time, 

We assume the input time will be in UTC?
And before sending the form, convert the reservation_date to UTC format before sending to database

When we get the date and time back from the database