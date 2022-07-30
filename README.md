![image](https://user-images.githubusercontent.com/39269842/182003326-b1ade485-d1d1-4430-9479-fcf201c5eedc.png)

# Restaurant Reservation Application

The app aims to assist employees at a restaurant in managing reservations and tables. It uses an api
Created with ReactJS, Node, Express, Knex, PostgreSQL.

## Table of Contents

- [Links](#links)
- [Technologies](#technologies)
- [Setup](#setup)
- [Features](#features)
- [Screenshots](#screenshots)
- [Sources](#sources)

### Links:

- [App Client Link](https://restaurant-reserve-pj-frontend.herokuapp.com/)
- [App Server Link](https://restaurant-reserve-pj-backend.herokuapp.com/)

### Technologies:

- PostgreSQL
- Express 4
- Node 12
- Knex 0.21
- Bootstrap 4
- HTML5

### Setup:

- Follow the [Thinkful Guide](https://github.com/Thinkful-Ed/starter-restaurant-reservation) for getting started building a project on your own.

1. Fork and clone this repository.
2. Run `cp ./.env.sample ./.env` in front-end and back-end folder.
3. Front-end .env: Change `.env file` if you want to connect to a different port. The default is http://localhost:5001.
4. Back-end .env: ElephantSQL can be used to host free database.
5. Run `npm install` in root folder to install all dependencies.
6. Run `npm run start:dev` to start the frontend of the application.

### Features:

- View reservations and tables
- Search reservations by mobile number
- Create new and edit existing reservations
- Create new tables

### Screenshots:
![image](https://user-images.githubusercontent.com/39269842/182003284-788db2a0-1980-4170-94a9-937ff8173e47.png)
![image](https://user-images.githubusercontent.com/39269842/182003301-4c6c9ea1-f799-4247-9937-9b50ff3d0c98.png)
![image](https://user-images.githubusercontent.com/39269842/182003317-ae5116d8-e027-4c5c-b361-99bfc5e3066f.png)

#### Reservations endpoints:

- `GET /reservations`

  - Retrieves existing reservations by date
  - i.e: /reservations?date=07-07-2077

- `GET /reservations/${reservation_id}`

  - Retrieves an reservation by the param ID.

- `POST /reservations`

  - Creates a new reservation.

- `PUT /reservations/${reservation_id}`

  - Updates an existing reservation.

- `PUT /reservations/${reservation_id}/status`

  - Updates the reservation to one of these statuses: _Seated, Finished, Cancelled_.

#### Tables endpoints:

- `GET /tables`

  - Retrieves all existing tables.

- `POST /tables`

  - Creates a new table.

- `PUT /tables/${tableId}/seat`

  - Update the status of a reservation to _Seated_ and a table to _Occupied_ after the table is selected.

- `DELETE /tables/${tableId}/seat`
  - Reverts a table's status back to _Free_ and hides away _Finished_ reservation.

### Sources:

This is a Capstone Project with the template designed by Thinkful. The development of this FullStack application was done by me.
