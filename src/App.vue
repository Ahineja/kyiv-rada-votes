<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import DataBlock from './components/DataBlock.vue'
</script>

<template>
  <header>
    <img
      alt="Pet-project logo" class="logo" src="@/assets/crow-downhead-to-right.svg" width="225" height="225" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <DataBlock />
  <RouterView />
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
  //max-height: 100vh;
}

.logo {
  position: relative;
  display: block;
  margin: -2rem 0 -5rem -3rem;
  bottom: 0;
  left: 0;
  transition: all 0.5s 0.1s ease-out;
  z-index: 0;

  &:hover {
    transform: scale(1.2);
    bottom: -100px;
    left: 50px;
    z-index: 1;
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
