<template>
    <div class="data-block">
        <h2>{{ message }}</h2>
        <p>Count is: {{ counterInDataBlock.count }}</p>
        <h6>counterInSetup is: {{ counterInSetup }}</h6>
        <button @click="incrementButtonAction">Count is: {{ counterInDataBlock.count }}</button>
        <button @click="incrementButtonInSetupAction">Count is: {{ counterInSetup }}</button>
      <transition-group
        name="dancing-quin"
        tag="ul"
        v-if="pytannia.length"
      >
        <li
          class="data-block__item"
          v-for="item in pytannia"
          :key="item.innerId"
          @click="expandItem(item.GL_Text)"
        >
            <b>{{ item.innerId }}</b>:  {{ item.RESULT }}
        </li>
      </transition-group>
    </div>
</template>

<script lang="ts">
import { reactive, ref, toRefs } from 'vue';

interface Pytannia {
  GL_Text: string,
  RESULT: string,
  innerID: string
}

export default {
  name: 'DataBlock',
  
  setup () {
    const counterInSetup = ref<number>(33);
    const pytanniaList = ref<Pytannia[]>([]);

    const incrementButtonInSetupAction = () => {
      counterInSetup.value++;
    }

    return { counterInSetup, pytanniaList, incrementButtonInSetupAction };
  },
  data() {
    return {
      message: "Питання?!",
      counterInDataBlock: {
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
    incrementButtonAction() {
      this.counterInDataBlock.count++;
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
