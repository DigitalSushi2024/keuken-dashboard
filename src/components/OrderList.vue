<template>
  <div class="container">
    <div v-for="order in orders" :key="order.orderId">
      <!-- OrderItem stuurt een event bij voltooien -->
      <OrderItem
          :order="order"
          @order-completed="markOrderAsCompleted"
      />
    </div>
  </div>
</template>

<script>
import OrderItem from './OrderItem.vue';
import apiService from '../services/apiServices.js'; // Zorg dat je apiServices correct importeert

export default {
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
  components: {
    OrderItem,
  },
  methods: {
    async markOrderAsCompleted(orderId) {
      try {
        // Roep de API aan om de status van de order te wijzigen
        await apiService.updateOrderStatus(orderId, 'completed');

        // Update de UI door de voltooide order te verwijderen
        this.orders = this.orders.filter((order) => order.orderId !== orderId);

        console.log(`Order #${orderId} marked as completed.`);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    },
  },
};
</script>
