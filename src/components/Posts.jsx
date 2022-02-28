// hooks
import { useCollection } from "../hooks/useCollection";
// components
import Post from "./Post";
import Spinner from "./Spinner";

export default function Posts() {
    const { documents, error } = useCollection('posts');

    // sorting docs by createdAt property
    const sortedDocuments = documents
        ?.sort((p1, p2) => (p1.createdAt > p2.createdAt) ? -1 : 1);

    return (
        <section>
            {error && <p>{error}</p>}
            {!documents && <Spinner />}
            {documents && sortedDocuments.map(doc => (
                <Post key={doc.id} document={doc} />
            ))}
        </section>
    );
}