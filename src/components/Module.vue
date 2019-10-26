<template>
  <div class="mb-2">
    <span>{{modType}}</span>
    <img :src=modImage height="25" class="d-block mx-auto" />
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
    <button class="modal-button" v-if=level @click.prevent=setSelected>Data</button>
    <span v-if=!!data.cost class="cost">{{data.cost}}</span>
    <span v-if=!!data.hydro class="hydro">{{data.hydro}}/100AU</span>
    <DataPanel
        v-if=modSelected
        :classes=classes
        :selected=selected
        @closeModal=closeModal()
    ></DataPanel>
  </div>
</template>

<script>
import DataPanel from './FullDataPanel.vue';

export default {
  name: 'Module',
  components: {
      DataPanel
  },
  props: {
    type: String,
    modules: Array
  },
  data() {
      return {
          name: '',
          image: '',
          level: 0,
          names: [],
          levels: [],
          data: {
              cost: 0,
              hydro: 0
          },
          classes: {
              modal: false
          },
          selected: {},
      }
  },
  computed: {
      modType() {
        return this.type[0].toUpperCase() + this.type.slice(1);
      },
      modModules() {
          return this.modules;
      },
      modSelected() {
          return !!Object.keys(this.selected).length;
      },
      modImage() {
          return this.name ? require(`../assets/${this.name.replace(/ /g,'')}.png`) : '';
      }
  },
  methods: {
      setSelected() {
        this.selected = {
            type : this.type,
            name : this.name,
            level : this.level.toString(),
            image : this.modImage
        };
        this.classes.modal = true;
      },
      closeModal() {
          this.selected = {};
          this.classes.modal=false;
      },
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
                    let send = {
                        key : vm.$vnode.key,
                        cost : vm.data.cost,
                        hydro : vm.data.hydro
                    }
                    vm.$emit('updateMod', send);
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
  },
  beforeDestroy() {
      this.$emit('remove', this.$vnode.key);
  }
}
</script>

<style scoped>
.cost {
    grid-column-start: 6;
}

.hydro {
    grid-column-start: 7;
}

.cost,
.hydro {
    justify-self: end;
}
</style>
