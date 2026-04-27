import axiosClient from "./axiosClient";

export const staffApi = {
    searchCustomers: async (type, value) => {
        const res = await axiosClient.get(`/api/staff/customers/search`, {
            params: { type, value },
        });
        return res.data;
    },
};