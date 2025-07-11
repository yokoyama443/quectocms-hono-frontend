import React, { useState } from 'react';
import { Input, Button } from '../ui';

interface GroupFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const GroupForm: React.FC<GroupFormProps> = ({
  initialName = '',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = '作成'
}) => {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="グループ名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="グループ名を入力してください"
      />
      
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="flex-1"
        >
          {isLoading ? '処理中...' : submitLabel}
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

export default GroupForm;