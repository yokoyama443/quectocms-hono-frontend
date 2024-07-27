import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import { getGroups, deleteGroup, updateGroup } from "../libs/v1/group";
import type { ArticleHeads, Group, PatchedGroup } from "../types";
import { getArticle, getArticles } from "../libs/v1/article";

export const GroupPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState<Group | null>(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [isGroupEdit, setIsGroupEdit] = useState(false);
    const [isGroupDelete, setIsGroupDelete] = useState(false);
    const [articleHeads, setArticleHeads] = useState<ArticleHeads | null>(null);
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

    }, [groupId]);


    async function handleDelete() {
        if (group === null) {
            return;
        }
        await deleteGroup(group.id);
        navigate("/");
    }

    async function handleUpdate(name: string) {
        if (group === null || name === "") {
            return;
        }
        const patchedGroup: PatchedGroup = { name: name };
        updateGroup(patchedGroup, group.id).then((data) => {
            if (data === null) {
                alert("update failed");
                console.error("Failed to fetch data");
                return;
            }
            alert("update success");
            setGroup(data);
            setIsGroupEdit(false);
        });
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {group ? group.name : 'グループページ'}
                        </h1>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                        {isGroupEdit && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                                        新しいグループ名
                                    </label>
                                    <input
                                        type="text"
                                        id="groupName"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdate(newGroupName)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        更新
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsGroupEdit(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        )}

                        {isGroupDelete && (
                            <div className="space-y-4">
                                <p className="text-red-600 font-medium">グループを削除しますか？この操作は取り消せません．</p>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete()}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        削除
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsGroupDelete(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isGroupEdit && !isGroupDelete && (
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsGroupEdit(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    グループ名変更
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGroupDelete(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    グループ削除
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">記事一覧</h2>
                            <Link to="article" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                記事作成
                            </Link>
                        </div>
                        {articleHeads === null ? (
                            <p className="text-gray-500">読み込み中...</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {articleHeads.articles.map((article) => (
                                    <li key={article.id} className="py-4">
                                        <Link
                                            to={`/group/${groupId}/article/${article.id}`}
                                            className="flex items-center hover:bg-gray-50 rounded-md p-2 transition duration-150 ease-in-out"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{article.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{new Date(article.created_at).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
