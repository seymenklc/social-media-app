import { useEffect, useState } from 'react';
import * as AuthActions from '../constants/authActions';
import { useAuthContext } from './useAuthContext';
// firebase
import { auth } from '../firebase';
import { useFirestore } from './useFirestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const useLogin = () => {
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { dispatch } = useAuthContext();
    const { updateDocument, response } = useFirestore('users');

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            // signing the user in
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);

            // updating user's online status
            await updateDocument(userCredentials.user.uid, { 'online': true });

            if (!response.error) {
                dispatch({
                    type: AuthActions.LOGIN,
                    payload: userCredentials.user
                });
            }

            if (!isUnmounted) {
                setIsLoading(false);
                setError(null);
            }
        } catch (err) {
            if (!isUnmounted) {
                console.log(err.message);
                setError(err.message);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsUnmounted(true);
    }, []);

    return [login, isLoading, error];
};