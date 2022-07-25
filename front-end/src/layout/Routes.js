import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./menu-components/Dashboard";
import CreateReservation from "./menu-components/CreateReservation";
import Seat from "./menu-components/reservation-components/Seat";
import EditReservation from "./menu-components/reservation-components/EditReservation";
import CreateTable from "./menu-components/CreateTable";
import Search from "./menu-components/Search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
//why do we use useQuery here
function Routes() {
  const query = useQuery();
  //get the date from the query
  const date = query.get("date");
  // console.log("url date in Router: ", date);
  //pass in that date as
  // let date = today();
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation date={today()} />
      </Route>
      <Route path="/reservations/:resId/seat">
        <Seat />
      </Route>
      <Route path="/reservations/:resId/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
