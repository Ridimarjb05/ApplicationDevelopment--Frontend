import axiosClient from "./axiosClient";

export const invoiceApi = {
    sendInvoiceEmail: async (payload) => {
        const res = await axiosClient.post(`/api/invoices/send-email`, payload);
        return res.data;
    },
};