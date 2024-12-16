import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7110/api/Order",
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    getPendingOrdersWithLocation(locationId) {
        return apiClient.get(`/pending/${locationId}`);
    },
    updateOrderStatus(orderId, locationId) {
        return apiClient.put(`/order/${orderId}/location/${locationId}/update-status`);
    },

};
