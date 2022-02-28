import { useEffect, useReducer, createContext } from "react";
import * as AuthActions from "../constants/authActions";
// firebase
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserAuthContext = createContext();

export const userAuthReducer = (state, action) => {
    switch (action.type) {
        case AuthActions.LOGIN:
        case AuthActions.SIGNUP:
            return { ...state, user: action.payload };
        case AuthActions.LOGOUT:
            return { ...state, user: null };
        case AuthActions.IS_AUTH_READY:
            return { user: action.payload, isAuthReady: true };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    isAuthReady: false
};

export function UserAuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(userAuthReducer, initialState);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            dispatch({
                type: AuthActions.IS_AUTH_READY,
                payload: user
            });
            unsub();
        });
    }, []);

    return (
        <UserAuthContext.Provider value={{ ...state, dispatch }} >
            {children}
        </UserAuthContext.Provider>
    );
}