<template>
  <div class="main">
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
    <h2>{{ subtitleII }}</h2>

    <div id="app">
      <input
        v-model="refills"
        type="number"
        placeholder="Ingrese el número de recargas"
      />
      <button @click="calculateImpact">Calcular Impacto</button>

      <div class="wrapper">
        <div class="impact-box" v-if="impactCalculated">
          <h2>{{ impactBoxTitle }}</h2>
          <div class="container-wrapper">
            <div class="container">
              <font-awesome-icon
                :icon="['fas', 'bottle-water']"
                :class="['icon-class', 'custom-color', 'custom-size']"
              />
              <!-- <img class="container-img" src="./../public/bottle-water.svg" alt="bottle-water"> -->
              <h3 class="bottles num">{{ bottlesSaved }}</h3>
              <h2>Botellas de Plástico</h2>
            </div>
            <div class="container">
              <!-- <img src="./../public/recycle.svg" alt="recycle"> -->
              <font-awesome-icon
                :icon="['fas', 'recycle']"
                :class="['icon-class', 'custom-color', 'custom-size']"
              />
              <h3 class="plastic num">{{ plasticSaved.toFixed(2) }}</h3>
              <h2>Kg de Plástico</h2>
            </div>
            <div class="container">
              <!-- <img src="./../public/weight-hanging.svg" alt="weight-hanging"> -->
              <font-awesome-icon
                :icon="['fas', 'weight-hanging']"
                :class="['icon-class', 'custom-color', 'custom-size']"
              />
              <h3 class="carbon num">{{ carbonSaved.toFixed(2) }}</h3>
              <h2>Kg de Dióxido de Carbono (CO2)</h2>
            </div>
          </div>
          <button @click="shareImpact" v-if="impactCalculated">
            Comparte tus logros
          </button>
          <!-- TODO +++++++++++++++++++++++++++++++++++++++++ -->
          <!-- <font-awesome-icon
            :icon="['fas', 'share']"
            :class="['icon-class', 'custom-color', 'custom-size']"
          />
          <font-awesome-icon :icon="['fab', 'square-facebook']" />
          <font-awesome-icon :icon="['fab', 'x-twitter']" /> -->
          <!-- TODO +++++++++++++++++++++++++++++++++++++++++ -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from 'firebase/app'
// import 'firebase/firestore'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBottleWater,
  faRecycle,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";

library.add(faBottleWater, faRecycle, faWeightHanging);

export default {
  name: "App",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      title: "Refill Calculator",
      subtitle:
        "¡Calcula que el impacto ambiental que generas al reutilizar tu botella de agua!",
      subtitleII: "Introduce la cantidad de botellas que has rellenado:",
      impactBoxTitle: "Con esta acción has contribuido ahorrando:",
      refills: false,
      impactCalculated: false,
      bottlesSaved: 0,
      plasticSaved: 0,
      carbonSaved: 0,
    };
  },
  methods: {
    calculateImpact() {
      const bottlesPerRefill = 2; // 33 ml bottles saved (2 bottles per refill)
      const plasticPerBottle = 0.012; // 0.012 kg per bottle
      const carbonPerBottle = 0.08; // 0.08 kg CO2 per bottle

      this.bottlesSaved = this.refills * bottlesPerRefill;
      this.plasticSaved = this.bottlesSaved * plasticPerBottle;
      this.carbonSaved = this.bottlesSaved * carbonPerBottle;

      this.impactCalculated = true;
      this.animateCount();
    },
    animateCount() {
      this.animateContainerCount(".num.bottles", this.bottlesSaved);
      this.animateContainerCount(".num.plastic", this.plasticSaved);
      this.animateContainerCount(".num.carbon", this.carbonSaved);
    },
    animateContainerCount(selector, endValue) {
      let startValue = 0;
      let maxInterval = 50; // Maximum interval
      let minInterval = 10; // Minimum interval
      // Calculate the duration based on the endValue number
      let duration;
      if (endValue <= 1) {
        duration = Math.floor(minInterval / endValue);
      } else {
        duration = Math.floor(maxInterval / 1);
      }

      // Ensure duration is within reasonable bounds
      duration = Math.max(minInterval, Math.min(maxInterval, duration));

      let counter = setInterval(() => {
        if (Number.isInteger(endValue)) {
          startValue += 1; // Increment by 1 for integer values
        } else {
          startValue += 0.01; // Increment by a small value for float values
        }
        this.$el.querySelector(selector).textContent = startValue.toFixed(2); // Update the text content
        if (startValue >= endValue) {
          clearInterval(counter);
        }
      }, duration);
    },
    shareImpact() {
      // Implement Firebase to generate and manage unique shareable links
    },
  },
};
</script>
