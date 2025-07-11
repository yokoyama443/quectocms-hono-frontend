import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getArticle, createArticle, updateArticle, deleteArticle } from '../libs/v1/article';
import { PageLayout } from '../components/layout';
import { Card, CardContent, Loading } from '../components/ui';
import { 
    ArticleForm, 
    ArticleEditor, 
    ArticleMetadata, 
    ArticleActions, 
    ArticlePreview 
} from '../components/article';
import type { Article, PatchedArticle } from '../types';
import MDEditor from '@uiw/react-md-editor';
import 'github-markdown-css/github-markdown-light.css';

type ArticleMode = 'create' | 'view' | 'edit';

export const ArticleManagerPage: React.FC = () => {
    const { groupId, articleId } = useParams<{ groupId: string; articleId?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State management
    const [mode, setMode] = useState<ArticleMode>('create');
    const [article, setArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState<Article | PatchedArticle>({
        id: 0,
        created_at: '',
        author: { id: 0, username: '', created_at: '', detail: '', icon: '' },
        name: '',
        title: '',
        description: '',
        body: '',
        thumbnail: '',
        tag_names: '',
        is_public: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Determine mode and load data
    useEffect(() => {
        if (!groupId) return;

        const path = location.pathname;
        
        if (path.endsWith('/create') || (!articleId && path.endsWith('/article'))) {
            // Create mode
            setMode('create');
            document.title = '新規記事作成';
        } else if (articleId) {
            if (path.endsWith('/edit')) {
                // Edit mode
                setMode('edit');
                loadArticle(parseInt(articleId));
            } else {
                // View mode
                setMode('view');
                loadArticle(parseInt(articleId));
            }
        }
    }, [groupId, articleId, location.pathname]);

    const loadArticle = async (id: number) => {
        if (!groupId) return;
        
        setIsLoading(true);
        try {
            const data = await getArticle(parseInt(groupId), id);
            if (!data) {
                alert('記事が見つかりませんでした');
                navigate(`/group/${groupId}`);
                return;
            }
            
            setArticle(data);
            // Format tags for editing
            const tagNames = data.tags?.map(tag => `#${tag.name}`).join(' ') || '';
            setFormData({ ...data, tag_names: tagNames });
            document.title = `${data.title} - 記事編集`;
        } catch (error) {
            console.error('Failed to load article:', error);
            alert('記事の読み込みに失敗しました');
            navigate(`/group/${groupId}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldChange = (field: keyof (Article | PatchedArticle), value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!groupId) return;

        // Validation
        if (!formData.name || !formData.title) {
            alert('記事名とタイトルは必須です');
            return;
        }

        // Validate article name format
        if (!/^[a-z0-9-]+$/.test(formData.name)) {
            alert('記事名は英小文字、数字、ハイフンのみ使用できます');
            return;
        }

        setIsSaving(true);
        try {
            if (mode === 'create') {
                const newArticle = await createArticle(parseInt(groupId), formData as Article);
                if (newArticle) {
                    alert('記事が作成されました');
                    navigate(`/group/${groupId}/article/${newArticle.id}`);
                } else {
                    alert('記事の作成に失敗しました');
                }
            } else if (mode === 'edit' && articleId) {
                const updatedArticle = await updateArticle(
                    parseInt(groupId), 
                    parseInt(articleId), 
                    formData as PatchedArticle
                );
                if (updatedArticle) {
                    setArticle(updatedArticle);
                    setMode('view');
                    alert('記事が更新されました');
                    // Reload to get fresh data
                    await loadArticle(parseInt(articleId));
                } else {
                    alert('記事の更新に失敗しました');
                }
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('保存に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = () => {
        if (articleId) {
            navigate(`/group/${groupId}/article/${articleId}/edit`);
        }
    };

    const handleCancelEdit = () => {
        if (articleId) {
            navigate(`/group/${groupId}/article/${articleId}`);
        }
    };

    const handleDelete = async () => {
        if (!groupId || !articleId) return;

        try {
            await deleteArticle(parseInt(groupId), parseInt(articleId));
            alert('記事が削除されました');
            navigate(`/group/${groupId}`);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('削除に失敗しました');
        }
    };

    // Permission checks (simplified - in real app, check user roles)
    const canEdit = true; // TODO: Check user permissions
    const canDelete = true; // TODO: Check user permissions

    if (isLoading) {
        return (
            <PageLayout title="記事を読み込み中...">
                <div className="flex justify-center items-center min-h-64">
                    <Loading />
                </div>
            </PageLayout>
        );
    }

    const pageTitle = mode === 'create' 
        ? '新規記事作成' 
        : mode === 'edit' 
            ? `${article?.title || '記事'} - 編集`
            : article?.title || '記事';

    const isEditing = mode === 'edit' || mode === 'create';

    return (
        <PageLayout title={pageTitle}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                            {mode !== 'create' && article && (
                                <p className="text-gray-600 mt-1">/{article.name}</p>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    {showPreview ? 'プレビューを隠す' : 'プレビューを表示'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <ArticleForm
                                            article={formData}
                                            onChange={handleFieldChange}
                                            disabled={isSaving}
                                        />
                                        
                                        <ArticleEditor
                                            value={formData.body}
                                            onChange={(value) => handleFieldChange('body', value)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Article Display */}
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                                {article?.title}
                                            </h2>
                                            {article?.description && (
                                                <p className="text-lg text-gray-600 mb-6">
                                                    {article.description}
                                                </p>
                                            )}
                                            {article?.thumbnail && (
                                                <img 
                                                    src={article.thumbnail} 
                                                    alt={article.title}
                                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                                />
                                            )}
                                        </div>
                                        
                                        {/* Article Content */}
                                        <div className="prose prose-lg max-w-none">
                                            <div className="markdown-body">
                                                {article?.body ? (
                                                    <MDEditor.Markdown 
                                                        source={article.body} 
                                                        style={{ 
                                                            whiteSpace: 'pre-wrap',
                                                            backgroundColor: 'transparent'
                                                        }}
                                                    />
                                                ) : (
                                                    <p className="text-gray-500 italic">内容がありません</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        {isEditing && showPreview && (
                            <ArticlePreview 
                                content={formData.body || ''} 
                                title={formData.title}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {mode !== 'create' && article && (
                            <ArticleMetadata 
                                article={article} 
                                groupId={groupId!} 
                            />
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8">
                    <ArticleActions
                        isCreate={mode === 'create'}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        groupId={groupId!}
                        articleId={articleId ? parseInt(articleId) : undefined}
                        onSave={handleSave}
                        onEdit={handleEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default ArticleManagerPage;