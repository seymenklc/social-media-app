import { useState, useReducer, useEffect } from 'react';
import * as FirestoreActions from '../constants/firestoreActions';
// firebase
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const initialState = {
    isPending: false,
    document: null,
    error: null,
    success: false
};

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case FirestoreActions.IS_PENDING:
            return { isPending: true, document: null, error: null, success: false };
        case FirestoreActions.ADDED_DOC:
            return { isPending: false, document: action.payload, error: null, success: true };
        case FirestoreActions.UPDATED_DOC:
        case FirestoreActions.DELETED_DOC:
            return { isPending: false, document: null, error: null, success: true };
        case FirestoreActions.ERROR:
            return { isPending: false, document: null, error: action.payload, success: false };
        default:
            return state;
    }
};

export const useFirestore = (collectionStr) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isUnmounted, setIsUnmounted] = useState(false);

    const dispatchIfNotIsUnmounted = (action) => {
        if (!isUnmounted) {
            dispatch(action);
        }
    };

    // to add a doucument
    const addDocument = async (document, file) => {
        dispatch({ type: FirestoreActions.IS_PENDING });

        try {
            let url;
            // add image if there is one
            if (file) {
                const uploadPath = `postImages/${auth.currentUser.uid}/${file.name}`;
                const imgRef = ref(storage, uploadPath);

                // get download URL for later use
                await uploadBytes(imgRef, file);
                url = await getDownloadURL(imgRef);
            }

            // adding doc
            const docRef = collection(db, collectionStr);

            const data = {
                ...document,
                image: url ? url : null
            };

            const addedDocument = await addDoc(docRef, data);

            dispatchIfNotIsUnmounted({
                type: FirestoreActions.ADDED_DOC,
                payload: addedDocument
            });
        } catch (error) {
            dispatchIfNotIsUnmounted({
                type: FirestoreActions.ERROR,
                payload: error.message
            });
        }
    };

    // to update a document
    const updateDocument = async (id, update) => {
        dispatch({ type: FirestoreActions.IS_PENDING });

        try {
            const docToBeUpdated = doc(db, collectionStr, id);
            await updateDoc(docToBeUpdated, update);

            dispatchIfNotIsUnmounted({ type: FirestoreActions.UPDATED_DOC, });
        } catch (error) {
            dispatchIfNotIsUnmounted({
                type: FirestoreActions.ERROR,
                payload: error.message
            });
        }
    };

    // to delete a document
    const deleteDocument = async (id) => {
        dispatch({ type: FirestoreActions.IS_PENDING });

        try {
            const docRef = doc(db, collectionStr, id);
            await deleteDoc(docRef);

            dispatchIfNotIsUnmounted({ type: FirestoreActions.DELETED_DOC });
        } catch (error) {
            dispatchIfNotIsUnmounted({
                type: FirestoreActions.ERROR,
                payload: error.message
            });
        }
    };

    useEffect(() => {
        return () => setIsUnmounted(true);
    }, []);

    return { response, addDocument, updateDocument, deleteDocument };
};