import AuthContext from "@/app/context/AuthContext";
import { useContext } from "react";

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);

    return (
        <button type="button" className="mt-5 btn btn-primary" onClick={logout}>Log out</button>
    )
}

export default LogoutButton;