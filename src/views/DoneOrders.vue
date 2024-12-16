<template>
  <div class="completed-orders">
    <h1>Completed Kitchen Orders</h1>
    <!-- Toon bericht als er geen completed orders zijn -->
    <div v-if="completedOrders.length === 0" class="no-orders">
      <p>No completed orders available.</p>
    </div>

    <!-- Lijst met completed orders -->
    <div class="order-list">
      <div
          v-for="order in completedOrders"
          :key="order.orderId"
          class="order-item"
      >
        <h2>Order #{{ order.orderId }}</h2>
        <ul>
          <li
              v-for="item in order.orderItems"
              :key="item.itemId"
          >
            {{ item.productName }}
          </li>
        </ul>
        <!-- Knop om order terug te zetten naar 'pending' -->
        <button @click="setOrderToPending(order.orderId)" class="pending-btn">
          Set to Pending
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
      completedOrders: [], // Opslag voor completed orders
    };
  },
  methods: {
    // Haal de lijst van voltooide keukenorders op
    async loadCompletedOrders() {
      try {
        const response = await apiService.getCompletedKitchenOrders();

        // Controleer en transformeer de data naar het juiste formaat
        const orders = response.data?.$values?.map(order => ({
          orderId: order.orderId,
          orderTime: order.orderTime,
          orderItems: order.orderItems.$values.map(item => ({
            itemId: item.itemId,
            productName: item.productName,
          })),
        })) || [];

        this.completedOrders = orders;
      } catch (error) {
        console.error("Error loading completed kitchen orders:", error);
      }
    },
    // Zet een order terug naar 'Pending'
    async setOrderToPending(orderId) {
      try {
        await apiService.setKitchenOrderToPending(orderId);
        alert(`Order ${orderId} is teruggezet naar 'Pending'.`);
        this.loadCompletedOrders(); // Herlaad de lijst van completed orders
      } catch (error) {
        console.error(`Fout bij het terugzetten van order ${orderId}:`, error);
        alert(`Er is een fout opgetreden bij het terugzetten van de order.`);
      }
    },
  },
  created() {
    this.loadCompletedOrders();
  },
};
</script>

<style scoped>
.completed-orders {
  padding: 16px;
}

.no-orders {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}

.order-item {
  border: 1px solid #ddd;
  margin: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f1f1f1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 8px;
  font-size: 1.4em;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 4px 0;
  font-size: 1.1em;
  color: #555;
}

.pending-btn {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.pending-btn:hover {
  background-color: #e68900;
}
</style>
