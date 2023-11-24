<template>
  <div :class="['card', { 'is-foil': card.foil }]" @mouseover="hover = true" @mouseleave="hover = false">
    <img :src="card.image" :alt="card.name" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">{{ card.name }} <small>#{{ card.number }}</small></h5>
      <!-- Additional card details -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  card: {
    type: Object,
    required: true,
    default: () => ({
      image: '',
      name: '',
      // Add additional default properties here
    }),
  },
});

const hover = ref(false);
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  /* Indicates the card is clickable */
  margin-bottom: 1rem;
  border: 1px solid transparent;
  /* Reserve space for the border to avoid shifting content */
}

.card:hover {
  transform: translateY(-5px);
  /* Lifts the card slightly */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Adds a shadow to make it pop */
  border-color: #007bff;
  /* Adds a subtle border color */
}

.card-img-top {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card-body {
  /* Style for the card's body where details are shown */
}

/* Additional styles for when the card is hovered */
.card:hover .card-title {
  color: #007bff;
}

.is-foil {
  position: relative;
  overflow: hidden;
}

.is-foil::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.6), transparent, rgba(255, 255, 255, 0.6));
  opacity: 0.5;
  z-index: 1;
  animation: foilShimmer 2s infinite;
}

@keyframes foilShimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}


</style>
