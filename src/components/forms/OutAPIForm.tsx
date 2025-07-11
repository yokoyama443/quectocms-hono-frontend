import React, { useState } from 'react';
import { Input, Button } from '../ui';

interface OutAPIFormProps {
  onSubmit: (name: string, password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const OutAPIForm: React.FC<OutAPIFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      onSubmit(name.trim(), password.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="API名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="API名を入力してください"
      />
      
      <Input
        label="パスワード"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="パスワードを入力してください"
      />
      
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !name.trim() || !password.trim()}
          className="flex-1"
        >
          {isLoading ? '作成中...' : '作成'}
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

export default OutAPIForm;