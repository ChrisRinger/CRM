<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex>
                <v-form @submit.prevent="save()" v-model="valid" ref="addArticle">
                    <v-text-field
                            box label="Title"
                            v-model="item.title"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box label="SEO title"
                            v-model="item.seo_title"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box label="Excerpt"
                            v-model="item.excerpt"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box multi-line label="Body"
                            v-model="item.body"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box label="Image"
                            v-model="item.image"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box label="Slug"
                            v-model="item.slug"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box label="Meta description"
                            v-model="item.meta_description"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-text-field
                            box label="Meta keywords"
                            v-model="item.meta_keywords"
                            :rules="nameRules"
                            required
                    ></v-text-field>

                    <v-select
                            box label="Status"
                            v-model="item.status"
                            :items="statuses"
                            :rules="[v => !!v || 'Status is required']"
                            required
                    ></v-select>

                    <v-checkbox
                            box label="Featured"
                            v-model="item.featured"
                    ></v-checkbox>

                    <v-btn type="submit" outline color="green">Add article</v-btn>
                    <v-btn @click="clear">Clear</v-btn>
                    <v-btn to="/cp/articles" left>Back</v-btn>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'article',
        data () {
            return {
                valid: false,
                nameRules: [
                    v => !!v || 'Name is required'
                ],
                statuses: [
                    'PUBLISHED',
                    'DRAFT',
                    'PENDING'
                ]
            }
        },
        computed: {
            ...mapGetters({
                item: 'article',
                refreshArticles: 'refreshArticles'
            })
        },
        watch: {
            refreshArticles () {
                this.$router.push({path: '/cp/articles'})
            }
        },
        methods: {
            save () {
                if (!this.valid) {
                    return
                }

                if (this.item.id) {
                    this.$store.dispatch('updateArticle', this.item)
                } else {
                    this.$store.dispatch('storeArticle', this.item);
                    console.log(this.item)
                }
            },
            clear () {
                this.$refs.addArticle.reset()
            }
        },
        created () {
            if (this.$route.params.id) {
                this.$store.dispatch('getArticle', this.$route.params.id)
            }
        }
    }
</script>