<template>
    <v-container>
        <v-layout>
            <v-flex md12 align-center>
                <v-btn to="/newsletters/send" outline color="green">Send newsletter</v-btn>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.title }}</td>
                        <td>{{ props.item.theme }}</td>
                        <td>{{ props.item.created_at }}</td>
                        <td><v-btn :to="`/newsletters/${props.item.id}`" small outline color="indigo">View</v-btn></td>
                        <td><v-btn :to="`/newsletters/edit/${props.item.id}`" small outline color="indigo">Edit</v-btn></td>
                        <td><v-btn @click="deleteNewsletter(props.item.id)" small outline color="red">Delete</v-btn></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'newsletters',
        data () {
            return {
                headers: [
                    {text: 'Id', value: 'id'},
                    {text: 'Title', value: 'title'},
                    {text: 'Theme', value: 'theme'},
                    {text: 'Sent', value: 'created_at'},
                    {text: 'View Newsletter', sortable: false},
                    {text: 'Edit Newsletter', sortable: false},
                    {text: 'Delete Newsletter', sortable: false}
                ]
            }
        },
        computed: {
            ...mapGetters({
                items: 'newsletters',
                refreshNewsletters: 'refreshNewsletters'
            })
        },
        watch: {
            refreshNewsletters () {
                this.$store.dispatch('newsletters')
            }
        },
        methods: {
            deleteNewsletter (id) {
                this.$store.dispatch('deleteNewsletter', id)
            }
        },
        created () {
            this.$store.dispatch('newsletters')
        }
    }
</script>