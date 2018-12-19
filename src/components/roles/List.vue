<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex lg12 md12 align-start>
                <v-btn to="/cp/roles/create" small outline color="green" right>Add role</v-btn>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.name }}</td>
                        <td><v-btn :to="`/cp/roles/edit/${props.item.id}`" small outline color="indigo">Edit role</v-btn></td>
                        <td><v-btn @click="deleteRole(props.item.id)" small outline color="red">Delete role</v-btn></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'roles',
        data () {
            return {
                headers: [
                    {text: 'Id', value: 'id'},
                    {text: 'Name', value: 'name'},
                    {text: 'Edit', sortable: false},
                    {text: 'Delete', sortable: false}
                ]
            }
        },
        computed: {
            ...mapGetters({
                items: 'roles',
                refreshRoles: 'refreshRoles'
            })
        },
        watch: {
            refreshRoles () {
                this.$store.dispatch('roles')
            }
        },
        methods: {
            deleteRole (id) {
                this.$store.dispatch('deleteRole', id)
            }
        },
        created () {
            this.$store.dispatch('roles')
        }
    }
</script>