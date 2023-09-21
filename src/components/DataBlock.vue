<template>
    <div class="data-block">
        <h2>{{ message }}</h2>
        <p>Count is: {{ counter.count }}</p>
        <button @click="increment">Count is: {{ counter.count }}</button>
      <ul v-if="pytannia.length">
        <li
          class="data-block__item"
          v-for="item in pytannia"
          :key="item.innerId"
          @click="expandItem(item.GL_Text)"
        >
            <b>{{ item.innerId }}</b>:  {{ item.RESULT }}
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
// import { reactive, ref } from 'vue'
import { reactive, toRefs } from 'vue';

export default {
  name: 'DataBlock',
  
  setup () {
    const state = reactive({
      count: 0,
    });
  
    return {
      ...toRefs(state),
    }
  },
  data() {
    return {
      message: "Питання?!",
      counter: {
        count: 0
      },
      pytannia: []
    }
  },
  mounted() {
    fetch('http://localhost:2222/pytannia')
      .then( res => res.json() )
      .then( data => this.pytannia = data )
      .catch( err => this.message = err.message )
  },
  methods: {
    increment(): number {
      return this.counter.count++;
    },
    expandItem(text: String) {
      console.log('-> ' + text); //tmp
    }
  }
}

</script>

<style scoped lang="scss">
.data-block {
  padding: 2rem 1.5rem;
  color: brown;
  font-size: larger;
  background-color: orange;

  &__item {
    cursor: pointer;
    margin: 1rem 0.5rem;
    border: 1px dotted darkolivegreen;
    transition: all 400ms ease-out;

    &:hover {
      cursor: pointer;
      border-style: solid;
      border-color: limegreen;
      transform: scale(1.1);
    }
  }
}
</style>
