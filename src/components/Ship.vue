<template>
  <div class="col-12 card bg-dark text-light">
    <input v-model=name class="bg-dark text-white border-left-0 border-top-0 border-right-0 border-bottom-1 ship-name" />
    <div class="row mt-3">
        <div class="col-sm-3">
            <img v-if=image :src=image height="200" class="d-block mx-auto">
        </div>
        <div :class=classes class="col-sm-9 grid-container">
            <div>
                <select name="ship" id="" class="ship-type" v-model=ship.type>
                    <option v-for="(ship, index) in shipTypes" :key=index :value=ship>{{ship}}</option>
                </select>
                <select name="level" id="" class="ship-type" v-model=ship.level>
                    <option v-for="(level, index) in shipLevels" :key=index :value=level>{{level}}</option>
                </select>
                <span class="cost">{{ship.cost}}</span>
                <span class="hydro">{{ship.hydro}}/100AU</span>
            </div>
            <div>
                <span><b>Type</b></span>
                <span><b>Name</b></span>
                <span class="cost"><b>Cost</b></span>
                <span class="hydro"><b>Hydro</b></span>
            </div>
            <Module :type="'Weapon'" :modules=modules.weapons></Module>
            <Module :type="'Shield'" :modules=modules.shields></Module>
            <Module :type="'Mining'" :modules=modules.mining></Module>
            <div v-for="(mod, index) in support" :key=index>
                <span>Support</span>
                <span>{{mod.name}}</span>
                <span class="cost">{{mod.cost}}</span>
                <span class="hydro">{{mod.hydro}}/100AU</span>
            </div>
            <div>
                <span>Total:</span>
                <span class="cost total-cost">{{totalCost}}</span>
                <span class="hydro total-hydro">{{totalHydro}}/100AU</span>
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
          sample: {
              type: 'Weapon',
              name: 'Battery',
              cost: 100,
              hydro: 20
          },
          image: '',
          shipTypes: [],
          shipLevels: [1,2,3,4,5,6],
          name: 'Tester',
          weapon: {},
          shield: {},
          support: [],
          modCost: 0,
          modHydro: 0,
          totalCost: 0,
          totalHydro: 0,
          ship: {
              type: '',
              level: 1,
              cost: 0,
              hull: 0,
              hydro: 0
          },
          shipModules: [
              {
                  type: 'weapon',
                  name: 'Battery',
                  level: 9,
                  damage: 315,
                  cost: 20000,
                  hydro: 16
              },
              {
                  type: 'shield',
                  name: 'Omega',
                  level: 7,
                  strength: 14000,
                  cost: 20000,
                  hydro: 0,
                  activate: 2000
              },
              {
                  type: 'support',
                  name: 'Sanctuary',
                  level: 1,
                  cost: 5000,
                  hydro: 2
              },
              {
                  type: 'support',
                  name: 'Salvage',
                  level: 5,
                  cost: 15000,
                  hydro: 14
              },
              {
                  type: 'support',
                  name: 'EMP',
                  level: 5,
                  cost: 2500,
                  hydro: 0,
                  activate: 400
              }
          ]
      }
  },
  methods: {
      getShipTypes() {
          return this.shipData.map(ship => ship.type);
      },
      getShipLevels(ship) {
          return ship.map(data => data.level)
      },
      updateShip() {
          if (this.ship.type && this.ship.level) {
              let vm = this;
              axios.get(`http://localhost:8081/ships?type=${vm.ship.type}&level=${vm.ship.level}`)
                .then(res => {
                    Object.assign(vm.ship, res.data);
                });
          }
      },
      updateShipImage() {
          this.image = typeof this.ship.image != 'undefined' ? require('../assets/' + this.ship.image + '.png') : '';
      },
      updateTotalCost() {
          this.totalCost = this.ship.cost + this.modCost;
      },
      updateTotalHydro() {
          this.totalHydro   = this.ship.hydro + this.modHydro;
      },
      getCost(mod) {
          return mod.cost;
      },
      getHydro(mod) {
          return mod.hydro;
      },
      getModCost() {
          return this.shipModules.map(this.getCost).reduce((sum, mod)=> {return sum + mod},0);
      },
      getModHydro() {
          return this.shipModules.map(this.getHydro).reduce((sum, mod)=> {return sum + mod},0);
      },
      getModByType(type) {
          return this.shipModules.find(mod=>mod.type==type);
      },
      collapse() {
          this.classes.collapse = !this.classes.collapse;
      },
      removeShip() {
          this.$emit('removeShip',this.index);
      }
  },
  created() {
      this.shipTypes    = this.getShipTypes();
      this.modCost      = this.getModCost();
      this.modHydro     = this.getModHydro();
      this.weapon       = this.getModByType('weapon');
      this.shield       = this.getModByType('shield');
      this.support      = this.getModByType('support');
  },
  beforeUpdate() {
      this.updateShip();
      this.updateTotalCost();
      this.updateTotalHydro();
      this.updateShipImage();
  }
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
