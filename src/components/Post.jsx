import { useNavigate } from 'react-router-dom';
// hooks
import { usePostLogic } from '../hooks/usePostLogic';
import { useAuthContext } from '../hooks/useAuthContext';
// styles & assets
import { CgHeart, CgComment, CgTrash } from 'react-icons/cg';
// helpers 
import { errorHandler } from '../helpers/errorHandler';
// components
import CommentModal from './CommentModal';

export default function Post({ document }) {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { errors, isLiked, handleDelete, handleLike, handleDatestamp } = usePostLogic(document);
    const { createdBy, body, createdAt, image, likes, comments, id } = document;

    const handleNavigate = () => {
        if (!user) navigate('/login');

        navigate(`/post/${id}`);
    };

    return (
        <>
            <CommentModal doc={document} />
            <div className="post-container">
                {!errors && errorHandler(errors).map(err => (
                    <p className='error' key={err}>{err}</p>
                ))}
                <div className="flex items-start">
                    <div className={`avatar `}>
                        <div className="post-avatar">
                            <img src={createdBy.photoURL} alt='post avatar' />
                        </div>
                    </div>
                    <div className="post-body">
                        <div>
                            <div className='flex'>
                                <span className="mr-2 text-xl font-semibold">
                                    {createdBy.nickname}
                                </span>
                                <span className="self-center text-sm text-gray-400">
                                    {createdAt && handleDatestamp(createdAt)}
                                </span>
                            </div>
                            <p className="text-lg" onClick={handleNavigate}>{body}</p>
                            <img
                                className='post-image'
                                src={image}
                                alt={image && 'post image'}
                                onClick={handleNavigate}
                            />
                        </div>
                        <div className={`flex ${image ? 'mt-8' : 'mt-2'}`}>
                            <div className='flex mr-4 items-center'>
                                <button
                                    className={`post-like ${isLiked && 'text-red-500'}`}
                                    onClick={handleLike}
                                >
                                    <CgHeart />
                                </button>
                                <span className='p-1'>{likes.length}</span>
                            </div>
                            <div className='flex items-center'>
                                <button className='post-comment' onClick={handleNavigate}>
                                    <a href='#comment-modal'><CgComment /></a>
                                </button>
                                <span className='p-1'>{comments.length}</span>
                            </div>
                            {user && user?.uid === createdBy.id && (
                                <div className='ml-3'>
                                    <button className='post-like' onClick={handleDelete}>
                                        <CgTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}