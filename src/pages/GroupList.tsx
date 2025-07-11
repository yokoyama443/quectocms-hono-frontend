import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGroups } from "../libs/v1/group";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent, Button, Loading, Avatar } from "../components/ui";
import type { Group } from "../types";

export const GroupListPage = () => {
    const [groups, setGroups] = useState<Group[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getGroups();
                setGroups(data);
                
                // グループが存在しない場合は作成ページに自動遷移
                if (data.length === 0) {
                    navigate("/group/create");
                }
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [navigate]);

    if (loading) {
        return (
            <PageLayout title="グループ一覧 - QuectoCMS">
                <Loading />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="グループ一覧 - QuectoCMS">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">グループ一覧</h1>
                    <Link to="/group/create">
                        <Button variant="primary">
                            新しいグループを作成
                        </Button>
                    </Link>
                </div>

                {groups && groups.length > 0 ? (
                    <div className="grid gap-4">
                        {groups.map((group) => (
                            <Card key={group.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar name={group.name} size="lg" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {group.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    作成日: {new Date(group.created_at).toLocaleDateString('ja-JP')}
                                                </p>
                                                {group.webhook_url && (
                                                    <p className="text-sm text-green-600">
                                                        Webhook設定済み
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link to={`/group/${group.id}`}>
                                                <Button variant="primary" size="sm">
                                                    管理
                                                </Button>
                                            </Link>
                                            <Link to={`/group/${group.id}/article`}>
                                                <Button variant="secondary" size="sm">
                                                    記事
                                                </Button>
                                            </Link>
                                            <Link to={`/group/${group.id}/series`}>
                                                <Button variant="secondary" size="sm">
                                                    シリーズ
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500 mb-4">グループがまだありません</p>
                            <Link to="/group/create">
                                <Button variant="primary">
                                    最初のグループを作成
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageLayout>
    );
};