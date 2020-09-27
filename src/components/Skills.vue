<template>
    <section id="skills" class="container">
        <div class="row">
            <template v-for="category in categories">
                <div class="column" :key="category">
                    <h3 class="title">{{ category.key }} skills</h3>
                    <div class="description">
                        <template v-for="(val, idx) in category.values">
                                <span class="badge" :key="idx">{{ val }}</span>
                            <!-- <div class="column" :key="idx">
                            </div> -->
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
                        'git (++)', 'electron (++)', 'nodejs (++)', 'docker (+)', 'capacitor (+)', 'jenkins (+)'
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

    .badge {
        background-color: darkgreen;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
        min-width: 10px;
        padding: 3px 7px;
        margin: 2px;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
    }

    .text {
        color: white;
    }
</style>