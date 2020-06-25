<template>
    <nav class="navigation">
        <section class="container">
        <a class="navigation-title" href="#home" title="just my homepage :)">
            <h1 class="title">ma.tthias.space</h1>
        </a>
        <ul class="navigation-list float-right">
            <li class="navigation-item">
            <a class="navigation-link" href="https://github.com/matseee" target="_blank" rel="noopener">Github</a>
            </li>
        </ul>
        </section>
    </nav>
</template>

<script>
export default {
    name: 'Navigation'
}
</script>

<style>

    .navigation {
        background:#f4f5f6;
        border-bottom:.1rem solid #d1d1d1;
        display:block;
        height:5.2rem;
        left:0;
        max-width:100%;
        position:fixed;
        right:0;
        top:0;
        width:100%;
        z-index:1
    }

    .navigation .container {
        padding-bottom:0;
        padding-top:0
    }

    .navigation .navigation-list {
        list-style:none;
        margin-bottom:0;
        margin-right:5rem
    }

    @media(min-width:80rem) {
        .navigation .navigation-list {
            margin-right:0
        }
    }

    .navigation .navigation-item {
        float:left;
        margin-bottom:0;
        margin-left:2.5rem;
        position:relative
    }

    .navigation .navigation-title,
    .navigation .title {
        color:#606c76;
        font-family:Gotham Rounded A,Gotham Rounded B,Helvetica Neue,Arial,sans-serif;
        position:relative
    }

    .navigation .navigation-link,
    .navigation .navigation-title,
    .navigation .title {
        display:inline;
        font-size:1.6rem;
        line-height:5.2rem;
        padding:0;
        text-decoration:none
    }

    .navigation .navigation-link.active {
        color:#606c76
    }
</style>