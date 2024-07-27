import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"
import { createGroup } from "../libs/v1/group";
import type { Group } from "../types";

export const GroupCreatePage = () => {
    const [group, setGroup] = useState<Group>({
        id: 0,
        name: "",
        created_at: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Group';
    }, []);


    async function handleCreateGroup() {
        console.log("create group");
        if (group === null) {
            return;
        }
        const createGroupResponse = await createGroup(group);
        if (createGroupResponse === null) {
            alert("グループ作成に失敗しました");
            console.error("Failed to fetch data");
            return;
        }
        alert("グループ作成に成功しました");
        navigate(`/group/${createGroupResponse.id}`);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            グループ作成
                        </h1>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                                    新しいグループ名
                                </label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={group.name}
                                    onChange={(e) => setGroup({ ...group, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => handleCreateGroup()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    作成
                                </button>
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    キャンセル
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
