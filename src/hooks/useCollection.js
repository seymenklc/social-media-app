import { useEffect, useState } from "react";
// firebase
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useCollection = (collectionStr) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const collectionRef = collection(db, collectionStr);

        const unsub = onSnapshot(collectionRef, (snapshot) => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            // state updates
            setError(null);
            setDocuments(results);
        }, (err) => {
            console.log(err.message);
            setError(err.message);
        });

        return () => unsub();
    }, [collectionStr]);

    return { documents, error };
};