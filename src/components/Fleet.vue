<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="row p-2 fleet-name-holder">
          <h2 v-on:click=collapse class="fleet-name">{{shipData.type}}</h2>
          <div class="button-holder">
            <button class="d-inline-block mx-1 hades-button" @click.prevent=newShip>Add Ship</button>
            <button class="d-inline-block mx-1 hades-button" @click.prevent=collapse>{{active}}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row p-2" :class=classes>
      <ship-detail 
        v-on:removeShip=removeShip($event) 
        v-for="(ship, index) in ships" 
        :key=index 
        :modules=modules
        :ship-data=shipData
      ></ship-detail>
      <button class="mt-2 mx-auto hades-button" @click.prevent=newShip>Add Ship</button>
    </div>
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
    shipData: Object,
    modules: Object
  },
  data() {
    return {
      name: 'Red Star',
      classes: {
        collapse: true
      },
      ships: 0
    }
  },
  computed: {
    active() {
      return this.classes.collapse ? "Expand" : "Collapse";
    }
  },
  methods: {
    collapse() {
      this.classes.collapse = !this.classes.collapse;
    },
    newShip() {
      this.ships++;
      if (this.classes.collapse) this.collapse();
    },
    removeShip(index) {
      this.ships--;
      if (!this.ships && !this.classes.collapse) this.collapse();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus {
  outline: none;
}

.fleet-name-holder {
  background-color: rgba(33,47,50,0.5);
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: 70% 30%;
  align-items: center;
  border-bottom: 1px solid #6f9aaa;
}

.fleet-name {
  color: #ffffff;
  font-weight: 300;
}

.button-holder {
  justify-self: end;
}

.collapse {
  max-height: 0;
  padding: none;
}
</style>
