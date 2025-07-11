import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Card, CardContent, CardHeader } from '../ui';

interface ArticlePreviewProps {
    content: string;
    title?: string;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ content, title }) => {
    return (
        <Card className="mt-6">
            <CardHeader>
                <h3 className="text-lg font-semibold text-gray-700">
                    プレビュー
                    {title && <span className="text-sm font-normal text-gray-500 ml-2">- {title}</span>}
                </h3>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none">
                    <MDEditor.Markdown 
                        source={content || '*内容がありません*'} 
                        style={{ 
                            whiteSpace: 'pre-wrap',
                            backgroundColor: 'transparent',
                            color: 'inherit'
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ArticlePreview;