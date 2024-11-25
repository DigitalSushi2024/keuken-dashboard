<template>
  <div>
    <h1>Pending Orders</h1>
    <OrderList :orders="pendingOrders" />
  </div>
</template>

<script>
import OrderList from '../components/OrderList.vue';
import apiService from '../services/apiServices.js';
import { normalizeData } from '../utils/normalizeData.js';

export default {
  components: { OrderList },
  data() {
    return {
      pendingOrders: [],
    };
  },
  async created() {
    try {
      // Haal pending orders op
      const pendingResponse = await apiService.getPendingOrders();
      const orders = normalizeData(pendingResponse.data);

      // Haal productinformatie op voor elk product in de orders
      for (const order of orders) {
        for (const item of order.orderItems) {
          try {
            const productResponse = await apiService.getProductById(item.productId);
            const product = productResponse.data;
            item.productName = product.productName || 'Unknown Product';
            item.productDescription = product.description || '';
          } catch (error) {
            console.error(`Fout bij het ophalen van product ${item.productId}:`, error);
            item.productName = 'Unknown Product';
            item.productDescription = '';
          }
        }
      }

      this.pendingOrders = orders;
    } catch (error) {
      console.error('Fout bij het ophalen van pending orders:', error);
    }
  },
};
</script>
