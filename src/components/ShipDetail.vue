<template>
  <div class="col-12">
    <ship-brief 
      :name=name 
      :modules=ship.modules 
      :cost=parseInt(totalProductionCost)
      :hydro=parseInt(totalProductionHydro)
    >
      <template v-slot:image>
        <ship-image
          :src=image
          :owner=ownerClass
          :shipClass="'brief'"
        ></ship-image>
      </template>
    </ship-brief>
  <div class="col-12 card text-light ship-detail">
    <div class="row mt-3">
        <div class="col-sm-3">
            <input 
              v-model=name 
              placeholder="Name" 
              class="d-inline-block w-100 text-white text-center mb-3 ship-name" 
            />
            <ship-image 
                :src=image 
                :owner=ownerClass
                :shipClass="'detail'"
            ></ship-image>
            <ul class="owner-tabs">
                <li v-for="(owner, index) in ownerTypes" :key=index>
                    <button @click.prevent=setOwner(owner)>{{owner}}</button>
                </li>
            </ul>
        </div>
        <div :class=classes class="col-sm-9 grid-container">
            <h4>{{shipType}} ({{ownerType}})</h4>
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
                <span></span>
                <span><b>Name</b></span>
                <span><b>Level</b></span>
                <span><b>Data</b></span>
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
              <span>Subtotal:</span>
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
  </div>
</template>

<script>
import ShipBrief from './ShipBrief.vue';
import ShipImage from './ShipImage.vue';
import Module from './Module.vue';

export default {
  name: 'ShipDetail',
  components: {
      ShipBrief,
      ShipImage,
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
          name: '',
          ships: [],
          modAmount: [],
          ship: {
              type: '',
              level: 0,
              cost: 0,
              hydro: 0,
              modAllowance: [],
              modules: []
          },
          ownerType: '',
          ownerTypes: [
              'Player',
              'Ally',
              'Enemy'
          ]
      }
  },
  computed: {
      shipType() {
          return this.ship.type ? this.ship.type : "Select Ship";
      },
      ownerClass() {
          return this.ownerType.toLowerCase();
      },
      totalModCost() {
          return this.ship.modules.reduce((sum, mod) => sum + mod.cost, 0);
      },
      totalModHydro() {
          return this.ship.modules.reduce((sum, mod) => sum + mod.hydro, 0);
      },
      totalProductionCost() {
          return this.totalModCost + this.ship.cost;
      },
      totalProductionHydro() {
          return (this.totalModHydro + this.ship.hydro).toFixed(1);
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
      setOwner(owner) {
          this.ownerType = owner;
      },
      updateMod(mod) {
          let found = this.ship.modules.length 
            ? this.ship.modules.find(m => m.key == mod.key) 
            : false;
          if (found) {
              Object.assign(found, mod)
          } else {
              this.ship.modules.push(Object.assign({},mod));
          }
      },
      removeMod(key) {
          let index = this.ship.modules.map(i => i.key).indexOf(key);
          if (index > -1) this.ship.modules.splice(index, 1);
      },
      updateShip() {
          this.getShipByType();
          if (this.ship.type && this.ship.level) {
              let vm = this;
              axios.get(`${serverURL}/ships?type=${vm.ship.type}&level=${vm.ship.level}`)
                .then(res => {
                    vm.ship = Object.assign(vm.ship, res.data);
                    vm.modAmount = vm.getModAmount(vm.ship.modAllowance);
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
      this.ownerType = this.ownerTypes[0];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus {
  outline: none;
}

.ship-detail {
  background-color: rgba(20,20,20,0.6);
  backdrop-filter: blur(10px);
}

.ship-name {
  background-color: transparent;
  border-width: 0;
  border-bottom: 2px solid #58676c;
}

.collapse {
    max-height: 0;
}

.grid-container > div {
    display: grid;
    grid-template-columns: 10% 10% 20% 20% 10% 15% 15%;
    align-items: center;
}

.grid-container .cost,
.grid-container .hydro {
    justify-self: end;
}

.grid-container .cost {
    grid-column-start: 6;
}

.grid-container .hydro {
    grid-column-start: 7;
}

.owner-tabs {
    display: grid;
    grid-template-columns: 33% 34% 33%;
    list-style: none;
    padding: 0;
}

.owner-tabs button {
    width: 100%;
}
</style>
