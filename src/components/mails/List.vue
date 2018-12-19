<template>
    <v-container>
        <v-layout>
            <v-flex md12 align-center>
                <v-btn to="/mails/send" outline color="green">Send mail</v-btn>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.subject }}</td>
                        <td>{{ props.item.recipient }}</td>
                        <td>{{ props.item.created_at }}</td>
                        <td><v-btn :to="`/mails/${props.item.id}`" small outline color="indigo">View</v-btn></td>
                        <td><v-btn :to="`/mails/edit/${props.item.id}`" small outline color="indigo">Edit</v-btn></td>
                        <td><v-btn @click="deleteMail(props.item.id)" small outline color="red">Delete</v-btn></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'mails',
        data () {
            return {
                headers: [
                    {text: 'Id', value: 'id'},
                    {text: 'Subject', value: 'subject'},
                    {text: 'Recipient', value: 'recipient'},
                    {text: 'Sent', value: 'created_at'},
                    {text: 'View mail', sortable: false},
                    {text: 'Edit mail', sortable: false},
                    {text: 'Delete mail', sortable: false}
                ]
            }
        },
        computed: {
            ...mapGetters({
                items: 'mails',
                refreshMails: 'refreshMails'
            })
        },
        watch: {
            refreshMails () {
                this.$store.dispatch('mails')
            }
        },
        methods: {
            deleteMail (id) {
                this.$store.dispatch('deleteMail', id)
            }
        },
        created () {
            this.$store.dispatch('mails')
        }
    }
</script>