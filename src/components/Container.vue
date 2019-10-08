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
        shields: []
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
      axios.get('http://localhost:8081/weapon-modules?name=all').then(res => {
        vm.modules.weapons = res.data;
      });
    },
    getShieldModules() {
      let vm = this;
      axios.get('http://localhost:8081/shield-modules?name=all').then(res => {
        vm.modules.shields = res.data;
      })
    }
  },
  created() {
    this.getShips();
    this.getWeaponModules();
    this.getShieldModules();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
