<template>
  <div class="holder p-3" :class=classes>
    <div class="icon-name pb-2 mb-2">
      <div class="d-inline-block icon mx-3">
        <module-icon :name=selected.name :level=parseInt(selected.level)></module-icon>
      </div>
      <div class="d-inline-block">
        <h4>{{selected.name}}</h4>
        <span>{{selected.type}} module</span>
      </div>
    </div>
    <div class="description">
      <p>{{description}}</p>
    </div>
    <div class="stats">
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
    </div>
    <button class="hades-button" @click.prevent=closeModal>Close</button>
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
        description: '',
        data: {}
      }
  },
  methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      getDescription() {
        let vm = this;
        axios.get(`${serverURL}/modules?type=${vm.selected.type}&name=${vm.selected.name}&key=description`)
            .then(res => {
              vm.description = res.data;
            });
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
      },
      updateMod() {
        this.getUnique();
        this.getData();
      }
  },
  watch: {
    "selected.name" : function() {
      this.getUnique();
      this.getDescription();
      this.getData();
    },
    "selected.level" : function() {
      this.getData();
    }
  },
  created() {
    this.updateMod();
  }
}
</script>

<style scoped>
.holder {
  display: none;
}

.fullDataPanel {
  display: block;
  background-color: rgba(20,20,20,0.4);
  backdrop-filter: blur(10px);
}

.icon-name {
  border-bottom: 1px solid #212a2f;
}

.icon {
  justify-self: center;
}

.stats > div {
  display: grid;
  grid-template-columns: 20% 80%;
}

.data {
    justify-self: end;
}
</style>
