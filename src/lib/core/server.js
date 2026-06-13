const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_BASE_URL || '';
    }
    return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

export const serverFetch = async (path) => {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${path}`);

    if (!res.ok) {
        return { error: `Fetch failed with status ${res.status}` };
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return { error: "Response is not JSON" };
}


export const serverMutation = async (path, data, method = 'POST') => {
    const baseUrl = getBaseUrl();
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            method: 'method',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const text = await res.text();
            return { error: text || `Mutation failed with status ${res.status}` };
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return res.json();
        }
        return { success: true };
    } catch (error) {
        console.error("serverMutation error:", error);
        return { error: error.message };
    }
}