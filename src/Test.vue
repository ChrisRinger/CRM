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
                        <v-icon>arrow_back</v-icon>
                        <v-toolbar-title>Chat</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon v-on:click="closeChat">clear</v-icon>
                    </v-toolbar>


                    <div id="nameInput" v-show="!isLogged">
                        <v-form>
                            <v-flex>
                                <v-text-field
                                        v-model="userName"
                                        v-on:keydown.enter="sendUserName"
                                        label="Your Name"
                                ></v-text-field>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-btn color="info" v-on:click="sendUserName" :disabled="!userName">Enter</v-btn>
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

                        <v-form>
                            <v-flex>
                                <v-textarea
                                        v-model="message"
                                        v-on:keydown.enter="sendMessage"
                                        label="Your message"
                                ></v-textarea>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-btn color="info" v-on:click="sendMessage" :disabled="!message">Enter</v-btn>
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
                    <div id="userName">userName</div>
                    <div id="msg">Messages</div>
                </v-card>

            </v-flex>
        </v-layout>
    </v-container>

</template>

<script>
    export default {}
</script>