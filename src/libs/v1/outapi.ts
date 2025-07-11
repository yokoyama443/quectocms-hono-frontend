import type { OutAPI, PostOutAPI } from "../../types";

export async function getOutAPIs(groupId : number): Promise<OutAPI[] | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/outapi`, {
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
    console.dir(data.outAPIs.outAPIs);
    return data.outAPIs;
}

export async function createOutAPI(groupId : number, outapi : PostOutAPI): Promise<OutAPI | null> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/outapi`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(outapi)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function deleteOutAPI(groupId : number, outapiId : number): Promise<boolean> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${groupId}/outapi/${outapiId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.ok;
}
