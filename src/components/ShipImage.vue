<template>
  <div id="ship" :class=owner>
      <img :src=src :class=shipClass class="d-block mx-auto mb-2">
  </div>
</template>

<script>
export default {
  name: 'ShipImage',
  props: {
      src: String,
      owner: String,
      shipClass: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#ship {
  transition: height 0.3s, transform 0.3s;
}

#ship .detail {
  height: 200px;
}

#ship .brief {
  height: 50px;
  transform: rotate(45deg);
}

#ship.player {
    filter: sepia(50%) saturate(500%) hue-rotate(159deg) brightness(90%) contrast(100%);
}

#ship.ally {
    filter: sepia(50%) saturate(500%) hue-rotate(50deg) brightness(90%) contrast(100%);
}

#ship.enemy {
    filter: sepia(90%) saturate(500%) hue-rotate(295deg) brightness(75%) contrast(200%);
}
</style>
