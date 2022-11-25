import { useState } from 'react';
// hooks
import { useFile } from '../hooks/useFile';
import { useFirestore } from '../hooks/useFirestore';
import { useAuthContext } from '../hooks/useAuthContext';
// firebase
import { serverTimestamp } from 'firebase/firestore';
// styles & assets
import { CgFileAdd } from 'react-icons/cg';

export default function Create() {
    const [file, setFile] = useState(null);
    const [postBody, setPostBody] = useState('');

    const { user } = useAuthContext();
    const { response, addDocument } = useFirestore('posts');
    const { formError, setFormError, checkFile } = useFile();

    if (formError) setTimeout(() => setFormError(null), 5000);

    const handleFileChange = (e) => {
        setFormError(null);
        let file = e.target.files[0];

        if (!checkFile(file)) return;

        setFormError(null);
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        const newPost = {
            body: postBody,
            createdBy: {
                id: user.uid,
                nickname: user.displayName,
                photoURL: user.photoURL
            },
            comments: [],
            likes: [],
            createdAt: serverTimestamp()
        };

        if (response.error) setFormError(response.error);
        if (!formError) await addDocument(newPost, file);

        setPostBody('');
        setFile(null);
        setFormError(null);
    };

    return (
        <section className={`wrapper ${formError ? 'pt-0' : 'pt-5'}`}>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                {formError && <p className='error mb-2'>{formError}</p>}
                <textarea
                    required
                    placeholder="What's Happening?"
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                />
                <div className='flex justify-between'>
                    <label htmlFor="imageInput" className='self-center mt-5'>
                        <i><CgFileAdd className='h-auto w-6' /></i>
                        {file && (
                            <span className='inline-block px-2'>
                                {file.name.substring(1, 20)}
                            </span>
                        )}
                    </label>
                    <input
                        id='imageInput'
                        type="file"
                        className='hidden'
                        onChange={handleFileChange}
                    />
                    {!user && <button disabled>Login</button>}
                    {!response.isPending && user && <button disabled={!postBody}>Post</button>}
                    {response.isPending && <button disabled>Posting...</button>}
                </div>
            </form>
        </section>
    );
}