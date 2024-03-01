<template>
  <div class="main mainBackground">
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>

    <div id="app">
      <div class="headerWrapper">
        <h2>{{ subtitleII }}</h2>
        <input
          class="input-refills"
          v-model="refills"
          type="number"
          placeholder="Número de recargas"
        />
        <button class="homeBtn calcBtn" @click="calculateImpact">
          Calcular Impacto
        </button>
      </div>

      <!-- environmental impact calculation section -->
      <div class="wrapper">
        <div class="impact-box" v-if="impactCalculated">
          <h2 class="impact-box-title">{{ impactBoxTitle }}</h2>
          <div class="container-wrapper">
            <div class="container">
              <font-awesome-icon
                :icon="['fas', 'bottle-water']"
                :class="['icon-class', 'custom-color', 'custom-size']"
              />
              <h3 class="bottles num">{{ bottlesSaved }}</h3>
              <h2>Botellas de Plástico</h2>
            </div>
            <div class="container">
              <font-awesome-icon
                :icon="['fas', 'recycle']"
                :class="['icon-class', 'custom-color', 'custom-size']"
              />
              <h3 class="plastic num">{{ plasticSaved.toFixed(2) }}</h3>
              <h2>kg de Plástico</h2>
            </div>
            <div class="container">
              <font-awesome-icon
                :icon="['fas', 'weight-hanging']"
                :class="['icon-class', 'custom-color', 'custom-size']"
              />
              <h3 class="carbon num">{{ carbonSaved.toFixed(2) }}</h3>
              <h2>kg de Dióxido de Carbono (CO2)</h2>
            </div>
          </div>
          <button
            class="homeBtn shareBtn"
            @click="shareImpact"
            v-if="impactCalculated"
          >
            Comparte tus logros
          </button>
          <!-- Display the shareable link -->
          <div v-if="shareableLink">
            <input type="text" v-model="shareableLink" readonly />
            <button @click="copyLink">Copiar</button>
          </div>
        </div>
      </div>
      <!-- environmental impact calculation section ENDs-->
    </div>
  </div>
</template>

<script>
import firebaseApp from "./utils/firebase";
import { onMounted } from "vue";
import { generateUniqueId } from "./utils/generateUniqueId";

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
  setup() {
    onMounted(() => {
      console.log("Hola Mundo");
    });
  },
  data() {
    return {
      title: "Refill Calculator",
      subtitle:
        "¡Calcula el impacto ambiental que generas al reutilizar tu botella de agua!",
      subtitleII: "Introduce la cantidad de botellas que has rellenado:",
      impactBoxTitle: "Con esta acción has contribuido ahorrando:",
      refills: false,
      impactCalculated: false,
      bottlesSaved: 0,
      plasticSaved: 0,
      carbonSaved: 0,
      shareableLink: null,
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
      let maxInterval = 50;
      let minInterval = 10;

      // Calculate the duration based on the endValue number
      let duration;
      if (endValue <= 1) {
        duration = Math.floor(minInterval / endValue);
      } else {
        duration = Math.floor(maxInterval / 1);
      }

      // Ensure duration is within min and max Interval.
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
      // Ensure impact is calculated
      if (!this.impactCalculated) {
        return;
      }

      // Generate a unique identifier for the shareable link
      const shareId = generateUniqueId();

      // Construct the shareable link
      const shareableLink = `https://refill-impact-dashboard.web.app/${shareId}`;

      // Check if firebaseApp is properly initialized
      if (!firebaseApp || !firebaseApp.database) {
        console.error("Firebase is not properly initialized.");
        return;
      }

      // Save the calculated impact to Firebase Realtime Database
      firebaseApp
        .database()
        .ref(`shareable-links/${shareId}`)
        .set({
          impact: {
            bottlesSaved: this.bottlesSaved,
            plasticSaved: this.plasticSaved,
            carbonSaved: this.carbonSaved,
          },
        })
        .then(() => {
          // Link saved successfully
          this.shareableLink = shareableLink;
        })
        .catch((error) => {
          console.error("Error generating shareable link:", error);
        });
    },
    copyLink() {
      const shareableLink = this.shareableLink;

      // Check if the Clipboard API is supported
      if (!navigator.clipboard) {
        console.error("Clipboard API is not supported.");
        return;
      }

      // Use the Clipboard API to copy the shareable link
      navigator.clipboard
        .writeText(shareableLink)
        .then(() => {
          console.log("Link copied to clipboard successfully!");
        })
        .catch((error) => {
          console.error("Error copying link to clipboard:", error);
        });
    },
  },
};
</script>
