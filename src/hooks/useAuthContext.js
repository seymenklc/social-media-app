import { useContext } from 'react';
import { UserAuthContext } from '../context/UserAuthContext';

export const useAuthContext = () => {
    const context = useContext(UserAuthContext);

    if (!context) {
        throw new Error('useAuthContext must bbe inside a Provider');
    }

    return context;
};