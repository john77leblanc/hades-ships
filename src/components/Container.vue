<template>
  <div class="container-fluid fill" :style="`background-image: url(${background})`">
    <Fleet 
      v-for="(ship, index) in ships"
      :key=index
      :single-ship-data=ship
      :ship-data=ships 
      :modules=modules
    ></Fleet>
  </div>
</template>

<script>
import Fleet from './Fleet.vue';

export default {
  name: 'Container',
  components: {
    Fleet
  },
  data() {
    return {
      background: require(`../assets/background-1.jpg`),
      ships: [],
      shipTypes: [],
      modules: {
        weapon: [],
        shield: [],
        mining: [],
        trade: [],
        support: []
      }
    }
  },
  methods: {
    getShips() {
      let vm = this;
      axios.get(serverURL + '/ships').then(res => {
        vm.ships = res.data;
        vm.shipTypes = vm.getShipTypes();
      });
    },
    getShipTypes() {
      return this.ships.map(ship => ship.type);
    },
    getModules(type) {
      let vm = this;
      axios.get(`${serverURL}/modules?type=${type}&name=all`).then(res => {
        vm.modules[type] = res.data
      });
    }
  },
  created() {
    this.getShips();
    this.getModules('weapon');
    this.getModules('shield');
    this.getModules('mining');
    this.getModules('trade');
    this.getModules('support');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fill {
  min-height: 100vh;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}
</style>
