<template>
  <div id="app">
    <VueHeader title="Hades Fleet"/>
    <Container msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import VueHeader from './components/VueHeader.vue';
import Container from './components/Container.vue';

export default {
  name: 'app',
  components: {
    VueHeader,
    Container
  }
}
</script>

<style>

</style>
