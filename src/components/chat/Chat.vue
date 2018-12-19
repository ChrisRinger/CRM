<template>

    <v-container grid-list-md text-xs-right>
        <v-layout row wrap>
            <v-flex xs4>

                <v-btn fab dark color="teal"
                       absolute
                       right
                       bottom
                       sticky
                       v-show="!isChat"
                       v-on:click="showChat">
                    <v-icon dark>list</v-icon>
                </v-btn>

                <v-card dark color="primary">
                    <v-card-text class="px-0">4</v-card-text>
                </v-card>

                <v-card
                        v-show="isChat"
                        height="400"

                        >
                    <v-toolbar
                            card
                            color="cyan"
                            dark
                    >

                    </v-toolbar>


                        <div id="nameInput" v-show="!isLogged">
                            <v-form id="user_name" v-on:submit.prevent="sendUserName">
                                <v-flex>
                                    <v-text-field
                                            v-model="userName"
                                            v-on:keydown.enter.prevent="sendUserName"
                                            label="Your Name"
                                    ></v-text-field>
                                </v-flex>
                                <v-divider></v-divider>
                                <v-flex xs6>
                                    <v-select
                                            :items="departaments"
                                            v-model="channel"
                                            auto
                                            label="Select department"
                                            hide-details
                                            prepend-icon="map"
                                            single-line
                                    ></v-select>
                                </v-flex>
                                <v-btn type="submit" color="info" :disabled="!userName">Enter</v-btn>
                            </v-form>
                        </div>

                        <div id="chatBox" v-show="isLogged" height="350">
                            <v-card class="d-block allow-overflow" height="350" >
                                <v-list>
                                    <ul>
                                        <li v-for="message in messages">
                                            <p>
                                                <v-subheader>{{ message.user }}</v-subheader> <small></small>
                                                <v-list-tile-content>
                                                    {{ message.text }}
                                            </v-list-tile-content>
                                            </p>
                                        </li>
                                        <v-card id="userInteraction" v-show="isTyping">
                                            User is typing...
                                        </v-card>
                                    </ul>
                                </v-list>
                            </v-card>

                            <v-form id="send_message" v-on:submit.prevent="sendMessage">
                                <v-flex>
                                    <v-textarea
                                            v-model="message"
                                            v-on:keydown.enter.prevent="sendMessage"
                                            v-on:keypress="keyPress"
                                            v-on:keyup="keyUp"
                                            label="Your message"
                                    ></v-textarea>
                                </v-flex>
                                <v-divider></v-divider>
                                <v-btn type="submit" color="info" :disabled="!message">Enter</v-btn>
                            </v-form>

                        </div>


                        <div id="users" v-show="isLogged">
                            <v-list>
                                <ul>
                                    <li v-for="user in users">
                                        <v-btn id="private_message" v-on:click="privateMessage">{{ user.name }}</v-btn>
                                    </li>
                                </ul>
                            </v-list>
                        </div>
                </v-card>

                <v-card v-show="isPrivateMessage">

                </v-card>

            </v-flex>
        </v-layout>
    </v-container>

</template>

<script>
    import { mapGetters } from 'vuex'
    import _ from 'lodash'
    import io from 'socket.io-client'
    let socket = null;

    export default {
        data () {
            return {
                isChat: false,
                isLogged: false,
                message: null,
                messages: [],
                users: [],
                userName: '',
                userId: 1,
                isTyping: false,
                isPrivateMessage: false,

                channel: null,
                e2: 'Texas',
                e3: null,
                e4: null,
                items: [
                    { text: 'State 1' },
                    { text: 'State 2' },
                    { text: 'State 3' },
                    { text: 'State 4' },
                    { text: 'State 5' },
                    { text: 'State 6' },
                    { text: 'State 7' }
                ],
                departaments: [
                    'Enquiries', 'customer-service', 'support',
                    'Business', 'Estimates'
                ]
            }
        },
        computed: {
            ...mapGetters({})
        },
        mounted: function() {
            this.$nextTick(function () {

                socket.on('init-chat', function (messages) {
                    this.messages = messages;
                }.bind(this));

                socket.on('update-users', function (users) {
                    console.log(users);
                    this.users = users;
                }.bind(this));

                socket.on('read-msg', function (message) {
                    this.messages.push({text: message.text, user: message.user, date: message.date});
                    console.log(message);
                    console.log(this.messages + ' messages');
//                    console.log(this.users);
                }.bind(this));

                socket.on('s-key-press', function () {
                    this.isTyping = true;
                    console.log(this.isTyping);
                }.bind(this));

                socket.on('s-key-up', function () {
                    this.isTyping = false;
                    console.log(this.isTyping);
                }.bind(this));

//                socket.on('channel' + channel, function () {
//
//                });

            })
        },
        methods: {
            showChat: function () {
                this.isChat = true;
            },
            closeChat: function () {
                this.isChat = false;
            },
            sendUserName: function () {
                if (this.userName.length > 0) {
                    socket = io('http://localhost:3000/' + this.channel);
                    this.isLogged = true;
                    const payload = {id: this.userId, channel: this.channel, name: this.userName};
                    socket.emit('add-user', payload);//channel & userID
                }
            },
            sendMessage: function () {
                //e.preventDefault()
                if (this.message.length > 0) {
                    const payload = {channel: this.channel, message: this.message, user: this.userName};
                    console.log(payload);
                    socket.emit('send-message', payload);
                    this.message = null;
                }
            },
            privateMessage: function () {
                this.isPrivateMessage = true;
            },
            keyPress: _.throttle(function () {
//                console.log('keyPress');
                socket.emit('key-press');
                //Event presented after emit being sent
            }, 5000),
            keyUp: _.debounce(function () {
//                console.log('keyUp');
                //zbyt duze opoznienie po opuszczeniu klawisza
                socket.emit('key-up')
            }, 3000)
        },
        created () {

        },
    }
</script>