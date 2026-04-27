import axiosClient from "./axiosClient";

export const customerApi = {
    getCustomer: async (profileId) => {
        const res = await axiosClient.get(`/api/customers/${profileId}`);
        return res.data;
    },

    updateProfile: async (profileId, payload) => {
        const res = await axiosClient.put(`/api/customers/${profileId}`, payload);
        return res.data;
    },

    addVehicle: async (profileId, payload) => {
        const res = await axiosClient.post(`/api/customers/${profileId}/vehicles`, payload);
        return res.data;
    },

    updateVehicle: async (profileId, vehicleId, payload) => {
        const res = await axiosClient.put(`/api/customers/${profileId}/vehicles/${vehicleId}`, payload);
        return res.data;
    },

    deleteVehicle: async (profileId, vehicleId) => {
        const res = await axiosClient.delete(`/api/customers/${profileId}/vehicles/${vehicleId}`);
        return res.data;
    },
};