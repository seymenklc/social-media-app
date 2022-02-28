// components
import Create from "../components/Create";
import Posts from "../components/Posts";
import UsersList from "../components/UsersList";

export default function Dashboard() {
    return (
        <>
            <Create />
            <UsersList />
            <Posts />
        </>
    );
}