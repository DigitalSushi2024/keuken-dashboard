<template>
  <div>
    <h1>Done Orders</h1>
    <OrderList :orders="doneOrders" />
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
      doneOrders: [],
    };
  },
  async created() {
    try {
      // Haal completed orders op
      const completedResponse = await apiService.getCompletedOrders();
      const orders = normalizeData(completedResponse.data);

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

      this.doneOrders = orders;
    } catch (error) {
      console.error('Fout bij het ophalen van completed orders:', error);
    }
  },
};
</script>
