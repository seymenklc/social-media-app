import { useCollection } from '../hooks/useCollection';

export default function UsersList() {
    const { documents, error } = useCollection('users');

    return (
        <div className="wrapper carousel">
            <div className="user-carousel">
                {error && <p className='error'>{error}</p>}
                {documents && documents.map(user => (
                    <div
                        key={user.id}
                        className={`avatar ${user.online ? 'online' : 'offline'}`}
                    >
                        <div className="post-avatar">
                            <img src={user.photoURL} alt={user.nickname} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}