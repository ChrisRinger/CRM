<template>
    <v-content>
        <v-btn to="/events/create" small color="primary">Add event</v-btn>
        <v-data-table
                :headers="headers"
                :items="items"
                hide-actions
                class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.title }}</td>
                <td>{{ props.item.description }}</td>
                <td>{{ props.item.startDate }}</td>
                <td>{{ props.item.endDate }}</td>
                <td><v-btn :to="`/events/${props.item.id}`" small color="primary">Edit event</v-btn></td>
                <td><v-btn @click="deleteEvent(props.item.id)" small color="error">Delete event</v-btn></td>
            </template>
        </v-data-table>
    </v-content>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'roles',
        data () {
            return {
                headers: [
                    {text: 'Id', value: 'id'},
                    {text: 'Title', value: 'title'},
                    {text: 'Description', value: 'description'},
                    {text: 'Start Date', value: 'startDate'},
                    {text: 'End Date', value: 'endDate'},
                    {text: 'Edit', sortable: false},
                    {text: 'Delete', sortable: false}
                ]
            }
        },
        computed: {
            ...mapGetters({
                items: 'events',
                refresh: 'refresh'
            })
        },
        watch: {
            refresh () {
                this.$store.dispatch('items')
            }
        },
        methods: {
            deleteItem (id) {
                this.$store.dispatch('deleteItem', id)
            }
        },
        created () {
            this.$store.dispatch('items')
        }
    }
</script>