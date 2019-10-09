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
      });
    },
    getWeaponModules() {
      let vm = this;
      axios.get(serverURL + '/modules?type=weapon&name=all').then(res => {
        vm.modules.weapons = res.data;
      });
    },
    getShieldModules() {
      let vm = this;
      axios.get(serverURL + '/modules?type=shield&name=all').then(res => {
        vm.modules.shields = res.data;
      });
    },
    getMiningModules() {
      let vm = this;
      axios.get(serverURL + '/modules?type=mining&name=all').then(res => {
        vm.modules.mining = res.data;
      });
    },
    getTradeModules() {
      let vm = this;
      axios.get(serverURL + '/modules?type=trade&name=all').then(res => {
        vm.modules.trade = res.data;
      });
    },
    getSupportModules() {
      let vm = this;
      axios.get(serverURL + '/modules?type=support&name=all').then(res => {
        vm.modules.support = res.data;
      });
    }
  },
  created() {
    this.getShips();
    this.getWeaponModules();
    this.getShieldModules();
    this.getMiningModules();
    this.getTradeModules();
    this.getSupportModules();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
