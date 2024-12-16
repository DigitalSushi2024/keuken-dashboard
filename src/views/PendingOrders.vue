<template>
  <div class="pending-orders">
    <h1>Pending Kitchen Orders</h1>
    <div v-if="pendingOrders.length === 0" class="no-orders">
      <p>No pending orders.</p>
    </div>
    <div class="order-list">
      <div
          v-for="order in pendingOrders"
          :key="order.orderId"
          class="order-item"
      >
        <h2>Order #{{ order.orderId }}</h2>
        <ul>
          <li
              v-for="item in order.orderItems"
              :key="item.itemId"
              :class="{ completed: item.completed }"
              @click="toggleItemCompletion(item)"
          >
            {{ item.productName }}
          </li>
        </ul>
        <button
            v-if="isOrderReady(order)"
            @click="markOrderComplete(order.orderId)"
            class="complete-button"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "../services/apiServices";

export default {
  data() {
    return {
      pendingOrders: [],
      locationId: 1, // Keuken
    };
  },
  methods: {
    async loadPendingOrders() {
      try {
        const response = await apiService.getPendingOrdersWithLocation(this.locationId);
        console.log("API Response:", response.data);

        // Controleer en map de API response correct
        const orders = Array.isArray(response.data.$values) ? response.data.$values : response.data;

        this.pendingOrders = orders.reduce((acc, curr) => {
          let order = acc.find(o => o.orderId === curr.orderId);
          if (!order) {
            order = {
              orderId: curr.orderId,
              orderTime: curr.orderTime,
              orderItems: [],
            };
            acc.push(order);
          }
          order.orderItems.push({
            itemId: curr.$id || curr.itemId || `${curr.orderId}-${curr.productName}`, // Unieke key
            productName: curr.productName,
            completed: false, // Default false
          });
          return acc;
        }, []);
      } catch (error) {
        console.error("Error loading pending orders:", error);
      }
    },
    toggleItemCompletion(item) {
      item.completed = !item.completed;
    },
    isOrderReady(order) {
      return order.orderItems.every((item) => item.completed);
    },
    async markOrderComplete(orderId) {
      try {
        await apiService.updateOrderStatus(orderId, this.locationId);
        this.pendingOrders = this.pendingOrders.filter(order => order.orderId !== orderId);
        alert(`Order ${orderId} marked as complete!`);
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
  },
  created() {
    this.loadPendingOrders();
  },
};
</script>

<style scoped>
.pending-orders {
  padding: 16px;
}
.order-item {
  border: 1px solid #ddd;
  margin: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
}
.completed {
  color: green;
  text-decoration: line-through;
  cursor: pointer;
}
.complete-button {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
