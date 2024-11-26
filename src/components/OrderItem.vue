<template>
  <div class="order-item">
    <h2>Order #{{ order.orderId }}</h2>
    <ul>
      <li v-for="item in order.orderItems" :key="item.productId">
        <input
            type="checkbox"
            v-model="item.completed"
            @change="checkOrderCompletion"
        />
        <span :class="{ completed: item.completed }">
          {{ item.quantity }} x {{ item.productName }}
        </span>
      </li>
    </ul>
    <button
        v-if="isOrderCompleted"
        @click="markAsCompleted"
        class="complete-button"
    >
      Complete Order
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
      isOrderCompleted: false,
    };
  },
  methods: {
    checkOrderCompletion() {
      this.isOrderCompleted = this.order.orderItems.every((item) => item.completed);
    },
    markAsCompleted() {
      this.$emit('order-completed', this.order.orderId);
    },
  },
};
</script>

<style scoped>
.order-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 8px 0;
  display: flex;
  align-items: center;
}
li .completed {
  text-decoration: line-through;
  color: #999;
}
.complete-button {
  background-color: #28a745;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  width: 100%;
  text-align: center;
}
.complete-button:hover {
  background-color: #218838;
}
</style>
