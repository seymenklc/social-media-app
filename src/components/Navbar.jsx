import { Link, useLocation } from "react-router-dom";
// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const { pathname } = useLocation();
    const currentPath = pathname === '/';

    return (
        <div className="nav-container">
            <div className="flex-1">
                <span className="nav-title">
                    <Link to='/'>Socialize</Link>
                </span>
            </div>
            {!user && (
                <ul>
                    <li className="nav-link">
                        <Link to='/login'>Login</Link>
                    </li>
                    <li className="nav-link">
                        <Link to='/signup'>Signup</Link>
                    </li>
                </ul>
            )}
            {user && (
                <div className="dropdown dropdown-end">
                    <span className="text-xl px-2">{user.displayName}</span>
                    <div tabIndex='0' className="flex-none gap-2">
                        <label className="nav-avatar">
                            <div className="w-10 rounded-full">
                                <img src={user.photoURL} alt='user avatar' />
                            </div>
                        </label>
                        <div className="nav-dropdown">
                            {!currentPath && (
                                <Link to='/' tabIndex='0' className="dropdown-item mb-2">
                                    Dashboard
                                </Link>
                            )}
                            <button tabIndex='0' className="dropdown-item" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
