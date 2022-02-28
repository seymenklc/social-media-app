
export default function Comment({ comment }) {
    const { body, author } = comment;

    return (
        <div className="flex items-start">
            <img className="post-avatar" src={author.photoURL} alt='post avatar' />
            <div className="post-body">
                <div>
                    <div className='flex'>
                        <span className="mr-2 text-xl font-semibold">
                            {author.nickname}
                        </span>
                    </div>
                    <p className="text-lg">{body}</p>
                </div>
            </div>
        </div>
    );
}
