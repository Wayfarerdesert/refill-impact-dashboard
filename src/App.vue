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
                :class="['fa-icon-style']"
              />
              <h3 class="bottles num">{{ bottlesSaved }}</h3>
              <h2>Botellas de Plástico</h2>
            </div>
            <div class="container">
              <font-awesome-icon
                :icon="['fas', 'recycle']"
                :class="['fa-icon-style']"
              />
              <h3 class="plastic num">{{ plasticSaved.toFixed(2) }}</h3>
              <h2>kg de Plástico</h2>
            </div>
            <div class="container">
              <font-awesome-icon
                :icon="['fas', 'weight-hanging']"
                :class="['fa-icon-style']"
              />
              <h3 class="carbon num">{{ carbonSaved.toFixed(2) }}</h3>
              <h2>kg de Dióxido de Carbono (CO2)</h2>
            </div>
          </div>
          <!-- Share and copy links btn -->
          <button
            class="homeBtn shareBtn"
            @click="shareImpact"
            v-if="impactCalculated"
          >
            Comparte tus logros
          </button>
          <!-- Display the shareable link -->
          <div class="shareableLink" v-if="shareableLink">
            <!--v-if="shareableLink" -->
            <input
              class="input-link"
              type="text"
              v-model="shareableLink"
              readonly
            />
            <button class="copyBtn" @click="copyLink">
              Copiar&nbsp;
              <font-awesome-icon :icon="['far', 'copy']" :class="['fa-copy']" />
            </button>
          </div>
        </div>
      </div>
      <!-- environmental impact calculation section ENDs-->
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, set } from "firebase/database";
import firebaseApp from "./utils/firebase";

import { generateUniqueId } from "./utils/generateUniqueId";
import confetti from "canvas-confetti";

import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBottleWater,
  faRecycle,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";

library.add(faBottleWater, faRecycle, faWeightHanging, far);

export default {
  name: "App",
  components: {
    FontAwesomeIcon,
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
      const duration = 3000; // Set duration to 3 sec

      // Calculate the increment based on the endValue and duration
      const increment = endValue / duration;

      let currentValue = startValue;
      let startTime;

      // Function to update the current value based on elapsed time and increment
      const updateValue = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        // Calculate current value based on elapsed time
        currentValue = increment * elapsedTime;

        if (currentValue >= endValue) {
          clearInterval(interval);
          currentValue = endValue;
          // Trigger confetti effect when counting reaches the end value
          confetti({
            particleCount: 100,
            angle: 90,
            spread: 130,
          });
        }
        const formattedValue = selector.includes("bottles")
          ? currentValue.toFixed(0)
          : currentValue.toFixed(2);
        // Update the text content
        this.$el.querySelector(selector).textContent = formattedValue;
      };

      const interval = setInterval(() => {
        if (!startTime) {
          // set start time to current time
          startTime = Date.now();
        }
        updateValue();
      });
    },
    shareImpact() {
      // Generate a unique identifier for the shareable link
      const uniqueId = generateUniqueId();

      // Store the calculated impact and the unique identifier in the database
      const db = getDatabase();
      const impactsRef = ref(db, `impacts/${uniqueId}`);
      set(impactsRef, {
        bottlesSaved: this.bottlesSaved,
        plasticSaved: this.plasticSaved,
        carbonSaved: this.carbonSaved,
      })
        .then(() => {
          console.log("data stored successfully:");
        })
        .catch((error) => {
          console.error("Error storing data:", error);
        });

      // Generate the shareable link
      this.shareableLink = `https://refill-impact-dashboard.web.app/share/${uniqueId}`;
    },
    copyLink(button) {
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
          button.textContent = "Copiado";
        })
        .catch((error) => {
          console.error("Error copying link to clipboard:", error);
        });
    },
  },
};
</script>
