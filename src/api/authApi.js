import axiosClient from "./axiosClient";

export const authApi = {
    registerCustomer: async (payload) => {
        const res = await axiosClient.post("/api/auth/register-customer", payload);
        return res.data;
    },
};