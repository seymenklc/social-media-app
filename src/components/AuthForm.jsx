import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// hooks
import { useSignup } from '../hooks/useSignup';
import { useLogin } from '../hooks/useLogin';
import { useFile } from '../hooks/useFile';
// helpers
import { errorHandler } from '../helpers/errorHandler';
// styles & assets
import { CgUser, CgLock } from 'react-icons/cg';

const initialState = {
    email: '',
    nickname: '',
    password: '',
    repeatPassword: '',
    thumbnail: null
};

export default function AuthForm() {
    const [formValues, setFormValues] = useState(initialState);
    const [login, loginIsLoading, loginError] = useLogin();
    const [signup, signupIsLoading, signupError] = useSignup();
    const { formError, setFormError, checkFile } = useFile();
    const { pathname } = useLocation();

    const { email, nickname, password, repeatPassword, thumbnail } = formValues;
    const errors = [formError, signupError, loginError];
    const currentPath = pathname === '/signup';

    const handleChange = (e) => {
        setFormValues((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = (event) => {
        setFormError(null);
        let file = event.target.files[0];

        if (!checkFile(file)) return;

        setFormError(null);
        setFormValues((prevState) => ({
            ...prevState,
            thumbnail: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        // signing user up
        if (currentPath) {
            // check if passwords match
            if (password !== repeatPassword) {
                setFormError('Passwords does not match');
                return;
            }

            signup(email, password, nickname, thumbnail);
        }

        // logging user in
        if (!currentPath) {
            login(email, password);
        }

        // reset inputs
        setFormError(null);
        setFormValues(initialState);
    };

    return (
        <div className="credentials-container">
            <div className="credentials-base artboard phone-2 artboard-demo">
                <i className='credentials-icon'>{currentPath ? <CgUser /> : <CgLock />}</i>
                <h2 className='credentials-title'>{currentPath ? 'Signup' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            required
                            type="email"
                            name='email'
                            placeholder='Enter email'
                            className='credentials-input'
                            value={email}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <input
                            required
                            type="password"
                            name='password'
                            placeholder='Enter password'
                            className='credentials-input'
                            value={password}
                            onChange={handleChange}
                        />
                    </label>
                    {currentPath && (
                        <>
                            <label>
                                <input
                                    required
                                    type="password"
                                    name='repeatPassword'
                                    placeholder='Repeat password'
                                    className='credentials-input'
                                    value={repeatPassword}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <input
                                    required
                                    type="text"
                                    name='nickname'
                                    placeholder='Enter nickname'
                                    className='credentials-input'
                                    value={nickname}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className='text-center mt-1'>
                                <span className='text-md text-gray-700 font-semibold'>
                                    Upload Avatar
                                </span>
                                <input
                                    required
                                    type="file"
                                    className='credentials-input py-1.5 mt-1'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </>
                    )}
                    <button className='credentials-btn'>
                        {currentPath && (
                            signupIsLoading ? 'signing in...' : 'signup'
                        )}
                        {!currentPath && (
                            loginIsLoading ? 'logging in...' : 'login'
                        )}
                    </button>
                </form>
                {errorHandler(errors).map(error => (
                    <p className='error' key={error}>{error}</p>
                ))}
            </div>
        </div>
    );
}