import type { Login, Register, UserHead} from "../../types";

export async function login(loginData: Login): Promise<UserHead | null> {
    const response = await fetch('https://api.cms.yokoyama443.dev/api/auth/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;

}

export async function register(registerData: Register): Promise<UserHead | null> {
    const response = await fetch('https://api.cms.yokoyama443.dev/api/auth/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}

export async function logout(): Promise<void> {
    await fetch('/api/auth/logout', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
}
