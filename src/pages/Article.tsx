import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticle, deleteArticle, updateArticle } from "../libs/v1/article";
import type { Article, PatchedArticle } from "../types";
import MDEditor from '@uiw/react-md-editor';
import { uploadImage } from "../libs/v1/image";
import 'github-markdown-css/github-markdown-light.css';

export const ArticlePage = () => {
    const { groupId } = useParams();
    const { articleId } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [patchedArticle, setPatchedArticle] = useState<PatchedArticle | null>(null);
    const [isArticleEdit, setIsArticleEdit] = useState(false);
    const [isArticleDelete, setIsArticleDelete] = useState(false);
    //const [body, setBody] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Article';
        console.log(articleId);
        if (articleId === undefined || groupId === undefined) {
            return;
        }
        getArticle(Number.parseInt(groupId), Number.parseInt(articleId)).then((data) => {
            console.log(data);
            if (data === null) {
                alert("failed to fetch data");
                console.error("Failed to fetch data");
                return;
            }
            setArticle(data);
            
            if (data.tags === null) {
                return;
            }
            const tag_names = `#${data.tags?.map((tag) => tag.name).join(" #")}`;
            data.tag_names = tag_names;
            setPatchedArticle(data);
            console.log(tag_names);
        });
    }, [groupId, articleId]);

    async function handleDelete() {
        if (groupId === undefined || articleId === undefined) {
            return;
        }
        await deleteArticle(Number.parseInt(groupId), Number.parseInt(articleId));
        navigate(`/group/${groupId}`);
    }

    async function handleUpdate() {
        if (patchedArticle === null) {
            return;
        }
        if (groupId === undefined || articleId === undefined) {
            return;
        }
        
        updateArticle(Number.parseInt(groupId), Number.parseInt(articleId), patchedArticle).then((data) => {
            if (data === null) {
                alert("update failed");
                console.error("Failed to fetch data");
                return;
            }
            alert("update success");
            setIsArticleEdit(false);
            navigate(`/group/${groupId}/article/${articleId}`);
        });
    }

    async function onImagePasted(dataTransfer: DataTransfer,) {
        for (let i = 0; i < dataTransfer.files.length; i++) {
            const file = dataTransfer.files[i];
            const imageUrl = await uploadImage(file);
            if (imageUrl === null) {
                continue;
            }
            const insertedText = insertTextAtCursor(`![image](${imageUrl})`);
            if (insertedText === null) {
                continue;
            }
            setPatchedArticle({ ...patchedArticle, body: insertedText });
        }

    }

    function insertTextAtCursor(intsertString: string) {
        const markdownEditor = document.querySelector(".markdown-editor");
        if (markdownEditor === null) {
            return null;
        }
        const textarea = markdownEditor.querySelector("textarea");
        if (!textarea) {
            return null;
        }

        let sentence = textarea.value;
        const len = sentence.length;
        const pos = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const front = sentence.slice(0, pos);
        const back = sentence.slice(pos, len);

        sentence = front + intsertString + back;

        textarea.value = sentence;
        textarea.selectionEnd = end + intsertString.length;

        return sentence;
    }

    async function setThumnail(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) {
            return;
        }
        const file = e.target.files[0];
        const imageUrl = await uploadImage(file);
        if (imageUrl === null) {
            return;
        }
        setPatchedArticle({ ...patchedArticle, thumbnail: imageUrl });
    }


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">記事編集</h1>
                </div>
                
                {article === null ? (
                    <div className="p-6">
                        <p className="text-gray-600">読み込み中...</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                {isArticleEdit && (
                                    <>
                                        <button type="button" onClick={() => handleUpdate()} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
                                            保存
                                        </button>
                                        <button type="button" onClick={() => setIsArticleEdit(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300">
                                            キャンセル
                                        </button>
                                    </>
                                )}
                                {isArticleDelete && (
                                    <>
                                        <button type="button" onClick={() => handleDelete()} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
                                            削除確認
                                        </button>
                                        <button type="button" onClick={() => setIsArticleDelete(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300">
                                            キャンセル
                                        </button>
                                    </>
                                )}
                                {!isArticleEdit && !isArticleDelete && (
                                    <>
                                        <button type="button" onClick={() => setIsArticleEdit(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
                                            更新
                                        </button>
                                        <button type="button" onClick={() => setIsArticleDelete(true)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
                                            削除
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">公開設定:</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={article.is_public} onChange={(e) => setArticle({ ...article, is_public: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4  dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">記事名 (URL用、英数字とハイフンのみ)</label>
                                    <input type="text" value={patchedArticle?.name} onChange={(e) => setPatchedArticle({ ...patchedArticle, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                                    <input type="text" value={patchedArticle?.title} onChange={(e) => setPatchedArticle({ ...patchedArticle, title: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">説明文</label>
                                    <textarea value={patchedArticle?.description} onChange={(e) => setPatchedArticle({ ...patchedArticle, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows={3} />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ハッシュタグ</label>
                                    <input type="text" value={patchedArticle?.tag_names} onChange={(e) => setPatchedArticle({ ...patchedArticle, tag_names: e.target.value ? e.target.value : "" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">サムネイル</label>
                                    {patchedArticle?.thumbnail && (
                                        <img src={patchedArticle.thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-lg shadow-md mb-4" />
                                    )}
                                    <input type="file" onChange={setThumnail} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">記事情報</h3>
                                    <p><span className="font-medium">作成日:</span> {new Date(article.created_at).toLocaleString()}</p>
                                    <p><span className="font-medium">最終更新日:</span> {article.updated_at ? new Date(article.updated_at).toLocaleString() : ''}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                            <MDEditor
                                value={patchedArticle?.body}
                                onChange={(value) => setPatchedArticle({ ...patchedArticle, body: value })}
                                onPaste={async (event) => {
                                    await onImagePasted(event.clipboardData);
                                }}
                                onDrop={async (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    await onImagePasted(event.dataTransfer);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="w-full markdown-editor"
                                style={{ border: 'none' }}
                            />
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">プレビュー</h3>
                            <div className="border rounded-md p-4 bg-white markdown-body">
                                <MDEditor.Markdown className="markdown-body" source={patchedArticle?.body} style={{ whiteSpace: 'pre-wrap' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}