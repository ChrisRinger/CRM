<template>
    <v-container grid-list-md>
        <v-layout>
            <v-flex lg12>
                <v-btn to="/cp/users/create" small outline color="green" right>Add user</v-btn>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.first_name }}</td>
                        <td>{{ props.item.last_name }}</td>
                        <td>{{ props.item.email }}</td>
                        <td><v-btn :to="`/cp/users/${props.item.id}`" small outline color="indigo">View</v-btn></td>
                        <td><v-btn :to="`/cp/users/${props.item.id}`" small outline color="indigo">Edit</v-btn></td>
                        <td><v-btn @click="deleteUser(props.item.id)" small outline color="red">Delete</v-btn></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'users',
        data () {
            return {
                headers: [
                    {text: 'Id', value: 'id'},
                    {text: 'Name', value: 'name'},
                    {text: 'Forename', value: 'first_name'},
                    {text: 'Surname', value: 'last_name'},
                    {text: 'Email', value: 'email'},
                    {text: 'View user', sortable: false},
                    {text: 'Edit user', sortable: false},
                    {text: 'Delete user', sortable: false}
                ]
            }
        },
        computed: {
            ...mapGetters({
                items: 'users',
                refreshUsers: 'refreshUsers'
            })
        },
        watch: {
            refreshUsers () {
                this.$store.dispatch('users')
            }
        },
        methods: {
            deleteUser (id) {
                this.$store.dispatch('deleteUser', id)
            }
        },
        created () {
            this.$store.dispatch('users')
        }
    }
</script>