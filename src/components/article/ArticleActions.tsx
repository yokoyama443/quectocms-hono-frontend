import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '../ui';

interface ArticleActionsProps {
    isCreate: boolean;
    isEditing: boolean;
    isSaving: boolean;
    canEdit: boolean;
    canDelete: boolean;
    groupId: string;
    articleId?: number;
    onSave: () => void;
    onEdit: () => void;
    onCancelEdit: () => void;
    onDelete: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({
    isCreate,
    isEditing,
    isSaving,
    canEdit,
    canDelete,
    groupId,
    articleId,
    onSave,
    onEdit,
    onCancelEdit,
    onDelete
}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteConfirm = () => {
        onDelete();
        setIsDeleteModalOpen(false);
    };

    const handleBackToGroup = () => {
        navigate(`/group/${groupId}`);
    };

    const handleBackToView = () => {
        if (articleId) {
            navigate(`/group/${groupId}/article/${articleId}`);
        }
    };

    if (isCreate) {
        return (
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                <Button
                    variant="secondary"
                    onClick={handleBackToGroup}
                    disabled={isSaving}
                >
                    グループに戻る
                </Button>
                <Button
                    onClick={onSave}
                    disabled={isSaving}
                >
                    {isSaving ? '作成中...' : '記事を作成'}
                </Button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={onCancelEdit}
                        disabled={isSaving}
                    >
                        キャンセル
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleBackToView}
                        disabled={isSaving}
                    >
                        表示に戻る
                    </Button>
                </div>
                <Button
                    onClick={onSave}
                    disabled={isSaving}
                >
                    {isSaving ? '保存中...' : '変更を保存'}
                </Button>
            </div>
        );
    }

    // View mode
    return (
        <>
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={handleBackToGroup}
                    >
                        グループに戻る
                    </Button>
                </div>
                <div className="flex space-x-3">
                    {canEdit && (
                        <Button
                            onClick={onEdit}
                        >
                            編集
                        </Button>
                    )}
                    {canDelete && (
                        <Button
                            variant="danger"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            削除
                        </Button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="記事の削除"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        この記事を削除してもよろしいですか？この操作は取り消せません。
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            キャンセル
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                        >
                            削除する
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ArticleActions;