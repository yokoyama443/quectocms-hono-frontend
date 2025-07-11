import { useState } from "react";
import { login } from "../libs/auth/index";
import type { Login } from "../types/index";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout";
import { Input, Button } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const loginData: Login = { email: email, password: password }; 
            const loginResponse = await login(loginData);
            
            if (loginResponse === null) {
                setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
                return;
            }
            
            await refreshUser();
            navigate("/");
        } catch (error) {
            setError("ログイン中にエラーが発生しました。");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="アカウントにログイン"
            footerLink={{
                text: "新規アカウント作成",
                to: "/register"
            }}
        >
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleLogin}>
                <Input
                    label="メールアドレス"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <Input
                    label="パスワード"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
            </form>
        </AuthLayout>
    );
}