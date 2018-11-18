// Register
import axios from "axios";
import { GET_ERRORS } from "./types";
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      history.push("/login");
    })
    .catch(e => {
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      });
    });
};
