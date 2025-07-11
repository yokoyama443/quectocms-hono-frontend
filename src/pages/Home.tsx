import { useEffect, useState } from "react";
import type { Group } from "../types";
import { Link } from "react-router-dom";
import { getGroups } from "../libs/v1/group";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent, Button, Loading, Avatar } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
    const [groups, setGroups] = useState<Group[] | null>(null);
    const { user } = useAuth();
    
    useEffect(() => {
        getGroups().then((data) => {
            console.log(data);
            setGroups(data);
        });
    }, []);

    return (
        <PageLayout title="ホーム - QuectoCMS">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-gray-900">QuectoCMS へようこそ！</h1>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/about">
                                <Button variant="secondary" className="w-full">
                                    About
                                </Button>
                            </Link>
                            {!user ? (
                                <>
                                    <Link to="/login">
                                        <Button variant="success" className="w-full">
                                            ログイン
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" className="w-full">
                                            新規登録
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/group">
                                        <Button variant="primary" className="w-full">
                                            グループ管理
                                        </Button>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin/users">
                                            <Button variant="success" className="w-full">
                                                ユーザー管理
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">グループ一覧</h2>
                            <Link to="/group/create">
                                <Button variant="primary" size="sm">
                                    グループ作成
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {groups === null ? (
                            <Loading text="グループを読み込み中..." />
                        ) : groups.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">グループがまだありません</p>
                                <Link to="/group/create">
                                    <Button variant="primary">
                                        最初のグループを作成
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {groups.map((group) => (
                                    <Link
                                        key={group.id}
                                        to={`/group/${group.id}`}
                                        className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition duration-150 ease-in-out"
                                    >
                                        <Avatar name={group.name} size="md" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {group.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                グループ
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
}
