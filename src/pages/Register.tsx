import { useState } from "react";
import { register } from "../libs/auth/index";
import type { Register } from "../types/index";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout";
import { Input, Button } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hostPassword, setHostPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const registerData: Register = {
                username: username,
                email: email,
                password: password,
                host_password: hostPassword
            }; 
            const registerResponse = await register(registerData);
            
            if (registerResponse === null) {
                setError("登録に失敗しました。入力内容を確認してください。");
                return;
            }
            
            await refreshUser();
            navigate("/");
        } catch (error) {
            setError("登録中にエラーが発生しました。");
            console.error("Register error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="新規アカウント登録"
            subtitle="管理者から提供されたパスワードが必要です"
            footerLink={{
                text: "既存のアカウントでログイン",
                to: "/login"
            }}
        >
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleRegister}>
                <Input
                    label="ユーザー名"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

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
                    autoComplete="new-password"
                />

                <Input
                    label="アカウント作成用パスワード"
                    type="password"
                    value={hostPassword}
                    onChange={(e) => setHostPassword(e.target.value)}
                    required
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "登録中..." : "登録"}
                </Button>
            </form>
        </AuthLayout>
    );
}