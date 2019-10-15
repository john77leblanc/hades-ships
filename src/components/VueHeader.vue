<template>
  <nav class="navbar navbar-expand-sm bg-dark text-light">
    <h3>{{title}}</h3>
    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <a href="#miners" class="nav-link">Miners</a>
        </li>
        <li class="nav-item">
            <a href="#transports" class="nav-link">Transports</a>
        </li>
        <li class="nav-item">
            <a href="#battleships" class="nav-link">Battleships</a>
        </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'VueHeader',
  props: {
    title: String
  }
}
</script>

<style scoped>

</style>
