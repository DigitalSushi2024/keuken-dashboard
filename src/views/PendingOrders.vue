<template>
  <div class="pending-orders">
    <h1>Pending Orders</h1>
    <div v-if="pendingOrders.length === 0" class="no-orders">
      <p>No pending orders.</p>
    </div>
    <div class="order-list">
      <OrderItem
          v-for="order in pendingOrders"
          :key="order.orderId"
          :order="order"
          @order-completed="handleOrderCompleted"
      />
    </div>
  </div>
</template>

<script>
import OrderItem from '../components/OrderItem.vue';
import apiService from '../services/apiServices.js';
import { normalizeData } from '../utils/normalizeData.js';
import { startSignalRConnection, onOrderCompleted, onNewOrder } from '../Websockets/signalRService.js';

export default {
  components: { OrderItem },
  data() {
    return {
      pendingOrders: [],
    };
  },
  methods: {
    async loadPendingOrders() {
      try {
        const response = await apiService.getPendingOrders();
        const orders = normalizeData(response.data);

        for (const order of orders) {
          for (const item of order.orderItems) {
            await this.enrichOrderItem(item);
          }
        }

        this.pendingOrders = orders;
      } catch (error) {
        console.error('Error loading pending orders:', error);
      }
    },
    async enrichOrderItem(item) {
      try {
        const productResponse = await apiService.getProductById(item.productId);
        const product = productResponse.data;
        item.productName = product.productName || 'Unknown Product';
        item.productDescription = product.description || '';
        item.completed = false;
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
        item.productName = 'Unknown Product';
        item.productDescription = '';
      }
    },
    handleOrderCompleted(orderId) {
      this.pendingOrders = this.pendingOrders.filter(
          (order) => order.orderId !== orderId
      );
      apiService.updateOrderStatus(orderId, 'completed');
    },
    setupSignalR() {
      startSignalRConnection();

      onOrderCompleted((orderId) => {
        this.pendingOrders = this.pendingOrders.filter(
            (order) => order.orderId !== orderId
        );
      });

      onNewOrder((newOrder) => {
        this.pendingOrders.push(newOrder);
      });
    },
  },
  async created() {
    await this.loadPendingOrders();
    this.setupSignalR();
  },
};
</script>

<style scoped>
.pending-orders {
  background-color: #f4f4f9;
  color: #333;
  padding: 16px;
  border-radius: 8px;
  max-width: 800px;
  margin: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h1 {
  font-size: 28px;
  color: #ff6f00;
  text-align: center;
  margin-bottom: 16px;
}
.no-orders p {
  color: #888;
  font-size: 18px;
  text-align: center;
}
.order-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
