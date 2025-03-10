<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1>{{ msg }}</h1>

  </div>
</template>

<style lang="scss" scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
  background-color: palevioletred;
  box-shadow: 2px 3px 12px blueviolet;
}
.greetings h1 {
  color: brown;
  font-weight: bold;
  text-align: center;
  text-shadow: -15px -15px 0 yellow;
}
.greetings h3 {
  text-align: right;
  font-size: 1rem;
  font-weight: bold;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
