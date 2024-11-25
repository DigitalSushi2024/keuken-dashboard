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
        {{ item.quantity }} x {{ item.productName }}
        <p v-if="item.productDescription">{{ item.productDescription }}</p>
      </li>
    </ul>
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
  },
};
</script>
