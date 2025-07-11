import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import { getGroups, deleteGroup, updateGroup, updateGroupWebhook } from "../libs/v1/group";
import type { ArticleHeads, Group, PatchedGroup, OutAPI, PostOutAPI } from "../types";
import { getArticles } from "../libs/v1/article";
import { deleteOutAPI, getOutAPIs, createOutAPI } from "../libs/v1/outapi";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent, Button, Loading, Modal } from "../components/ui";
import { GroupForm, OutAPIForm, WebhookForm } from "../components/forms";

export const GroupPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState<Group | null>(null);
    const [articleHeads, setArticleHeads] = useState<ArticleHeads | null>(null);
    const [outAPIs, setOutAPIs] = useState<OutAPI[] | null>(null);
    const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false);
    const [isGroupDeleteModalOpen, setIsGroupDeleteModalOpen] = useState(false);
    const [isOutAPICreateModalOpen, setIsOutAPICreateModalOpen] = useState(false);
    const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Group';
        console.log(groupId);
        if (groupId === undefined) {
            return;
        }
        getGroups().then((data) => {
            console.log(data);
            if (data === null) {
                alert("failed to fetch data");
                console.error("Failed to fetch data");
                return;
            }
            const group = data.find((group) => group.id === Number.parseInt(groupId));
            if (group === undefined) {
                return;
            }
            setGroup(group);
        });

        getArticles(Number.parseInt(groupId)).then((data) => {
            setArticleHeads(data);
        });

        getOutAPIs(Number.parseInt(groupId)).then((data) => {
            setOutAPIs(data);
        });

    }, [groupId]);


    const handleDeleteGroup = async () => {
        if (!group) return;
        
        setIsLoading(true);
        try {
            await deleteGroup(group.id);
            navigate("/");
        } catch (error) {
            console.error("Delete group error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateGroup = async (name: string) => {
        if (!group || !name) return;
        
        setIsLoading(true);
        try {
            const patchedGroup: PatchedGroup = { name: name };
            const data = await updateGroup(patchedGroup, group.id);
            
            if (data === null) {
                throw new Error("Update failed");
            }
            
            setGroup(data);
            setIsGroupEditModalOpen(false);
        } catch (error) {
            console.error("Update group error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOutAPI = async (name: string, password: string) => {
        if (!groupId) return;
        
        setIsLoading(true);
        try {
            const postOutAPI: PostOutAPI = { name, password };
            const data = await createOutAPI(Number.parseInt(groupId), postOutAPI);
            
            if (data === null) {
                throw new Error("Failed to create outapi");
            }
            
            setOutAPIs([...(outAPIs ?? []), data]);
            setIsOutAPICreateModalOpen(false);
        } catch (error) {
            console.error("Create OutAPI error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOutAPI = async (outAPIId: number) => {
        if (!groupId) return;
        
        try {
            await deleteOutAPI(Number.parseInt(groupId), outAPIId);
            setOutAPIs(outAPIs?.filter(api => api.id !== outAPIId) ?? []);
        } catch (error) {
            console.error("Delete OutAPI error:", error);
        }
    };

    const handleUpdateWebhook = async (webhookUrl: string | null) => {
        if (!group) return;
        
        setIsLoading(true);
        try {
            const updatedGroup = await updateGroupWebhook(group.id, webhookUrl);
            
            if (updatedGroup === null) {
                throw new Error("Failed to update webhook");
            }
            
            setGroup(updatedGroup);
            setIsWebhookModalOpen(false);
        } catch (error) {
            console.error("Update webhook error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout title={`${group?.name || 'グループ'} - QuectoCMS`}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {group ? group.name : 'グループページ'}
                                </h1>
                                <p className="text-gray-600 mt-2">記事とAPIを管理します</p>
                                {group?.webhook_url && (
                                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Webhook設定済み
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsWebhookModalOpen(true)}
                                >
                                    Webhook設定
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsGroupEditModalOpen(true)}
                                >
                                    名前変更
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setIsGroupDeleteModalOpen(true)}
                                >
                                    グループ削除
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">記事一覧</h2>
                            <Link to="article/create">
                                <Button variant="primary" size="sm">
                                    記事作成
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {articleHeads === null ? (
                            <Loading text="記事を読み込み中..." />
                        ) : articleHeads.articles.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">記事がまだありません</p>
                                <Link to="article/create">
                                    <Button variant="primary">
                                        最初の記事を作成
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {articleHeads.articles.map((article) => (
                                    <Link
                                        key={article.id}
                                        to={`/group/${groupId}/article/${article.id}`}
                                        className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition duration-150 ease-in-out"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {article.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {new Date(article.created_at).toLocaleDateString()}
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

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">シリーズ一覧</h2>
                            <Link to="series">
                                <Button variant="primary" size="sm">
                                    シリーズ管理
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-4">
                            <p className="text-gray-500 mb-4">複数の記事をシリーズとしてグループ化</p>
                            <Link to="series">
                                <Button variant="secondary">
                                    シリーズページへ
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">出力API一覧</h2>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsOutAPICreateModalOpen(true)}
                            >
                                API作成
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {outAPIs === null ? (
                            <Loading text="APIを読み込み中..." />
                        ) : outAPIs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">出力APIがまだありません</p>
                                <Button
                                    variant="primary"
                                    onClick={() => setIsOutAPICreateModalOpen(true)}
                                >
                                    最初のAPIを作成
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {outAPIs.map((outAPI) => (
                                    <div
                                        key={outAPI.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {outAPI.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                外部API
                                            </p>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteOutAPI(outAPI.id)}
                                        >
                                            削除
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Group Edit Modal */}
            <Modal
                isOpen={isGroupEditModalOpen}
                onClose={() => setIsGroupEditModalOpen(false)}
                title="グループ名を変更"
            >
                <GroupForm
                    initialName={group?.name || ''}
                    onSubmit={handleUpdateGroup}
                    onCancel={() => setIsGroupEditModalOpen(false)}
                    isLoading={isLoading}
                    submitLabel="更新"
                />
            </Modal>

            {/* Group Delete Confirmation Modal */}
            <Modal
                isOpen={isGroupDeleteModalOpen}
                onClose={() => setIsGroupDeleteModalOpen(false)}
                title="グループを削除"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        「{group?.name}」を削除しますか？この操作は取り消せません。
                    </p>
                    <div className="flex space-x-3">
                        <Button
                            variant="danger"
                            onClick={handleDeleteGroup}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? '削除中...' : '削除'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsGroupDeleteModalOpen(false)}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* OutAPI Create Modal */}
            <Modal
                isOpen={isOutAPICreateModalOpen}
                onClose={() => setIsOutAPICreateModalOpen(false)}
                title="新しい出力APIを作成"
            >
                <OutAPIForm
                    onSubmit={handleCreateOutAPI}
                    onCancel={() => setIsOutAPICreateModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* Webhook Settings Modal */}
            <Modal
                isOpen={isWebhookModalOpen}
                onClose={() => setIsWebhookModalOpen(false)}
                title="Webhook設定"
                size="lg"
            >
                <WebhookForm
                    initialUrl={group?.webhook_url || ''}
                    onSubmit={handleUpdateWebhook}
                    onCancel={() => setIsWebhookModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>
        </PageLayout>
    );
}
