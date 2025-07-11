import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { GroupPage } from './pages/Group'
import { ArticleManagerPage } from './pages/ArticleManager'
import { GroupCreatePage } from './pages/GroupCreate'
import { SeriesPage } from './pages/Series'
import { SeriesCreatePage } from './pages/SeriesCreate'
import { SeriesDetailPage } from './pages/SeriesDetail'
import { UserManagerPage } from './pages/UserManager'
import { GroupListPage } from './pages/GroupList'
import { AuthProvider } from './contexts/AuthContext'

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<p>about</p>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/group">
                        <Route index element={<GroupListPage />} />
                        <Route path="create" element={<GroupCreatePage />} />
                        <Route path=":groupId">
                            <Route index element={<GroupPage />} />
                            <Route path="article">
                                <Route index element={<ArticleManagerPage />} />
                                <Route path="create" element={<ArticleManagerPage />} />
                                <Route path=":articleId" element={<ArticleManagerPage />} />
                                <Route path=":articleId/edit" element={<ArticleManagerPage />} />
                            </Route>
                            <Route path="series">
                                <Route index element={<SeriesPage />} />
                                <Route path="create" element={<SeriesCreatePage />} />
                                <Route path=":seriesId" element={<SeriesDetailPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="/admin/users" element={<UserManagerPage />} />

                    <Route path="*" element={<p>404</p>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
