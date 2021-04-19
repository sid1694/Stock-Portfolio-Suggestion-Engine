import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../Login/Login";
const Layout = (props) => {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={Login}></Route>
      </Switch>
    </div>
  );
};

export default Layout;
