<template>
  <div :class="['order-item', { completed: isCompleted }]">
    <div>
      <h3>Order #{{ order.orderId }}</h3>
      <span
          class="order-status"
          :class="order.status === 'pending' ? 'order-status-pending' : 'order-status-done'"
      >
        {{ order.status }}
      </span>
    </div>
    <ul>
      <li
          v-for="item in order.orderItems"
          :key="item.productId"
          @click="toggleItemCompletion(item)"
          :style="{ backgroundColor: item.completed ? '#e8f5e9' : '' }"
      >
        <label>
          <input
              type="checkbox"
              v-model="item.completed"
              @change="checkOrderCompletion"
          />
          {{ item.quantity }} x {{ item.productName }}
        </label>
        <p v-if="item.productDescription">{{ item.productDescription }}</p>
      </li>
    </ul>
    <!-- Knop om de order naar "completed" te sturen -->
    <button
        v-if="isCompleted"
        @click="markOrderAsCompleted"
        class="complete-button"
    >
      Mark Order as Completed
    </button>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isCompleted: false,
    };
  },
  methods: {
    toggleItemCompletion(item) {
      item.completed = !item.completed;
    },
    checkOrderCompletion() {
      this.isCompleted = this.order.orderItems.every((item) => item.completed);
    },
    markOrderAsCompleted() {
      this.$emit('order-completed', this.order.orderId);
    },
  },
};
</script>

<style scoped>
.order-status-pending {
  color: orange;
}
.order-status-done {
  color: green;
}
.complete-button {
  margin-top: 16px;
  background-color: green;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.complete-button:hover {
  background-color: darkgreen;
}
</style>
