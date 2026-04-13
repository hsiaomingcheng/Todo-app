import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
    const { userDetails } = useAuth();

    return (
        <div>
            <h1>Profile Page</h1>
            <p>User Account: {userDetails?.user_account}</p>
            <p>Email: {userDetails?.email}</p>
            <p>First Name: {userDetails?.first_name}</p>
            <p>Last Name: {userDetails?.last_name}</p>
        </div>
    );
}