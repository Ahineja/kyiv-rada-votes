export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:2222",
} as const;

export const getApiUrl = (endpoint: string): string => {
    return `${config.apiBaseUrl}/${endpoint}`.replace(/\/+/g, "/");
}; 