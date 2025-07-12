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
        // Try multiple possible selectors for the MDEditor textarea
        const selectors = [
            '.w-md-editor-text-area',
            '.w-md-editor textarea',
            '.w-md-editor-text textarea',
            'textarea[data-color-mode]',
            '.w-md-editor .w-md-editor-text-area',
            '.w-md-editor .w-md-editor-text textarea'
        ];
        
        let textarea: HTMLTextAreaElement | null = null;
        for (const selector of selectors) {
            textarea = document.querySelector(selector) as HTMLTextAreaElement;
            if (textarea) break;
        }
        
        if (!textarea) {
            console.warn('Could not find MDEditor textarea. Available textareas:', 
                document.querySelectorAll('textarea'));
            return null;
        }

        const sentence = textarea.value;
        const len = sentence.length;
        const pos = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const front = sentence.slice(0, pos);
        const back = sentence.slice(pos, len);

        const newSentence = front + insertString + back;
        textarea.value = newSentence;
        textarea.selectionEnd = end + insertString.length;

        // Trigger input event to notify React of the change
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);

        return newSentence;
    };

    const handleImagePasted = async (dataTransfer: DataTransfer) => {
        for (let i = 0; i < dataTransfer.files.length; i++) {
            const file = dataTransfer.files[i];
            if (!file.type.startsWith('image/')) continue;

            try {
                const imageUrl = await uploadImage(file);
                if (imageUrl) {
                    const imageMarkdown = `![image](${imageUrl})`;
                    
                    // Try to insert at cursor position first
                    const insertedText = insertTextAtCursor(imageMarkdown);
                    if (insertedText) {
                        onChange(insertedText);
                    } else {
                        // Fallback: append to current value
                        const currentValue = value || '';
                        const newValue = currentValue + (currentValue ? '\n\n' : '') + imageMarkdown;
                        onChange(newValue);
                        console.log('Inserted image at end of content:', imageMarkdown);
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