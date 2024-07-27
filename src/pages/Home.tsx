import { useEffect, useState } from "react";
import type { Group } from "../types";
import { Link } from "react-router-dom";
import { getGroups } from "../libs/v1/group";

export default function Home() {
    const [groups, setGroups] = useState<Group[] | null>(null);
    
    useEffect(() => {
        document.title = 'ホーム';
        getGroups().then((data) => {
            console.log(data);
            setGroups(data);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="bg-white shadow rounded-lg mb-8">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">ホーム</h1>
                    </div>
                </header>

                <main>
                    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <p className="text-gray-700 mb-4">ようこそ！</p>
                            <div className="flex space-x-4">
                                <Link to="/about" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    About
                                </Link>
                                <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    ログイン
                                </Link>
                                <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    新規登録
                                </Link>
                            </div>
                        </div>
                        
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">グループ一覧</h2>
                                <Link to="/group" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        グループ作成
                                </Link>
                            </div>
                            {groups === null ? (
                                <p className="text-gray-500">読み込み中...</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {groups.map((group) => (
                                        <li key={group.id} className="py-4">
                                            <Link to={`/group/${group.id}`} className="flex items-center space-x-4 hover:bg-gray-50 rounded-md p-2 transition duration-150 ease-in-out">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">{group.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{group.name}</p>
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
                </main>
            </div>
        </div>
    );
}