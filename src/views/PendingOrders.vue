<template>
  <div class="pending-orders">
    <h1>Pending Kitchen Orders</h1>
    <!-- Toon bericht als er geen pending orders zijn -->
    <div v-if="pendingOrders.length === 0" class="no-orders">
      <p>No pending orders.</p>
    </div>

    <!-- Lijst met orders -->
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
              @click="toggleItemStatus(order, item)"
          >
            {{ item.productName }}
            <span v-if="item.completed">(Complete)</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from "../services/apiServices";

export default {
  data() {
    return {
      pendingOrders: [], // Opslag voor pending orders
      locationId: 1, // Location ID voor keuken
    };
  },
  methods: {
    // Haal pending orders op bij component-lading
    async loadPendingOrders() {
      try {
        const response = await apiService.getPendingOrdersWithLocation();
        const orders = response.data?.$values || [];

        // Groepeer de orders op basis van orderId
        this.pendingOrders = this.groupOrdersByOrderId(orders);
      } catch (error) {
        console.error("Error loading pending orders:", error);
      }
    },

    // Groepeer orders op orderId
    groupOrdersByOrderId(orders) {
      const grouped = [];
      orders.forEach((order) => {
        let existingOrder = grouped.find((o) => o.orderId === order.orderId);
        if (!existingOrder) {
          existingOrder = {
            orderId: order.orderId,
            locationId: order.locationId,
            orderItems: [],
          };
          grouped.push(existingOrder);
        }
        existingOrder.orderItems.push({
          itemId: order.itemId,
          productName: order.productName,
          completed: false, // Startstatus
        });
      });
      return grouped;
    },

    // Wissel de status van een individueel item
    toggleItemStatus(order, item) {
      item.completed = !item.completed;

      // Controleer of alle items in deze order zijn voltooid
      if (this.areAllItemsComplete(order.orderItems)) {
        this.updateOrderStatus(order.orderId, order.locationId);
      }
    },

    // Controleer of alle items in een order zijn voltooid
    areAllItemsComplete(items) {
      return items.every((item) => item.completed);
    },

    // Roep de API aan om de orderstatus te updaten
    async updateOrderStatus(orderId, locationId) {
      try {
        await apiService.updateOrderStatus(orderId, locationId);
        alert(`Order #${orderId} has been marked as complete!`);

        // Verwijder de order uit de lijst
        this.pendingOrders = this.pendingOrders.filter(
            (order) => order.orderId !== orderId
        );
      } catch (error) {
        console.error("Error updating order status:", error);
        alert("Failed to update order status. Please try again.");
      }
    },
  },
  created() {
    this.loadPendingOrders(); // Laad de orders bij het laden van de component
  },
};
</script>

<style scoped>
.pending-orders {
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
  cursor: pointer;
}

li.completed {
  color: green;
  text-decoration: line-through;
  cursor: default;
}
</style>
