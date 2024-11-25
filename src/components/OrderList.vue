<template>
  <div class="container">
    <div v-for="order in orders" :key="order.orderId">
      <OrderItem :order="order" />
    </div>
  </div>
</template>
<script>
import OrderItem from './OrderItem.vue';

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
};
</script>
