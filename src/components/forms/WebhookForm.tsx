import React, { useState } from 'react';
import { Input, Button } from '../ui';

interface WebhookFormProps {
  initialUrl?: string;
  onSubmit: (url: string | null) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const WebhookForm: React.FC<WebhookFormProps> = ({
  initialUrl = '',
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty URL is valid (removes webhook)
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedUrl = url.trim();
    
    if (trimmedUrl && !validateUrl(trimmedUrl)) {
      setError('有効なURLを入力してください');
      return;
    }
    
    onSubmit(trimmedUrl || null);
  };

  const handleClear = () => {
    setUrl('');
    onSubmit(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Webhook URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://your-app.vercel.app/api/revalidate"
        error={error}
      />
      
      <div className="text-sm text-gray-600">
        <p>記事の作成・更新時に指定したURLにGETリクエストが送信されます。</p>
        <p>Next.jsのOn-Demand Revalidationなどで利用できます。</p>
        <p>空にすると、Webhook送信を無効にできます。</p>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? '更新中...' : '更新'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          disabled={isLoading}
        >
          クリア
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
};

export default WebhookForm;