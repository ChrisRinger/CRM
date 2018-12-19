<template>
    <v-container fluid grid-list-lg>
        <v-layout row wrap>

            <v-flex xs12>
                <v-card color="blue-grey darken-2" class="white--text">
                    <v-card-title primary-title>

                    </v-card-title>

                    <v-btn type="submit" outline color="green">Add article</v-btn>
                    <v-btn to="/cp/articles" right>Back</v-btn>
                </v-card>
            </v-flex>

            <v-flex md12 sm6>
                <v-card>
                    <v-subheader><h3>Title</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.title }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>SEO Title</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.seo_title }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Excerpt</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.excerpt }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Body</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.body }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Image</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.image }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Slug</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.slug }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Meta description</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.meta_description }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Meta keywords</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.meta_keywords }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Status</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.status }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-subheader><h3>Featured</h3></v-subheader>
                    <v-container fluid grid-list-sm>
                        <v-layout row wrap>
                            <v-flex  xs7 offset-xs5 offset-md2 offset-lg1>{{ item.featured }}</v-flex>
                        </v-layout>
                    </v-container>
                    <v-divider></v-divider>

                    <v-footer class="mt-5"></v-footer>
                </v-card>
            </v-flex>

            <v-flex>
                    <v-checkbox
                            box label="Featured"
                            v-model="item.featured"
                    ></v-checkbox>


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