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
      });
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

</style>
