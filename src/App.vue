<template>
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

    <div class="impact-box" v-if="impactCalculated">
      <h2>{{ impactBoxTitle }}</h2>
      <div>
        <h3>{{ bottlesSaved }}</h3>
        <h2>Botellas de Plástico</h2>
      </div>
      <div>
        <h3>{{ plasticSaved.toFixed(2) }}</h3>
        <h2>Kg de Plástico</h2>
      </div>
      <div>
        <h3>{{ carbonSaved.toFixed(2) }}</h3>
        <h2>Kg de Dióxido de Carbono (CO2)</h2>
      </div>
    </div>

    <button @click="shareImpact" v-if="impactCalculated">
      Comparte tus logros
    </button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: "Refill",
      subtitle: "¿Calcula que el impacto ambiental que generas al reutilizar tu botella de agua!",
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
  },
};
</script>
