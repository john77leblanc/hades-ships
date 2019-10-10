<template>
  <div>
    <span>{{modType}}</span>
    <select v-model=name>
        <option 
            v-for="(name, index) in names" 
            :value=name 
            :key=index
            v-on:change=updateModule
        >{{name}}</option>
    </select>
    <select v-if=name v-model=level>
        <option 
            v-for="(level, index) in levels" 
            :value=level 
            :key=index
            v-on:change=updateModule
        >{{level}}</option>
    </select>
    <span v-if=!!data.cost class="cost">{{data.cost}}</span>
    <span v-if=!!data.hydro class="hydro">{{data.hydro}}/100AU</span>
  </div>
</template>

<script>
export default {
  name: 'Module',
  props: {
    type: String,
    modules: Array
  },
  data() {
      return {
          name: '',
          level: '',
          names: [],
          levels: [],
          data: {
              cost: 0,
              hydro: 0
          }
      }
  },
  computed: {
      modType() {
        return this.type[0].toUpperCase() + this.type.slice(1);
      },
      modModules() {
          return this.modules;
      }
  },
  methods: {
      getNames() {
          this.names = this.modModules.map(m => m.name);
      },
      getLevels() {
          this.levels = this.modModules.find(m => m.name == this.name).levels;
      },
      getModule() {
          if (this.name && this.level) {
              let vm = this;
              axios.get(`${serverURL}/modules?type=${vm.modType}&name=${vm.name}&level=${vm.level}`)
                .then(res => {
                    vm.data = Object.assign(vm.data, res.data);
                });
          }
      },
      updateModule() {
          this.getLevels();
          this.getModule();
      }
  },
  created() {
      this.getNames();
  },
  beforeUpdate() {
      this.getNames();
      this.getLevels();
      this.getModule();
  }
}
</script>

<style scoped>
.cost {
    grid-column-start: 4;
}

.hydro {
    grid-column-start: 5;
}

.cost,
.hydro {
    justify-self: end;
}
</style>
