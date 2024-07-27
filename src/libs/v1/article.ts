import type { Article, ArticleHeads, PatchedArticle } from "../../types";

export async function getArticles(groupId : number): Promise<ArticleHeads | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/article`, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function getArticle(groupId : number,articleId: number): Promise<Article | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/article/${articleId}`, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function createArticle(groupId : number, article: Article): Promise<Article | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/article`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(article)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function updateArticle(groupId : number, articleId : number,article: PatchedArticle): Promise<Article | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/article/${articleId}`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(article)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data.url;
}

export async function deleteArticle(groupId : number, articleId : number): Promise<void> {
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/article/${articleId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });
}
