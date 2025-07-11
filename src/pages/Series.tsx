import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSeries, deleteSeries } from "../libs/v1/series";
import type { SeriesHeads, SeriesHead } from "../types";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent, Button, Loading, Modal } from "../components/ui";

export const SeriesPage = () => {
    const { groupId } = useParams();
    const [seriesHeads, setSeriesHeads] = useState<SeriesHeads | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<SeriesHead | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [tagsFilter, setTagsFilter] = useState("");

    const loadSeries = async (page: number = 1, tags?: string) => {
        if (!groupId) return;
        
        setIsLoading(true);
        try {
            const data = await getSeries(Number.parseInt(groupId), page, 10, tags);
            setSeriesHeads(data);
        } catch (error) {
            console.error("Failed to fetch series:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Series';
        loadSeries(currentPage, tagsFilter || undefined);
    }, [groupId, currentPage, tagsFilter]);

    const handleDeleteSeries = async () => {
        if (!selectedSeries || !groupId) return;
        
        setIsLoading(true);
        try {
            const success = await deleteSeries(Number.parseInt(groupId), selectedSeries.id);
            if (success) {
                await loadSeries(currentPage, tagsFilter || undefined);
                setIsDeleteModalOpen(false);
                setSelectedSeries(null);
            } else {
                alert("Failed to delete series");
            }
        } catch (error) {
            console.error("Delete series error:", error);
            alert("Failed to delete series");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleTagsFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagsFilter(event.target.value);
        setCurrentPage(1);
    };

    if (!groupId) {
        return <div>Invalid group ID</div>;
    }

    return (
        <PageLayout title="Series Management">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Series</h1>
                    <div className="flex gap-2">
                        <Link to={`/group/${groupId}/series/create`}>
                            <Button>Create New Series</Button>
                        </Link>
                        <Link to={`/group/${groupId}`}>
                            <Button variant="secondary">Back to Group</Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Filter by tags (comma-separated)"
                                value={tagsFilter}
                                onChange={handleTagsFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && <Loading />}

                {/* Series List */}
                {seriesHeads && (
                    <>
                        <div className="grid gap-4 mb-6">
                            {seriesHeads.series.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-8">
                                        <p className="text-gray-500">No series found</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                seriesHeads.series.map((series) => (
                                    <Card key={series.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        <Link 
                                                            to={`/group/${groupId}/series/${series.id}`}
                                                            className="hover:text-blue-600"
                                                        >
                                                            {series.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-gray-500">/{series.name}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link to={`/group/${groupId}/series/${series.id}/edit`}>
                                                        <Button size="sm" variant="secondary">Edit</Button>
                                                    </Link>
                                                    <Button 
                                                        size="sm" 
                                                        variant="danger"
                                                        onClick={() => {
                                                            setSelectedSeries(series);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{series.articles.length} articles</span>
                                                <span>•</span>
                                                <span>Created: {new Date(series.created_at).toLocaleDateString()}</span>
                                                {series.updated_at && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Updated: {new Date(series.updated_at).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                            </div>
                                            {series.tags && series.tags.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {series.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {seriesHeads.total_pages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Page {currentPage} of {seriesHeads.total_pages}
                                </span>
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === seriesHeads.total_pages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedSeries(null);
                    }}
                    title="Delete Series"
                >
                    <div className="space-y-4">
                        <p>
                            Are you sure you want to delete the series "{selectedSeries?.title}"? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSelectedSeries(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteSeries}
                                disabled={isLoading}
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </PageLayout>
    );
};