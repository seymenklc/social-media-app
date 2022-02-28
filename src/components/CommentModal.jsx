/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import ReactDOM from 'react-dom';
// hooks
import { usePostLogic } from '../hooks/usePostLogic';

export default function CommentModal({ doc }) {
    const [text, setText] = useState('');
    const { handleComment } = usePostLogic(doc);

    const handleClick = async () => {
        handleComment(text);
        setText('');
    };

    return ReactDOM.createPortal(
        <div className='modal' id='comment-modal'>
            <div className="modal-box">
                <div className='flex flex-col'>
                    <div className='flex'>
                        <div className='modal-action m-0 p-0'>
                            <a href="#" className='btn btn-xs'>X</a>
                        </div>
                    </div>
                    <textarea
                        className='textarea textarea-bordered resize-none mt-5'
                        placeholder='Add your comment'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className='modal-action mt-3'>
                    <a href="#" className='btn btn-sm' onClick={handleClick}>Reply</a>
                </div>
            </div>
        </div>
        , document.getElementById('comment-portal')
    );
}
