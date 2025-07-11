import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showAuth?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'QuectoCMS',
  showAuth = true,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
              {title}
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              ホーム
            </Link>

            {showAuth && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/group"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      グループ
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/users"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        ユーザー管理
                      </Link>
                    )}
                    <div className="flex items-center space-x-2">
                      {user.icon && (
                        <img
                          src={user.icon}
                          alt={user.username}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-gray-700 font-medium">{user.username}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLogout}
                      >
                        ログアウト
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login">
                      <Button variant="secondary" size="sm">
                        ログイン
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm">
                        新規登録
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;