import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { uploadImage } from '../../libs/v1/image';

interface ArticleEditorProps {
    value?: string;
    onChange: (value?: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
    value,
    onChange,
    placeholder = "記事の内容を入力してください...",
    disabled = false
}) => {
    const insertTextAtCursor = (insertString: string): string | null => {
        const textarea = document.querySelector('.w-md-editor-text-area') as HTMLTextAreaElement;
        if (!textarea) return null;

        const sentence = textarea.value;
        const len = sentence.length;
        const pos = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const front = sentence.slice(0, pos);
        const back = sentence.slice(pos, len);

        const newSentence = front + insertString + back;
        textarea.value = newSentence;
        textarea.selectionEnd = end + insertString.length;

        return newSentence;
    };

    const handleImagePasted = async (dataTransfer: DataTransfer) => {
        for (let i = 0; i < dataTransfer.files.length; i++) {
            const file = dataTransfer.files[i];
            if (!file.type.startsWith('image/')) continue;

            try {
                const imageUrl = await uploadImage(file);
                if (imageUrl) {
                    const insertedText = insertTextAtCursor(`![image](${imageUrl})`);
                    if (insertedText) {
                        onChange(insertedText);
                    }
                }
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                本文
            </label>
            <MDEditor
                value={value}
                onChange={onChange}
                onPaste={async (event) => {
                    await handleImagePasted(event.clipboardData);
                }}
                onDrop={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    await handleImagePasted(event.dataTransfer);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                data-color-mode="light"
                preview="edit"
                hideToolbar={disabled}
                visibleDragbar={!disabled}
                textareaProps={{
                    placeholder,
                    disabled,
                    style: {
                        fontSize: 14,
                        lineHeight: 1.5,
                        fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
                    }
                }}
                height={400}
                style={{
                    backgroundColor: disabled ? '#f9fafb' : '#ffffff',
                }}
            />
            {!disabled && (
                <p className="text-xs text-gray-500">
                    画像をドラッグ&ドロップまたはペーストして挿入できます
                </p>
            )}
        </div>
    );
};

export default ArticleEditor;