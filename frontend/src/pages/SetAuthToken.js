import axios from "axios";

// setAuthToken is a function that takes in a token and sets it to the global header

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else delete axios.defaults.headers.common["Authorization"];
};
