import React, { useState } from 'react';
import { uploadImage } from '../../libs/v1/image';
import { Input } from '../ui';
import type { Article, PatchedArticle } from '../../types';

interface ArticleFormProps {
    article: Article | PatchedArticle;
    onChange: (field: keyof (Article | PatchedArticle), value: any) => void;
    disabled?: boolean;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
    article,
    onChange,
    disabled = false
}) => {
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

    const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        try {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                onChange('thumbnail', imageUrl);
            }
        } catch (error) {
            console.error('Failed to upload thumbnail:', error);
            alert('サムネイルのアップロードに失敗しました');
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const formatTagNames = (value: string) => {
        // Split by spaces and commas, filter empty tags, and remove symbols
        const tags = value.split(/[,\s]+/)
            .filter(tag => tag.trim())
            .map(tag => {
                // Remove # if present and clean the tag (remove symbols but keep letters, numbers, and various characters)
                const cleanTag = tag.replace(/^#/, '').replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/g, '');
                return cleanTag ? `#${cleanTag}` : '';
            })
            .filter(tag => tag !== '')
            .join(' ');
        return tags;
    };

    const handleTagChange = (value: string) => {
        onChange('tag_names', value);
    };

    const handleTagBlur = (value: string) => {
        onChange('tag_names', formatTagNames(value));
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            記事名 (URL用、英数字とハイフンのみ) *
                        </label>
                        <Input
                            type="text"
                            value={article.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder="article-name"
                            disabled={disabled}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            URLに使用されます。英小文字、数字、ハイフンのみ使用可能
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            タイトル *
                        </label>
                        <Input
                            type="text"
                            value={article.title || ''}
                            onChange={(e) => onChange('title', e.target.value)}
                            placeholder="記事のタイトル"
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            説明文
                        </label>
                        <textarea
                            value={article.description || ''}
                            onChange={(e) => onChange('description', e.target.value)}
                            placeholder="記事の概要や説明"
                            disabled={disabled}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            タグ
                        </label>
                        <Input
                            type="text"
                            value={article.tag_names || ''}
                            onChange={(e) => handleTagChange(e.target.value)}
                            onBlur={(e) => handleTagBlur(e.target.value)}
                            placeholder="技術 React JavaScript プログラミング"
                            disabled={disabled}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            文字・数字・日本語など使用可能（記号は除く）。スペースまたはカンマで区切ってください
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            サムネイル
                        </label>
                        {article.thumbnail && (
                            <div className="mb-3">
                                <img 
                                    src={article.thumbnail} 
                                    alt="Thumbnail preview" 
                                    className="w-full h-48 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            disabled={disabled || isUploadingThumbnail}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        />
                        {isUploadingThumbnail && (
                            <p className="text-sm text-blue-600 mt-1">アップロード中...</p>
                        )}
                    </div>

                    {/* Public Setting */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                公開設定
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={article.is_public || false}
                                    onChange={(e) => onChange('is_public', e.target.checked)}
                                    disabled={disabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {article.is_public ? '記事は公開されます' : '記事は非公開です'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleForm;