<!--<template>-->
    <!--<v-container grid-list-md>-->
        <!--<v-layout row wrap>-->
            <!--<v-flex xs6 align-center>-->
                <!--<v-form @submit.prevent="send()" v-model="valid" ref="newsletterValues">-->
                    <!--<v-text-field-->
                            <!--label="Title"-->
                            <!--v-model="item.title"-->
                            <!--:rules="nameRules"-->
                            <!--required-->
                    <!--&gt;</v-text-field>-->
                    <!--<v-text-field-->
                            <!--label="Content"-->
                            <!--textarea-->
                            <!--v-model="item.content"-->
                            <!--:rules="nameRules"-->
                            <!--required-->
                    <!--&gt;</v-text-field>-->

                    <!--<v-btn type="submit" outline color="green">Send newsletter</v-btn>-->
                    <!--<v-btn @click="clear">clear</v-btn>-->
                    <!--<v-btn to="/newsletters" outline color="indigo" left round>Back</v-btn>-->
                <!--</v-form>-->
            <!--</v-flex>-->
        <!--</v-layout>-->
    <!--</v-container>-->
<!--</template>-->

<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-form @submit.prevent="send()" v-model="valid" ref="newsletterValues">
            <v-flex md12 xs12 sm6>
                    <v-text-field
                            box label="Title"
                            v-model="item.title"
                            :rules="titleRules"
                            required
                    ></v-text-field>
            </v-flex>
            <v-flex lg md12 xs12 sm6>
                <v-text-field
                        box multi-line label="Content"
                        v-model="item.content"
                        :rules="contentRules"
                        required
                ></v-text-field>
            </v-flex>

            <v-btn type="submit" outline color="green">Send newsletter</v-btn>
            <v-btn @click="clear">clear</v-btn>
            <v-btn to="/newsletters" left>Back</v-btn>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'newsletters',
        data () {
            return {
                valid: false,
                titleRules: [
                    v => !!v || 'Title is required'
                ],
                contentRules: [
                    v => !!v || 'Content is required'
                ]
            }
        },
        computed: {
            ...mapGetters({
                item: 'newsletter',
                refreshNewsletters: 'refreshNewsletters'
            })
        },
        watch: {
            refreshNewsletters () {
                this.$router.push({path: '/newsletters'})
            }
        },
        methods: {
            send () {
                if (!this.valid) {
                    return
                }

                if (this.item.id) {
                    this.$store.dispatch('editNewsletter', this.item)
                } else {
                    this.$store.dispatch('sendNewsletter', this.item);
                    console.log(this.item)
                }
            },
            clear () {
                this.$refs.newsletterValues.reset()
            }
        },
        created () {
            if (this.$route.params.id) {
                this.$store.dispatch('getNewsletter', this.$route.params.id)
            }
        }
    }
</script>