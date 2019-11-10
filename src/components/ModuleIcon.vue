<template>
  <div class="image-holder">
      <!-- <svg width="40" height="35" class="hexagon"> -->
        <svg width="100%" viewBox="0 0 40 35" class="hexagon">
          <polygon 
              points="0,17.5 10,0 30,0 40,17.5 30,35 10,35" 
          />
      </svg>
      <img :src=modImage class="d-block mx-auto" />
      <span class="level">{{modLevel}}</span>
  </div>
</template>

<script>
export default {
  name: 'ModuleIcon',
  props: {
    name: String,
    level: Number
  },
  data() {
      return {
          
      }
  },
  computed: {
      modImage() {
          return this.name ? require(`../assets/${this.name.replace(/ /g,'')}.png`) : '';
      },
      modLevel() {
        return this.level ? this.level : '';
      }
  },
  methods: {
      
  }
}
</script>

<style scoped>
.image-holder {
    --hex-width: 50px;
    --hex-height: calc(var(--hex-width) * 1.12);

    position: relative;
    width: var(--hex-width);
    height: var(--hex-height);
    margin: auto;
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
    max-width: calc(var(--hex-width) * 0.5);
    max-height: calc(var(--hex-height) * 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

.image-holder span.level {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #72a89a;
  text-shadow: 0 0 4px 4px;
}
</style>
