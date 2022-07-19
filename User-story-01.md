CreateReservation: Rework the submit button
Ask why Routes use useQuery()
Manage time in UTC for alignment

Assume our app works in UTC time, 
Before sending the form, convert the reservation_date to UTC before sending to database

