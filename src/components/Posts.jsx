// hooks
import { useCollection } from "../hooks/useCollection";
import { usePagination } from "../hooks/usePagination";
// components
import Post from "./Post";
import Spinner from "./Spinner";
import Pagination from "./Pagination";

export default function Posts() {
    const { documents, error } = useCollection('posts');
    const { currentItems, pageNums, paginate } = usePagination(
        documents?.sort((p1, p2) => {
            return (p1.createdAt > p2.createdAt) ? -1 : 1;
        }));

    return (
        <section className="container max-w-lg mx-auto">
            {error && <p>{error}</p>}
            {!documents && <Spinner />}
            {documents && currentItems.map(doc => (
                <Post key={doc.id} document={doc} />
            ))}
            <div className="py-3 flex justify-end">
                <Pagination pageNums={pageNums} paginate={paginate} />
            </div>
        </section>
    );
}