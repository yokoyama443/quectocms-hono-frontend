import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSeriesById, updateSeries, updateSeriesArticles } from "../libs/v1/series";
import { getArticles } from "../libs/v1/article";
import type { Series, PatchedSeries, ArticleHeads, ArticleHead, PatchedSeriesArticle } from "../types";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent, Button, Loading } from "../components/ui";

export const SeriesDetailPage = () => {
    const { groupId, seriesId } = useParams();
    const [series, setSeries] = useState<Series | null>(null);
    const [articleHeads, setArticleHeads] = useState<ArticleHeads | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isArticleEditMode, setIsArticleEditMode] = useState(false);
    const [editForm, setEditForm] = useState<PatchedSeries>({
        name: "",
        title: "",
        tag_names: "",
    });
    const [selectedArticles, setSelectedArticles] = useState<PatchedSeriesArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadSeries = async () => {
        if (!groupId || !seriesId) return;
        
        setIsLoading(true);
        try {
            const data = await getSeriesById(Number.parseInt(groupId), Number.parseInt(seriesId));
            if (data) {
                setSeries(data);
                setEditForm({
                    name: data.name,
                    title: data.title,
                    tag_names: data.tags?.map(tag => tag.name).join(", ") || "",
                });
                setSelectedArticles(data.articles.map(article => ({
                    article_id: article.article.id,
                    priority: article.priority
                })));
            }
        } catch (error) {
            console.error("Failed to fetch series:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadArticles = async () => {
        if (!groupId) return;
        
        try {
            const data = await getArticles(Number.parseInt(groupId));
            setArticleHeads(data);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        }
    };

    useEffect(() => {
        document.title = 'Series Details';
        loadSeries();
        loadArticles();
    }, [groupId, seriesId]);

    const handleEditSeries = async () => {
        if (!groupId || !seriesId) return;
        
        setIsLoading(true);
        try {
            const data = await updateSeries(Number.parseInt(groupId), Number.parseInt(seriesId), editForm);
            if (data) {
                setSeries(data);
                setIsEditMode(false);
                alert("Series updated successfully");
            } else {
                alert("Failed to update series");
            }
        } catch (error) {
            console.error("Update series error:", error);
            alert("Failed to update series");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateArticles = async () => {
        if (!groupId || !seriesId) return;
        
        setIsLoading(true);
        try {
            const data = await updateSeriesArticles(Number.parseInt(groupId), Number.parseInt(seriesId), selectedArticles);
            if (data) {
                setSeries(data);
                setIsArticleEditMode(false);
                alert("Articles updated successfully");
            } else {
                alert("Failed to update articles");
            }
        } catch (error) {
            console.error("Update articles error:", error);
            alert("Failed to update articles");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddArticle = (article: ArticleHead) => {
        const maxPriority = selectedArticles.length > 0 
            ? Math.max(...selectedArticles.map(a => a.priority))
            : 0;
        
        setSelectedArticles(prev => [
            ...prev,
            { article_id: article.id, priority: maxPriority + 1 }
        ]);
    };

    const handleRemoveArticle = (articleId: number) => {
        setSelectedArticles(prev => {
            const filtered = prev.filter(a => a.article_id !== articleId);
            return filtered.map((article, index) => ({
                ...article,
                priority: index + 1
            }));
        });
    };

    const handleReorderArticle = (articleId: number, direction: 'up' | 'down') => {
        setSelectedArticles(prev => {
            const articles = [...prev];
            const index = articles.findIndex(a => a.article_id === articleId);
            
            if (index === -1) return prev;
            
            if (direction === 'up' && index > 0) {
                [articles[index], articles[index - 1]] = [articles[index - 1], articles[index]];
            } else if (direction === 'down' && index < articles.length - 1) {
                [articles[index], articles[index + 1]] = [articles[index + 1], articles[index]];
            }
            
            return articles.map((article, idx) => ({
                ...article,
                priority: idx + 1
            }));
        });
    };

    if (!groupId || !seriesId) {
        return <div>Invalid parameters</div>;
    }

    if (!series) {
        return <Loading />;
    }

    const availableArticles = articleHeads?.articles.filter(
        article => !selectedArticles.some(selected => selected.article_id === article.id)
    ) || [];

    const getArticleById = (id: number) => {
        return articleHeads?.articles.find(article => article.id === id);
    };

    return (
        <PageLayout title={series.title}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{series.title}</h1>
                        <p className="text-gray-600">/{series.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => setIsEditMode(true)}
                            disabled={isEditMode}
                        >
                            Edit Series
                        </Button>
                        <Link to={`/group/${groupId}/series`}>
                            <Button variant="secondary">Back to Series</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Series Information */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold">Series Information</h2>
                            </CardHeader>
                            <CardContent>
                                {isEditMode ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tags
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.tag_names || ""}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, tag_names: e.target.value }))}
                                                placeholder="tag1, tag2, tag3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleEditSeries} disabled={isLoading}>
                                                {isLoading ? "Saving..." : "Save"}
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                onClick={() => {
                                                    setIsEditMode(false);
                                                    setEditForm({
                                                        name: series.name,
                                                        title: series.title,
                                                        tag_names: series.tags?.map(tag => tag.name).join(", ") || "",
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700">Created</h3>
                                            <p className="text-sm text-gray-600">{new Date(series.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {series.updated_at && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700">Updated</h3>
                                                <p className="text-sm text-gray-600">{new Date(series.updated_at).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700">Articles</h3>
                                            <p className="text-sm text-gray-600">{series.articles.length} articles</p>
                                        </div>
                                        {series.tags && series.tags.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                                                <div className="flex flex-wrap gap-1">
                                                    {series.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Articles */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Articles</h2>
                                    <Button 
                                        onClick={() => setIsArticleEditMode(!isArticleEditMode)}
                                        variant="secondary"
                                    >
                                        {isArticleEditMode ? "Cancel" : "Manage Articles"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isArticleEditMode ? (
                                    <div className="space-y-4">
                                        {/* Selected Articles */}
                                        <div>
                                            <h3 className="text-md font-medium mb-2">Current Articles ({selectedArticles.length})</h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {selectedArticles
                                                    .sort((a, b) => a.priority - b.priority)
                                                    .map((selectedArticle, index) => {
                                                        const article = getArticleById(selectedArticle.article_id);
                                                        if (!article) return null;
                                                        
                                                        return (
                                                            <div key={article.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                                <span className="text-sm font-medium text-gray-600 w-8">
                                                                    {selectedArticle.priority}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <span className="text-sm font-medium">{article.title}</span>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="secondary"
                                                                        onClick={() => handleReorderArticle(article.id, 'up')}
                                                                        disabled={index === 0}
                                                                    >
                                                                        ↑
                                                                    </Button>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="secondary"
                                                                        onClick={() => handleReorderArticle(article.id, 'down')}
                                                                        disabled={index === selectedArticles.length - 1}
                                                                    >
                                                                        ↓
                                                                    </Button>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="danger"
                                                                        onClick={() => handleRemoveArticle(article.id)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>

                                        {/* Available Articles */}
                                        {availableArticles.length > 0 && (
                                            <div>
                                                <h3 className="text-md font-medium mb-2">Available Articles</h3>
                                                <div className="max-h-64 overflow-y-auto space-y-1">
                                                    {availableArticles.map((article) => (
                                                        <div key={article.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                                            <div>
                                                                <span className="text-sm font-medium">{article.title}</span>
                                                                <p className="text-xs text-gray-500">/{article.name}</p>
                                                            </div>
                                                            <Button 
                                                                size="sm" 
                                                                variant="secondary"
                                                                onClick={() => handleAddArticle(article)}
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="secondary" 
                                                onClick={() => {
                                                    setIsArticleEditMode(false);
                                                    setSelectedArticles(series.articles.map(article => ({
                                                        article_id: article.article.id,
                                                        priority: article.priority
                                                    })));
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button onClick={handleUpdateArticles} disabled={isLoading}>
                                                {isLoading ? "Saving..." : "Save Articles"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {series.articles.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">No articles in this series</p>
                                        ) : (
                                            series.articles
                                                .sort((a, b) => a.priority - b.priority)
                                                .map((article) => (
                                                    <div key={article.article.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
                                                        <span className="text-sm font-medium text-gray-600 w-8">
                                                            {article.priority}
                                                        </span>
                                                        <div className="flex-1">
                                                            <Link 
                                                                to={`/group/${groupId}/article/${article.article.id}`}
                                                                className="text-sm font-medium hover:text-blue-600"
                                                            >
                                                                {article.article.title}
                                                            </Link>
                                                            <p className="text-xs text-gray-500">/{article.article.name}</p>
                                                            {article.article.author && (
                                                                <p className="text-xs text-gray-500">
                                                                    by {article.article.author.username}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(article.article.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {isLoading && <Loading />}
            </div>
        </PageLayout>
    );
};