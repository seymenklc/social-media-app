import Comment from "./Comment";

export default function Comments({ comments }) {
    return (
        <div>
            {comments.map(comment => (
                <div key={comment.body} className='post-container'>
                    <Comment comment={comment} />
                </div>
            ))}
        </div>
    );
}
