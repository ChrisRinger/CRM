<template>
    <v-container>
        <v-layout>
            <v-flex md12 align-center>
                <v-btn to="/cp/articles/create" outline color="green"">Add article</v-btn>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-actions
                        class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.title }}</td>
                        <td>{{ props.item.category }}</td>
                        <td>{{ props.item.status }}</td>
                        <td>{{ props.item.image }}</td>
                        <td><v-btn :to="`/cp/articles/${props.item.id}`" small outline color="indigo">View</v-btn></td>
                        <td><v-btn :to="`/cp/articles/edit/${props.item.id}`" small outline color="indigo">Edit</v-btn></td>
                        <td><v-btn @click="deleteArticle(props.item.id)" small outline color="red">Delete</v-btn></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'articles',
        data () {
            return {
                headers: [
                    {text: 'Id', value: 'id'},
                    {text: 'Title', value: 'title'},
                    {text: 'Category', value: 'category'},
                    {text: 'Status', value: 'status'},
                    {text: 'Image', value: 'image'},
                    {text: 'Edit', sortable: false},
                    {text: 'Delete', sortable: false}
                ]
            }
        },
        computed: {
            ...mapGetters({
                items: 'articles',
                refreshArticles: 'refreshArticles'
            })
        },
        watch: {
            refreshArticles () {
                this.$store.dispatch('articles')
            }
        },
        methods: {
            deleteArticle (id) {
                this.$store.dispatch('deleteArticle', id)
            }
        },
        created () {
            this.$store.dispatch('articles')
        }
    }
</script>