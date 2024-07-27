import type { Group, PatchedGroup } from "../../types";

export async function getGroups(): Promise<Group[] | null> {
    const response = await fetch('/api/v1/group', {
        method: "GET",
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

export async function createGroup(group: Group): Promise<Group | null> {
    const response = await fetch('/api/v1/group', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(group)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function updateGroup(group: PatchedGroup, groupId: number): Promise<Group | null> {
    const response = await fetch(`/api/v1/group/${groupId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(group)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function deleteGroup(groupId: number): Promise<void> {
    await fetch(`/api/v1/group/${groupId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
}
