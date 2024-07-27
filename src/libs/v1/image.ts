export async function uploadImage(image: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('image', image);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/image`, {
        method: "POST",
        credentials: 'include',
        body: formData
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    console.log(data.url);
    return data.url;
}