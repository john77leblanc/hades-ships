<template>
  <div>
    <span>{{type}}</span>
    <select v-model=name>
        <option v-for="(name, index) in names" :value=name :key=index>{{name}}</option>
    </select>
    <select v-if=name v-model=level>
        <option v-for="(level, index) in levels" :value=level :key=index>{{level}}</option>
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
  methods: {
      getLevels() {
          this.levels = this.modules.filter(m => m.name == this.name)[0].levels;
      },
      getModule() {
          if (this.name && this.level) {
              let vm = this;
              axios.get(`http://localhost:8081/modules?type=${vm.type}&name=${vm.name}&level=${vm.level}`)
                .then(res => {
                    Object.assign(vm.data, res.data);
                });
          }
      }
  },
  created() {
      this.names = this.modules.map(m => m.name);
  },
  beforeUpdate() {
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
