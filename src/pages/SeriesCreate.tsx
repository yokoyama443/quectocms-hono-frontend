import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSeries } from "../libs/v1/series";
import { getArticles } from "../libs/v1/article";
import type { PatchedSeries, ArticleHeads, ArticleHead } from "../types";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent, Button, Loading } from "../components/ui";

export const SeriesCreatePage = () => {
    const { groupId } = useParams();
    const [series, setSeries] = useState<PatchedSeries>({
        name: "",
        title: "",
        tag_names: "",
    });
    const [articleHeads, setArticleHeads] = useState<ArticleHeads | null>(null);
    const [selectedArticles, setSelectedArticles] = useState<{article_id: number, priority: number}[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Create New Series';
        
        if (groupId) {
            // Load available articles
            getArticles(Number.parseInt(groupId)).then((data) => {
                setArticleHeads(data);
            });
        }
    }, [groupId]);

    const handleInputChange = (field: keyof PatchedSeries, value: string) => {
        setSeries(prev => ({
            ...prev,
            [field]: value
        }));
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
            // Reorder priorities
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
            
            // Update priorities
            return articles.map((article, idx) => ({
                ...article,
                priority: idx + 1
            }));
        });
    };

    const handleCreate = async () => {
        if (!groupId || !series.name || !series.title) {
            alert("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        try {
            const seriesData: PatchedSeries = {
                ...series,
                // Include articles if any are selected
                ...(selectedArticles.length > 0 && {
                    articles: selectedArticles.map(article => ({
                        priority: article.priority,
                        article: { id: article.article_id } as any,
                        article_id: article.article_id
                    }))
                })
            };

            const data = await createSeries(Number.parseInt(groupId), seriesData);
            if (data === null) {
                alert("Failed to create series");
                return;
            }
            
            alert("Series created successfully");
            navigate(`/group/${groupId}/series/${data.id}`);
        } catch (error) {
            console.error("Create series error:", error);
            alert("Failed to create series");
        } finally {
            setIsLoading(false);
        }
    };

    if (!groupId) {
        return <div>Invalid group ID</div>;
    }

    const availableArticles = articleHeads?.articles.filter(
        article => !selectedArticles.some(selected => selected.article_id === article.id)
    ) || [];

    const getArticleById = (id: number) => {
        return articleHeads?.articles.find(article => article.id === id);
    };

    return (
        <PageLayout title="Create New Series">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Series</h1>
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate(`/group/${groupId}/series`)}
                    >
                        Back to Series
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Basic Information</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name (URL-friendly identifier) *
                                </label>
                                <input
                                    type="text"
                                    value={series.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="series-name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Used in URLs. Use lowercase letters, numbers, and hyphens only.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={series.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Series Title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={series.tag_names || ""}
                                    onChange={(e) => handleInputChange('tag_names', e.target.value)}
                                    placeholder="tag1, tag2, tag3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Comma-separated list of tags
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Article Selection */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Articles (Optional)</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Selected Articles */}
                            {selectedArticles.length > 0 && (
                                <div>
                                    <h3 className="text-md font-medium mb-2">Selected Articles ({selectedArticles.length})</h3>
                                    <div className="space-y-2">
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
                            )}

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

                            {availableArticles.length === 0 && selectedArticles.length === 0 && (
                                <p className="text-gray-500 text-center py-4">
                                    No articles available. Create some articles first.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate(`/group/${groupId}/series`)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreate}
                            disabled={isLoading || !series.name || !series.title}
                        >
                            {isLoading ? "Creating..." : "Create Series"}
                        </Button>
                    </div>
                </div>

                {isLoading && <Loading />}
            </div>
        </PageLayout>
    );
};