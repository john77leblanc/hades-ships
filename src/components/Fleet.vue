<template>
  <div>
    <h2 v-on:click=collapse>Fleet: {{name}}</h2>
    <div class="row" :class=classes>
      <ship-detail 
        v-on:removeShip=removeShip($event) 
        v-for="(ship, index) in ships" 
        :key=index 
        :modules=modules 
        :ship-data=shipData
      ></ship-detail>
    </div>
    <button class="btn btn-primary" v-on:click.prevent=newShip>Add Ship</button>
  </div>
</template>

<script>
import ShipDetail from './ShipDetail.vue';

export default {
  name: 'Fleet',
  components: {
      ShipDetail
  },
  props: {
    shipData: Array,
    modules: Object
  },
  data() {
    return {
      name: 'Red Star',
      classes: {
        collapse: false
      },
      ships: 0
    }
  },  
  methods: {
    collapse() {
      this.classes.collapse = !this.classes.collapse;
    },
    newShip() {
      this.ships++
    },
    removeShip(index) {
      this.ships--;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collapse {
  max-height: 0;
}
</style>
