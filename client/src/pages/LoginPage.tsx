import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { getGithubLogin } from "../api/api";

export default function LoginPage() {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/admin")
        }
    }, [user])

    async function handleGithubLogin() {
        const url = await getGithubLogin()
        window.location.assign(url)
    }
    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleGithubLogin}>Login with Github</button>
        </div>
    )
}