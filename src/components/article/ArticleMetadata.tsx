import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui';
import type { Article } from '../../types';

interface ArticleMetadataProps {
    article: Article;
    groupId: string;
}

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ article, groupId }) => {
    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">記事情報</h3>
                <div className="space-y-3">
                    <div>
                        <span className="font-medium text-gray-600">作成日:</span>
                        <p className="text-sm text-gray-700">
                            {new Date(article.created_at).toLocaleString()}
                        </p>
                    </div>
                    
                    {article.updated_at && (
                        <div>
                            <span className="font-medium text-gray-600">最終更新日:</span>
                            <p className="text-sm text-gray-700">
                                {new Date(article.updated_at).toLocaleString()}
                            </p>
                        </div>
                    )}
                    
                    <div>
                        <span className="font-medium text-gray-600">著者:</span>
                        <div className="flex items-center mt-1">
                            {article.author?.icon && (
                                <img 
                                    src={article.author.icon} 
                                    alt={article.author.username}
                                    className="w-6 h-6 rounded-full mr-2"
                                />
                            )}
                            <span className="text-sm text-gray-700">
                                {article.author?.username || "Unknown"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="font-medium text-gray-600">公開状態:</span>
                        <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                article.is_public 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {article.is_public ? '公開中' : '非公開'}
                            </span>
                        </div>
                    </div>

                    {article.tags && article.tags.length > 0 && (
                        <div>
                            <span className="font-medium text-gray-600">タグ:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {article.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {article.Series && article.Series.length > 0 && (
                        <div>
                            <span className="font-medium text-gray-600">所属シリーズ:</span>
                            <div className="mt-1 space-y-1">
                                {article.Series.map((series) => (
                                    <div key={series.id} className="text-sm">
                                        <Link 
                                            to={`/group/${groupId}/series/${series.id}`}
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {series.title}
                                        </Link>
                                        <span className="text-gray-500 ml-2">
                                            (シリーズ内)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <span className="font-medium text-gray-600">URL:</span>
                        <p className="text-sm text-gray-700 font-mono">
                            /{article.name}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ArticleMetadata;