<template>
  <div id="app">
      <main class="wrapper">

        <Navigation/>
        <Home/>
        <CurrentProjects/>

      </main>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Home from './components/Home.vue'
import CurrentProjects from './components/CurrentProjects'

export default {
  name: 'App',
  components: {
    Navigation,
    Home,
    CurrentProjects
  }
}
</script>

<style>

</style>
