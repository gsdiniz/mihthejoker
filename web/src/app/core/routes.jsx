import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../pages/login/Login.jsx";
import Main from "../pages/main";
import Shell from "../template/shell";
import useAuthentication from "../hooks/auth/useAuth.js";
import ResetPassword from "../pages/ResetPassword/ResetPassword.jsx";
import Visitar from "../pages/Visitante/Exposicoes/Visitar";
import Exposicao from "../pages/Expositor/Exposicao"

function NoMatch(props) {
  return (
    <Redirect to={{
      pathname: '/dashboard',
      state: { from: props.location }
      }}
    />
  );
}

const PrivateRoute = ({ component: Component, user, ...rest }) => {
  const profile = user.getUser()
  return (
    <Route {...rest} render={props => (
      profile ? (
        <Shell>
          <Component {...props} />
        </Shell>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
          }}
        />
      )
    )} />
  )
};

const Rotas = props => {
  const user = useAuthentication();
  return (
    <Switch>
      <PrivateRoute exact path="/dashboard" component={Main} user={user} />
      <PrivateRoute exact path="/exposicao/visitar" component={Visitar} user={user} />
      <PrivateRoute exact path="/exposicao/visitar/:id" component={Visitar} user={user} />
      <PrivateRoute exact path="/exposicao" component={Exposicao} user={user} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/reset-password" component={ResetPassword} />
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

export default Rotas
