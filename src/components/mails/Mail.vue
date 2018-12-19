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
            <v-form @submit.prevent="send()" v-model="valid" ref="mailValues">
                <v-flex md12>
                    <v-text-field
                            box label="Subject"
                            v-model="item.subject"
                            :rules="subjectRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex md12>
                    <v-text-field
                            box multi-line label="Content"
                            v-model="item.content"
                            :rules="contentRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex md12>
                    <v-text-field
                            box label="Recipient"
                            v-model="item.recipient"
                            :rules="recipientRules"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex lg md12 xs12 sm6>
                    <v-text-field
                            box label="Attachment"
                            v-model="item.attachment"
                    ></v-text-field>
                </v-flex>

                <v-btn type="submit" outline color="green">Send mail</v-btn>
                <v-btn @click="clear">clear</v-btn>
                <v-btn to="/mails" left>Back</v-btn>
            </v-form>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'mails',
        data () {
            return {
                valid: false,
                subjectRules: [
                    v => !!v || 'Subject is required'
                ],
                contentRules: [
                    v => !!v || 'Content is required'
                ],
                recipientRules: [
                    v => !!v || 'Recipient is required'
                ],
                attachmentRules: [
                    v => !!v || 'Attachment'
                ]
            }
        },
        computed: {
            ...mapGetters({
                item: 'mail',
                refreshMails: 'refreshMails'
            })
        },
        watch: {
            refreshMails () {
                this.$router.push({path: '/mails'})
            }
        },
        methods: {
            send () {
                if (!this.valid) {
                    return
                }

                if (this.item.id) {
                    this.$store.dispatch('editMail', this.item)
                } else {
                    this.$store.dispatch('sendMail', this.item);
                    //console.log(this.item)
                }
            },
            clear () {
                this.$refs.mailValues.reset()
            }
        },
        created () {
            if (this.$route.params.id) {
                this.$store.dispatch('getMail', this.$route.params.id)
            }
        }
    }
</script>