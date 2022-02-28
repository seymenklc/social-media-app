import { useState } from 'react';
import * as AuthActions from '../constants/authActions';
import { useAuthContext } from "./useAuthContext";
// firebase
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useFirestore } from './useFirestore';

export const useLogout = () => {
    const [error, setError] = useState(null);

    const { dispatch, user } = useAuthContext();
    const { updateDocument, response } = useFirestore('users');

    const logout = async () => {
        setError(null);

        try {
            await signOut(auth);
            // updating user's online status
            await updateDocument(user.uid, { 'online': false });

            if (!response.error) {
                dispatch({ type: AuthActions.LOGOUT });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return { logout, error };
};