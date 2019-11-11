<template>
  <div class="bg-dark text-light p-2 ship-brief">
    <slot name="image"></slot>
    <div>
      <h5 class="mb-1">White-Mane</h5>
      <span><i>{{name}}</i></span>
    </div>
    <div class="modules">
      <module-icon
        v-for="(mod, index) in modules"
        :key=index
        :name=mod.name
        :level=mod.level
      ></module-icon>
    </div>
    <div class="details">
      <div>
        <span><b>Cost:</b></span>
        <span class="amount">{{cost}}</span>
      </div>
      <div>
        <span><b>Hydro:</b></span>
        <span class="amount">{{hydro}}/100AU</span>
      </div>
    </div>
    <div>
      <button @click.prevent=expandCollapse>{{active}}</button>
    </div>
  </div>
</template>

<script>
import ModuleIcon from './ModuleIcon.vue';

export default {
  name: 'ShipBrief',
  components: {
      ModuleIcon
  },
  props: {
      name: String,
      modules: Array,
      cost: Number,
      hydro: Number,
      active: String
  },
  methods: {
    expandCollapse() {
      this.$emit('expandCollapse');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus {
  outline: none;
}

.ship-brief {
  display: grid;
  grid-template-columns: 8% 17% 50% 15% 10%;
  align-items: center;
}

.modules {
  justify-self: start;
}

.modules > * {
  display: inline-block;
  margin: 0 1em;
}

.details div {
  display: grid;
  grid-template-columns: 50% 50%;
}

.details div .amount {
  justify-self: end;
}

button {
  display: block;
  color: #6f9aaa;
  background-color: #212a2f;
  border-width: 1px;
  border-style: solid;
  border-color: #58676c;
  border-radius: 10px;
  margin: auto;
}
</style>
