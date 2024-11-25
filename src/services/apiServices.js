import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://localhost:7110/api', // Base URL van de backend
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default {
    getPendingOrders() {
        return apiClient.get('/order/pending'); // Endpoint voor pending orders
    },
    getCompletedOrders() {
        return apiClient.get('/order/completed'); // Endpoint voor completed orders
    },
    getProductById(productId) {
        return apiClient.get(`/product/${productId}`);
    },
    updateOrderStatus(orderId, status) {
        // PUT-aanroep om de status van een order bij te werken
        return apiClient.put(`/order/${orderId}/status`, { status });
    },
};
