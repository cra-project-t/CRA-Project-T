// store.js
import React, { createContext, useReducer } from "react";

const initialState = {
  loading: true,
};
const userStore = createContext(initialState);
const { Provider } = userStore;

const UserStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update":
        const newState = action.payload; // do something with the action
        return newState;
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { userStore, UserStateProvider };
