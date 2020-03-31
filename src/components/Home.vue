<template>
    <header id="home" class="header">
        <section class="container">
            <h1>Hello I'm Matthias</h1>
            <p>a software development enthusiast since the age of 13 years.</p>
        </section>
    </header>
</template>
<script>
export default {
    name: 'Home'
}
</script>

<style scoped>
  .header {
    background-color:#f4f5f6;
    padding-top:1rem
  }
  
  @media(min-width:40rem) {
    .header {
      padding-top:5rem
    }
  }

  .header+section {
    border-top:0
  }

  .header .container {
    border-top:0;
    padding-bottom:7.5rem;
    padding-top:7.5rem;
    position:relative;
    text-align:center
  }

  .header .title {
    font-family:Gotham Rounded A,Gotham Rounded B,Helvetica Neue,Arial,sans-serif
  }
</style>