import { useEffect, useState } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
// hooks
import { useAuthContext } from "./useAuthContext";
import { useCollection } from "./useCollection";
import { useFirestore } from "./useFirestore";

export const usePostLogic = ({ likes, comments, id, createdBy }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [postError, setPostEror] = useState(null);

    const { user } = useAuthContext();

    const { documents: usersCollection, error } = useCollection('users');

    const { deleteDocument, response: deleteResponse } = useFirestore('posts');
    const { updateDocument: updateLikes, response: likeResponse } = useFirestore('posts');
    const { updateDocument, response: commentResponse } = useFirestore('posts');
    const { updateDocument: updateLikedPosts, response: likedPostsResponse } = useFirestore('users');

    const errors = [
        error,
        postError,
        deleteResponse.error,
        likeResponse.error,
        commentResponse.error,
        likedPostsResponse.error,
    ];

    const filteredUserArr = usersCollection?.filter(u => u.id === user?.uid);
    const filteredUser = filteredUserArr?.[0];
    const likedPosts = filteredUser?.likedPosts;

    const userObj = {
        id: user?.uid,
        nickname: user?.displayName,
        photoURL: user?.photoURL
    };

    // check if user already liked 
    useEffect(() => {
        likedPosts
            ?.map(post => post.postId)
            .includes(id) && setIsLiked(true);
    }, [id, likedPosts]);

    const handleDatestamp = (createdAt) => {
        return formatDistanceToNow(createdAt.toDate(), { addSuffix: true });
    };

    const handleLike = async () => {
        try {
            setPostEror(null);
            !isLiked ? setIsLiked(true) : setIsLiked(false);

            // like
            if (!isLiked) {
                // update user's liked posts array
                await updateLikedPosts(user.uid, {
                    'likedPosts': [...likedPosts, { postId: id, }]
                });

                // update post's likes array
                await updateLikes(id, { 'likes': [...likes, userObj] });
            }
            // unlike
            if (isLiked) {
                const filteredPosts = likedPosts.filter(post => post.postId !== id);
                await updateLikedPosts(user.uid, { 'likedPosts': [...filteredPosts] });

                // remove a like from post's likes array
                const filteredLikes = likes
                    .filter(post => post.postId !== id)
                    .filter(post => post.id !== user.uid);

                await updateLikes(id, { 'likes': [...filteredLikes] });
            }
        } catch (err) {
            setPostEror(err.message);
        }
    };

    const handleComment = async (comment) => {
        try {
            await updateDocument(id, {
                'comments': [...comments, { author: userObj, body: comment, }]
            });
        } catch (err) {
            setPostEror(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDocument(id);
        } catch (err) {
            setPostEror(err.message);
        }
    };

    return { errors, isLiked, handleDelete, handleComment, handleLike, handleDatestamp };
};