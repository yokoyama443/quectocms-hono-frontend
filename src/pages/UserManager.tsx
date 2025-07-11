import { useState, useEffect } from 'react';
import { Container, Header, Button, Card, Input, Modal, Loading } from '../components';
import { userAPI } from '../libs/v1/user';
import { User } from '../types';

export const UserManagerPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [hostPassword, setHostPassword] = useState('');
  const [newHostPassword, setNewHostPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [editForm, setEditForm] = useState({
    username: '',
    detail: '',
    icon: '',
    role: 'editor' as 'admin' | 'editor',
  });

  useEffect(() => {
    fetchUsers();
    fetchConfig();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await userAPI.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('ユーザー一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const config = await userAPI.getConfig();
      setHostPassword(config.hostPassword);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      detail: user.detail,
      icon: user.icon,
      role: user.role as 'admin' | 'editor',
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      await userAPI.updateUser(editingUser.id, editForm);
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
      alert('ユーザー情報を更新しました');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('ユーザー情報の更新に失敗しました');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`ユーザー「${user.username}」を削除しますか？`)) return;

    try {
      await userAPI.deleteUser(user.id);
      fetchUsers();
      alert('ユーザーを削除しました');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('ユーザーの削除に失敗しました');
    }
  };

  const handleUpdateHostPassword = async () => {
    if (!newHostPassword.trim()) {
      alert('新しいパスワードを入力してください');
      return;
    }

    try {
      await userAPI.updateHostPassword({ hostPassword: newHostPassword });
      setShowPasswordModal(false);
      setNewHostPassword('');
      fetchConfig();
      alert('ホストパスワードを更新しました');
    } catch (error) {
      console.error('Failed to update host password:', error);
      alert('ホストパスワードの更新に失敗しました');
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'text-red-600' : 'text-blue-600';
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ユーザー管理</h1>
          <Button
            onClick={() => setShowPasswordModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            ホストパスワード変更
          </Button>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {user.icon && (
                    <img
                      src={user.icon}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.detail}</p>
                    <p className={`text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEditUser(user)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    編集
                  </Button>
                  {user.id !== 0 && (
                    <Button
                      onClick={() => handleDeleteUser(user)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      削除
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ユーザー編集モーダル */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="ユーザー編集"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ユーザー名</label>
              <Input
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                placeholder="ユーザー名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">詳細</label>
              <Input
                value={editForm.detail}
                onChange={(e) => setEditForm({...editForm, detail: e.target.value})}
                placeholder="詳細"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">アイコンURL</label>
              <Input
                value={editForm.icon}
                onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                placeholder="アイコンURL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ロール</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'editor'})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleUpdateUser}
                className="bg-green-600 hover:bg-green-700"
              >
                更新
              </Button>
              <Button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </Modal>

        {/* ホストパスワード変更モーダル */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="ホストパスワード変更"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">現在のパスワード</label>
              <Input
                value={hostPassword}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">新しいパスワード</label>
              <Input
                value={newHostPassword}
                onChange={(e) => setNewHostPassword(e.target.value)}
                placeholder="新しいパスワード"
                type="password"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleUpdateHostPassword}
                className="bg-green-600 hover:bg-green-700"
              >
                更新
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewHostPassword('');
                }}
                className="bg-gray-600 hover:bg-gray-700"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Container>
  );
};