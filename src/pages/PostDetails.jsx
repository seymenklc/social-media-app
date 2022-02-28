import { useParams } from 'react-router-dom';
// hooks
import { useDocument } from '../hooks/useDocument';
// components
import Post from '../components/Post';
import Spinner from '../components/Spinner';
import Comments from '../components/Comments';

export default function PostDetails() {
    const { id } = useParams();
    const { document, error } = useDocument('posts', id);

    return (
        <div>
            {error && <p className='error'>{error}</p>}
            {!document && <Spinner />}
            {document && (
                <>
                    <Post document={document} />
                    {document.comments.length >= 1 && (
                        <Comments comments={document.comments} />
                    )}
                </>
            )}
        </div>
    );
}
