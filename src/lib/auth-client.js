import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
    if (typeof window !== "undefined") {
        const envUrl =
            process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
            process.env.NEXT_PUBLIC_AUTH_URL ||
            process.env.BETTER_AUTH_URL;

        return envUrl ? envUrl : `${window.location.origin}/api/auth`;
    }

    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL || process.env.BETTER_AUTH_URL;
};

let authClientInstance = null;
const getAuthClient = () => {
    if (authClientInstance) return authClientInstance;
    const baseURL = getBaseURL();
    if (!baseURL) {
        throw new Error("Unable to determine auth client base URL.");
    }

    authClientInstance = createAuthClient({ baseURL });
    return authClientInstance;
};

const authClientProxy = new Proxy({}, {
    get(_, prop) {
        const client = getAuthClient();
        return client[prop];
    }
});

export const authClient = authClientProxy;
export const signOut = (...args) => authClient.signOut(...args);
export const useSession = () => {
    if (typeof window === "undefined") {
        return { data: null, isPending: false };
    }

    return authClient.useSession();
};