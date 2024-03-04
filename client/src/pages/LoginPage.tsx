import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { getGithubLogin } from "../api/api";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl mb-10">Login with One of Your Accounts</h1>
            <Button onClick={handleGithubLogin}>Login with Github</Button>
        </div>
    )
}