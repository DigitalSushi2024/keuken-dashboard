import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7110/api/Order",
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    getPendingOrdersWithLocation() {
        return apiClient.get(`/kitchen/pending`);
    },
    getCompletedKitchenOrders() {
        return apiClient.get(`/kitchen/completed`);
    },
    updateOrderStatus(orderId, locationId) {
        return apiClient.put(`/order/${orderId}/location/${locationId}/update-status`);
    },
    setKitchenOrderToPending(orderId) {
        // API-aanroep om keukenorder terug te zetten naar pending
        return apiClient.put(`/order/${orderId}/location/1/set-pending`);
    },

};
