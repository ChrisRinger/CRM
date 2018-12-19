<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-form @submit.prevent="save()" v-model="valid" ref="userValues">
                <v-flex md12 xs12 sm6>
                    <v-text-field
                            box label="Name"
                            v-model="item.name"
                            :rules="nameRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex lg md12 xs12 sm6>
                    <v-text-field
                            box label="First name"
                            v-model="item.first_name"
                            :rules="first_nameRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex lg md12 xs12 sm6>
                    <v-text-field
                            box label="Last name"
                            v-model="item.last_name"
                            :rules="last_nameRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex lg md12 xs12 sm6>
                    <v-text-field
                            box label="Password"
                            v-model="item.password"
                            :rules="passwordRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex lg md12 xs12 sm6>
                    <v-text-field
                            box label="Email"
                            v-model="item.email"
                            :rules="emailRules"
                            required
                    ></v-text-field>
                </v-flex>

                <v-btn type="submit" outline color="green">Create user</v-btn>
                <v-btn @click="clear">clear</v-btn>
                <v-btn to="/cp/users" left>Back</v-btn>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'user',
        data () {
            return {
                valid: false,
                nameRules: [
                    v => !!v || 'Name is required'
                ],
                first_nameRules: [
                    v => !!v || 'First name is required'
                ],
                last_nameRules: [
                    v => !!v || 'Last name is required'
                ],
                passwordRules: [
                    v => !!v || 'Password name is required'
                ],
                emailRules: [
                    v => !!v || 'Email is required'
                ]
            }
        },
        computed: {
            ...mapGetters({
                item: 'user',
                refreshUsers: 'refreshUsers'
            })
        },
        watch: {
            refreshUsers () {
                this.$router.push({path: '/cp/users'})
            }
        },
        methods: {
            save () {
                if (!this.valid) {
                    return
                }

                if (this.item.id) {
                    this.$store.dispatch('updateUser', this.item)
                } else {
                    this.$store.dispatch('storeUser', this.item)
                }
            },
            clear () {
                this.$refs.userValues.reset()
            }
        },
        created () {
            if (this.$route.params.id) {
                this.$store.dispatch('getUser', this.$route.params.id)
            }
        }
    }
</script>