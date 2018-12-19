<template>
    <v-form @submit.prevent="send()" v-model="valid">
        <v-text-field
                label="Title"
                v-model="item.title"
                :rules="nameRules"
                required
        ></v-text-field>

        <v-text-field
                label="Content"
                v-model="item.content"
                :rules="nameRules"
                required
        ></v-text-field>

        <v-btn type="submit" small color="primary">Send newsletter</v-btn>
    </v-form>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'newsletters',
        data () {
            return {
                valid: false,
                nameRules: [
                    v => !!v || 'Title is required'
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
                    this.$store.dispatch('sendNewsletter', this.item)
                }
            }
        },
        created () {
            if (this.$route.params.id) {
                this.$store.dispatch('getNewsletter', this.$route.params.id)
            }
        }
    }
</script>