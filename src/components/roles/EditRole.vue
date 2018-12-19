<template>
    <v-form @submit.prevent="save()" v-model="valid">
        <v-text-field
                label="Name"
                v-model="item.name"
                :rules="nameRules"
                required
        ></v-text-field>

        <v-btn type="submit" small color="primary">Update role</v-btn>
    </v-form>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'role',
        data () {
            return {
                valid: false,
                nameRules: [
                    v => !!v || 'Name is required'
                ]
            }
        },
        computed: {
            ...mapGetters({
                item: 'role',
                refreshRoles: 'refreshRoles'
            })
        },
        watch: {
            refreshRoles () {
                this.$router.push({path: '/cp/roles'})
            }
        },
        methods: {
            save () {
                if (!this.valid) {
                    return
                }

                console.log(this.item);

                this.$store.dispatch('updateRole', this.item)

            }
        },
        created () {
            if (this.$route.params.id) {
                this.$store.dispatch('getRole', this.$route.params.id)
            }
        }
    }
</script>