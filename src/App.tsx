import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { GroupPage } from './pages/Group'
import { ArticlePage } from './pages/Article'
import { ArticleCreatePage } from './pages/AtricleCreate'
import { GroupCreatePage } from './pages/GroupCreate'

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<p>about</p>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/group">
                        <Route index element={<GroupCreatePage />} />
                        <Route path=":groupId">
                            <Route index element={<GroupPage />} />
                            <Route path="article">
                                <Route index element={<ArticleCreatePage />} />
                                <Route path=":articleId" element={<ArticlePage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<p>404</p>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
