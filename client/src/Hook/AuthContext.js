import { useEffect } from "react";
import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  user_details: JSON.parse(localStorage.getItem("user_details")) || null,
  loading: false,
  error: null,
};
export const AuthContext = createContext(INITIAL_STATE);
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user_details: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user_details: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user_details: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user_details: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem("user_details", JSON.stringify(state.user_details));
  }, [state.user_details]);
  return (
    <AuthContext.Provider
      value={{
        user_details: state.user_details,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
