<template>
  <div class="bg-dark text-light p-2 ship-brief">
    <div class="ship-player">
      <div class="image">
        <slot name="image"></slot>
      </div>
      <div class="player-name-holder">
        <input 
          v-model=playerName
          placeholder="Player name"
          class="d-inline-block w-100 text-white player-name"
        />
        <span><i>{{name}}</i></span>
      </div>
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
      <button class="d-block mx-auto hades-button" @click.prevent=expandCollapse>{{active}}</button>
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
  data() {
    return {
      playerName: ''
    }
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

.player-name {
  font-size: 1.2em;
  text-align: left;
  background-color: transparent;
  border: none;
}

.ship-brief {
  display: grid;
  grid-template-columns: 25% 50% 15% 10%;
  align-items: center;
  border-bottom: 1px solid #6f9aaa;
}

.ship-player {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.ship-player > * {
  order: 1;
}

.ship-player .image {
  width: 30%;
  margin: auto;
}

.player-name-holder {
    width: 70%;
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

@media only screen and (max-width: 600px) {
  .ship-brief {
    display: flex;
    flex-wrap: wrap;
  }

  .ship-player {
    border-bottom: 1px solid #212a2f;
  }

  .ship-brief .modules {
    width: 100%;
  }
}
</style>
