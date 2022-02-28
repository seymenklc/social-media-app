import { useEffect, useState } from "react";
// firebase
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const useDocument = (collectionStr, docId) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const docRef = doc(db, collectionStr, docId);

        const unsub = onSnapshot(docRef, (doc) => {
            doc.data() && setDocument({ ...doc.data(), id: doc.id });
            doc.data() ? setError(null) : setError('no such document exists');
        }, (err) => {
            setError(err.message);
        });

        return () => unsub();
    }, [collectionStr, docId]);

    return { document, error };
};