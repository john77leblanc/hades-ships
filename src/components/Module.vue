<template>
    <div class="mb-2">
        <div class="grid-container">
            <span>{{modType}}</span>
            <module-icon :name=selected.name :level=selected.level></module-icon>
            <select v-model=selected.name>
                <option 
                    v-for="(name, index) in names" 
                    :value=name 
                    :key=index
                    @change=updateModule
                >{{name}}</option>
            </select>
            <select v-if=selected.name v-model=selected.level>
                <option 
                    v-for="(level, index) in levels" 
                    :value=level 
                    :key=index
                    @change=updateModule
                >{{level}}</option>
            </select>
            <button class="hades-button modal-button" v-if=selected.level @click.prevent=toggleModal>Data</button>
            <span v-if=!!data.cost class="cost">{{data.cost}}</span>
            <span v-if=!!data.hydro class="hydro">{{data.hydro}}/100AU</span>
        </div>
        <DataPanel
            v-if="selected.name && selected.level"
            :classes=dataPanelClasses
            :selected=selected
            @closeModal=closeModal
        ></DataPanel>
    </div>
</template>

<script>
import ModuleIcon from './ModuleIcon.vue';
import DataPanel from './FullDataPanel.vue';

export default {
  name: 'Module',
  components: {
      ModuleIcon,
      DataPanel
  },
  props: {
    type: String,
    modules: Array
  },
  data() {
      return {
          names: [],
          levels: [],
          data: {
              cost: 0,
              hydro: 0
          },
          dataPanelClasses: {
              fullDataPanel: false
          },
          selected: {
              type: '',
              name: '',
              level: 0,
          },
      }
  },
  computed: {
      modType() {
        return this.selected.type[0].toUpperCase() + this.selected.type.slice(1);
      },
      modModules() {
          return this.modules;
      },
      modSelected() {
          return !!Object.keys(this.selected).length;
      }
  },
  methods: {
      setSelected() {
        this.selected = Object.assign(
            {},
            {
                type : this.type,
                name : this.name,
                level : this.level.toString(),
            }
        );
        this.dataPanelClasses.fullDataPanel = true;
      },
      toggleModal() {
          this.dataPanelClasses.fullDataPanel = !this.dataPanelClasses.fullDataPanel;
      },
      closeModal() {
          this.dataPanelClasses.fullDataPanel=false;
      },
      getNames() {
          this.names = this.modModules.map(m => m.name);
      },
      getLevels() {
          this.levels = this.modModules.find(m => m.name == this.selected.name).levels;
      },
      getModule() {
          if (this.selected.name && this.selected.level) {
              let vm = this;
              axios.get(`${serverURL}/modules?type=${vm.selected.type}&name=${vm.selected.name}&level=${vm.selected.level}`)
                .then(res => {
                    vm.data = Object.assign(vm.data, res.data);
                    let send = {
                        key : vm.$vnode.key,
                        name: vm.name,
                        level: vm.level,
                        cost : vm.data.cost,
                        hydro : vm.data.hydro
                    };
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
      this.selected.type = this.type;
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
.image-holder {
    position: relative;
}

.hexagon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

.hexagon polygon {
    fill: #212a2f;
    stroke: #58676c;
    stroke-width:1;
}

.image-holder img {
    max-height: 20px;
    max-width: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

.grid-container {
    display: grid;
    grid-template-columns: 10% 10% 20% 20% 10% 15% 15%;
    align-items: center;
}

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
