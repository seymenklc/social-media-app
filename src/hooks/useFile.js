import { useState } from "react";

export const useFile = () => {
    const [formError, setFormError] = useState(null);

    const checkFile = (file) => {
        setFormError(null);

        if (!file) {
            setFormError('Please provide an image');
            return;
        }
        if (!file.type.includes('image')) {
            setFormError('Selected file must be an image');
            return;
        }
        if (file.size > 100000) {
            setFormError('File size must be less than 100kb');
            return;
        }

        return true;
    };

    return { formError, setFormError, checkFile };
};