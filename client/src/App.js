import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import store from "./store";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import "./App.css";

if (localStorage.jwtToken) {
  // Set Auth token header
  setAuthToken(localStorage.jwtToken);
  // Decode token get user
  const decode = jwt_decode(localStorage.jwtToken);
  // Set user and isAuth
  store.dispatch(setCurrentUser(decode));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decode.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser);
    // TODO: Clear current Profile
    // Redirect to login
    window.location.href = "/login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
