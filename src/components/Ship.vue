<template>
  <div class="col-12 card bg-dark text-light">
    <input v-model=name class="bg-dark text-white border-left-0 border-top-0 border-right-0 border-bottom-1 ship-name" />
    <div class="row mt-3">
        <div class="col-sm-3">
            <img :src=image height="200" class="d-block mx-auto">
        </div>
        <div :class=classes class="col-sm-9 grid-container">
            <h4>Ship</h4>
            <div>
                <span><b>Ship Type</b></span>
                <span><b>Level</b></span>
                <span class="cost"><b>Cost</b></span>
                <span class="hydro"><b>Hydro</b></span>
            </div>
            <div class="mb-3">
                <select class="ship-type" v-model=ship.type v-on:change=changeShipType>
                    <option 
                        v-for="(ship, index) in shipTypes" 
                        :key=index 
                        :value=ship
                    >{{ship}}</option>
                </select>
                <select v-if=ship.type class="ship-type" v-model=ship.level v-on:change=updateShip>
                    <option 
                        v-for="(level, index) in shipLevels" 
                        :key=index 
                        :value=level
                    >{{level}}</option>
                </select>
                <span class="cost">{{ship.cost}}</span>
                <span class="hydro">{{ship.hydro}}/100AU</span>
            </div>
            <h4 v-if="ship.type && ship.level">Modules</h4>
            <div v-if="ship.type && ship.level">
                <span><b>Type</b></span>
                <span><b>Name</b></span>
                <span class="cost"><b>Cost</b></span>
                <span class="hydro"><b>Hydro</b></span>
            </div>
            <Module
                v-for="(mod, index) in modAmount" 
                :key=mod+index 
                :type=mod
                :modules=modules[mod]
                @updateMod=updateMod($event)
                @remove=removeMod($event)
            ></Module>
            <div>
                <span class="cost"><b>{{totalModCost}}</b></span>
                <span class="hydro"><b>{{totalModHydro}}/AU</b></span>
            </div>
            <h4>Production Cost</h4>
            <div>
                <span>Total:</span>
                <span class="cost total-cost">{{totalProductionCost}}</span>
                <span class="hydro total-hydro">{{totalProductionHydro}}/100AU</span>
            </div>
        </div>
        <button v-on:click.prevent=removeShip>Remove Ship</button>
    </div>
  </div>
</template>

<script>
import Module from './Module.vue';

export default {
  name: 'Ship',
  components: {
      Module
  },
  props: {
      index: Number,
      shipData: Array,
      modules: Object
  },
  data() {
      return {
          classes: {
              collapse: false
          },
          image: '',
          shipTypes: [],
          shipLevels: [],
          name: 'Tester',
          modCosts: [],
          ships: [],
          modAmount: [],
          ship: {
              type: '',
              level: 0,
              cost: 0,
              hydro: 0,
              modules: []
          },
      }
  },
  computed: {
      totalModCost() {
          return this.modCosts.reduce((sum, mod) => sum + mod.cost, 0);
      },
      totalModHydro() {
          return this.modCosts.reduce((sum, mod) => sum + mod.hydro, 0);
      },
      totalProductionCost() {
          return this.totalModCost + this.ship.cost;
      },
      totalProductionHydro() {
          return this.totalModHydro + this.ship.hydro;
      }
  },
  methods: {
      getShipTypes() {
          return this.shipData.map(ship => ship.type);
      },
      getShipByType() {
        let vm = this;
        axios.get(`${serverURL}/ships?type=${vm.ship.type}`)
        .then(res => {
            vm.ships = res.data;
            vm.shipLevels = vm.ships.data.map(data => data.level);
        });
      },
      getShipLevels() {
          this.shipLevels = this.ship.data ? this.ship.data.map(item => item.level) : [];
      },
      getModAmount(mods) {
          return mods.map(m => Array.apply(null, Array(m.amount)).map(() => m.type)).flat();
      },
      changeShipType() {
          this.updateShip();
      },
      updateMod(mod) {
          let found = this.modCosts.length 
            ? this.modCosts.find(m => m.key == mod.key) 
            : false;
          if (found) {
              Object.assign(found, mod)
          } else {
              this.modCosts.push(Object.assign({},mod));
          }
      },
      removeMod(key) {
          let index = this.modCosts.map(i => i.key).indexOf(key);
          if (index > -1) this.modCosts.splice(index, 1);
      },
      updateShip() {
          this.getShipByType();
          if (this.ship.type && this.ship.level) {
              let vm = this;
              axios.get(`${serverURL}/ships?type=${vm.ship.type}&level=${vm.ship.level}`)
                .then(res => {
                    vm.ship = Object.assign(vm.ship, res.data);
                    vm.modAmount = vm.getModAmount(vm.ship.modules);
                    vm.image = require(`../assets/${vm.ship.image}.png`);
                });
          }
      },
      collapse() {
          this.classes.collapse = !this.classes.collapse;
      },
      removeShip() {
          this.$emit('removeShip',this.index);
      }
  },
  created() {
      this.shipTypes = this.getShipTypes();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collapse {
    max-height: 0;
}

.grid-container > div {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
}

.grid-container .cost,
.grid-container .hydro {
    justify-self: end;
}

.grid-container .cost {
    grid-column-start: 4;
}

.grid-container .hydro {
    grid-column-start: 5;
}
</style>
