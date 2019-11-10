<template>
  <div class="grid-container h-auto w-50 p-3 mx-auto" :class=classes>
    <div>
      <module-icon :name=selected.name :level=parseInt(selected.level)></module-icon>
      <div class="d-inline-block">
        <h4>{{selected.name}}</h4>
        <h6>{{selected.type}} module</h6>
      </div>
    </div>
    <div>
      <span>Level</span><span>{{data.level}}</span>
    </div>
    <div>
      <span>Cost</span><span>{{data.cost}}</span>
    </div>
    <div>
      <span>Activate</span><span>{{data.activate}}</span>
    </div>
    <div>
      <span>Hydro</span><span>{{data.hydro}}</span>
    </div>
    <div v-for="(u, index) in unique" :key=index>
      <span>{{u.info}}</span><span>{{data[u.key]}}{{u.append}}</span>
    </div>
    <button @click.prevent=closeModal>Close</button>
  </div>
</template>

<script>
import ModuleIcon from './ModuleIcon.vue';

export default {
  name: 'FullDataPanel',
  components: {
    ModuleIcon
  },
  props: {
    classes: Object,
    selected: Object
  },
  data() {
      return {
        unique: [],
        data: {}
      }
  },
  methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      getUnique() {
        let vm = this;
        axios.get(`${serverURL}/modules?type=${vm.selected.type}&name=${vm.selected.name}&key=unique`)
          .then(res => {
            vm.unique = res.data;
          });
      },
      getData() {
        let vm = this;
        axios.get(`${serverURL}/modules?type=${vm.selected.type}&name=${vm.selected.name}&level=${vm.selected.level}`)
          .then(res => {
            vm.data = res.data;
          });
      }
  },
  created() {
    this.getUnique();
    this.getData();
  }
}
</script>

<style scoped>
.grid-container {
  display: none;
}

.modal {
  display: block;
  position: fixed;
  background-color: #111111;
  opacity: 0.9;
  backdrop-filter: blur(10px);
}

.grid-container > div {
  display: grid;
  grid-template-columns: 50% 50%;
}

.data {
    justify-self: end;
}
</style>
