import type { Series, SeriesHeads, PatchedSeries, PatchedSeriesArticle } from "../../types";

export async function getSeries(groupId: number, page: number = 1, perPage: number = 10, tags?: string): Promise<SeriesHeads | null> {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });
    
    if (tags) {
        params.append('tags', tags);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series?${params}`, {
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

export async function getSeriesById(groupId: number, seriesId: number): Promise<Series | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series/${seriesId}`, {
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

export async function getSeriesByName(groupId: number, seriesName: string): Promise<Series | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series/n/${seriesName}`, {
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

export async function createSeries(groupId: number, series: PatchedSeries): Promise<Series | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(series)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function updateSeries(groupId: number, seriesId: number, series: PatchedSeries): Promise<Series | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series/${seriesId}`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(series)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function updateSeriesArticles(groupId: number, seriesId: number, articles: PatchedSeriesArticle[]): Promise<Series | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series/${seriesId}/article`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ articles })
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function deleteSeries(groupId: number, seriesId: number): Promise<boolean> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/series/${seriesId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.ok;
}