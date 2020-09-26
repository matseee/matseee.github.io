<template>
    <section id="skills" class="container">
        <div class="row">
            <template v-for="category in categories">
                <div class="column" :key="category">
                    <h3 class="title">{{ category.key }} skills</h3>
                    <div class="description">
                        <template v-for="(val, idx) in category.values">
                            <div class="column" :key="idx">
                                <a class="button button-clear">{{ val }}</a>
                                <br v-if="idx % 2 == 0">
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Skills',
    data: function () {
        return {
            categories: [
                {
                    key: 'language',
                    values: [
                        'abap (++)', 'typescript (+++)', 'java (+)'
                    ],
                },
                {
                    key: 'framework',
                    values: [
                        'angular (+++)', 'ionic (+++)', 'sap ui5 (++)', 'android (+)'
                    ],
                },
                {
                    key: 'tool',
                    values: [
                        'git (++)', 'jenkins (+)'
                    ],
                }
            ]
        }
    }
}
</script>

<style scoped>

    .container {
        text-align: center;
        background-color: #f4f5f6;
        min-width: 100%;
    }

    .description {
        margin-bottom: 2.0rem;
    }

</style>