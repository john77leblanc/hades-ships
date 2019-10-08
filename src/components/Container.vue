<template>
  <div class="container-fluid">
    <Fleet :ship-data=ships :modules=modules></Fleet>
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
      ships: [],
      modules: {
        weapons: [],
        shields: [],
        mining: []
      }
    }
  },
  methods: {
    getShips() {
      let vm = this;
      axios.get('http://localhost:8081/ships').then(res => {
        vm.ships = res.data;
      });
    },
    getWeaponModules() {
      let vm = this;
      axios.get('http://localhost:8081/modules?type=weapon&name=all').then(res => {
        vm.modules.weapons = res.data;
      });
    },
    getShieldModules() {
      let vm = this;
      axios.get('http://localhost:8081/modules?type=shield&name=all').then(res => {
        vm.modules.shields = res.data;
      });
    },
    getMiningModules() {
      let vm = this;
      axios.get('http://localhost:8081/modules?type=mining&name=all').then(res => {
        vm.modules.mining = res.data;
      });
    }
  },
  created() {
    this.getShips();
    this.getWeaponModules();
    this.getShieldModules();
    this.getMiningModules();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
