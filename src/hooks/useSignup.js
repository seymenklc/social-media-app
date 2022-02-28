import { useEffect, useState } from 'react';
import * as AuthActions from '../constants/authActions';
import { useAuthContext } from './useAuthContext';
// firebase
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const useSignup = () => {
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { dispatch } = useAuthContext();

    const signup = async (email, password, nickname, thumbnail) => {
        setIsLoading(true);
        setError(null);

        try {
            // create a user
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

            const uploadPath = `thumbnails/${auth.currentUser.uid}/${thumbnail.name}`;
            const imgRef = ref(storage, uploadPath);

            // upload the file
            await uploadBytes(imgRef, thumbnail);

            // get downloadURL of image
            const url = await getDownloadURL(imgRef);

            // adding nickname & avatar to user
            const update = { displayName: nickname, photoURL: url };
            await updateProfile(auth.currentUser, update);

            // creating a user document
            const docRef = doc(db, 'users', userCredentials.user.uid);
            await setDoc(docRef, {
                online: true,
                nickname,
                photoURL: url,
                likedPosts: []
            });

            // dispatch action to set user globally
            dispatch({
                type: AuthActions.SIGNUP,
                payload: userCredentials.user
            });

            if (!isUnmounted) {
                setIsLoading(false);
                setError(null);
            }
        } catch (err) {
            if (!isUnmounted) {
                setError(err.message);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsUnmounted(true);
    }, []);

    return [signup, isLoading, error];
};