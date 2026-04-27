import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

// Optional: nicer error messages
axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err?.response?.data?.message ||
            (typeof err?.response?.data === "string" ? err.response.data : null) ||
            err.message ||
            "Request failed";
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;