<template>
    <div>

        <table border="1" width="100%">
            <tr>
                <th>
                    Local video

                </th>
                <th>
                    'Remote' video

                </th>
            </tr>
            <tr>
                <td>
                    <video id="localVideo" autoplay></video>
                </td>
                <td>
                    <video id="remoteVideo" autoplay></video>
                </td>
            </tr>
            <tr>
                <td align="center">
				<textarea rows="4" cols="60" id="dataChannelSend" disabled
                          placeholder="This will be enabled once the data channel is up..."></textarea>
                </td>
                <td align="center">
                    <textarea rows="4" cols="60" id="dataChannelReceive" disabled></textarea>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <button v-on:click="sendData" id="sendButton" disabled>Send</button>
                </td>
                <td></td>
            </tr>
        </table>
    </div>


</template>

<script>

    import _ from 'lodash'
    import io from 'socket.io-client'
    import videoChat from './videoChat'

    export default {
        data: () => ({
            drawer: null,
            title: 'Your Logo',
            icons: ['fab fa-facebook', 'fab fa-twitter', 'fab fa-google-plus', 'fab fa-linkedin', 'fab fa-instagram'],
            rows: [
                {
                    title: 'Company Name',
                    children: ['Here you can use rows and columns here to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit']
                },
                {
                    title: 'Products',
                    children: ['MDBootstrap', 'MDWordPress', 'BrandFlow', 'Bootstrap Angular']
                },
                {
                    title: 'Useful Links',
                    children: ['Your account', 'Become an Affiliate', 'Shipping Rates', 'Helper']
                }
            ],
            dialog: false,
            notifications: false,
            sound: true,
            widgets: false,

            // Data channel information
            sendChannel: '',
            receiveChannel: '',

            sendTextarea: document.getElementById("dataChannelSend"),
            receiveTextarea: document.getElementById("dataChannelReceive"),

            // HTML5 <video> elements
            localVideo: document.querySelector('#localVideo'),
            remoteVideo: document.querySelector('#remoteVideo'),

            // Flags...
            isChannelReady: '',
            isInitiator: '',
            isStarted: '',

            // WebRTC data structures
            // Streams
            localStream: '',
            remoteStream: '',
            // Peer Connection
            pc: '',

            items: [
                {
                    title: 'Click Me'
                },
                {
                    title: 'Click Me'
                },
                {
                    title: 'Click Me'
                },
                {
                    title: 'Click Me 2'
                }
            ],
            select: [
                {text: 'State 1'},
                {text: 'State 2'},
                {text: 'State 3'},
                {text: 'State 4'},
                {text: 'State 5'},
                {text: 'State 6'},
                {text: 'State 7'}
            ]
        }),
        props: {
            source: String
        },
        mounted: function () {
            this.$nextTick(function () {

                // 1. Server-->Client...
/////////////////////////////////////////////

// Handle 'created' message coming back from server:
// this peer is the initiator
                socket.on('created', function (room) {
                    console.log('Created room ' + room);
                    isInitiator = true;
                }.bind(this));

// Handle 'full' message coming back from server:
// this peer arrived too late :-(
                socket.on('full', function (room) {
                    console.log('Room ' + room + ' is full');
                }.bind(this));

// Handle 'join' message coming back from server:
// another peer is joining the channel
                socket.on('join', function (room) {
                    console.log('Another peer made a request to join room ' + room);
                    console.log('This peer is the initiator of room ' + room + '!');
                    isChannelReady = true;
                }.bind(this));

// Handle 'joined' message coming back from server:
// this is the second peer joining the channel
                socket.on('joined', function (room) {
                    console.log('This peer has joined room ' + room);
                    isChannelReady = true;
                }.bind(this));

// Server-sent log message...
                socket.on('log', function (array) {
                    console.log.apply(console, array);
                }.bind(this));

// Receive message from the other peer via the signalling server
                socket.on('message', function (message) {
                    console.log('Received message:', message);
                    if (message === 'got user media') {
                        checkAndStart();
                    } else if (message.type === 'offer') {
                        if (!isInitiator && !isStarted) {
                            checkAndStart();
                        }
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                        doAnswer();
                    } else if (message.type === 'answer' && isStarted) {
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                    } else if (message.type === 'candidate' && isStarted) {
                        var candidate = new RTCIceCandidate({
                            sdpMLineIndex: message.label,
                            candidate: message.candidate
                        });
                        pc.addIceCandidate(candidate);
                    } else if (message === 'bye' && isStarted) {
                        handleRemoteHangup();
                    }
                }.bind(this));
////////////////////////////////////////////////

                socket.on('update-users', function (users) {
                    console.log(users);
                    this.users = users;
                }.bind(this));


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
            sendData: function () {
                //e.preventDefault()
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

            //Look after different browser vendors' ways of calling the getUserMedia() API method:
//Opera --> getUserMedia
//Chrome --> webkitGetUserMedia
//Firefox --> mozGetUserMedia
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Clean-up function:
// collect garbage before unloading browser's window
            window.onbeforeunload = function (e) {
                hangup();
            };


// Handler associated with 'Send' button



// Peer Connection ICE protocol configuration (either Firefox or Chrome)
            const pc_config = webrtcDetectedBrowser === 'firefox' ?
                {'iceServers': [{'urls': 'stun:23.21.150.121'}]} : // IP address
                {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};

// Peer Connection contraints: (i) use DTLS; (ii) use data channel
            const pc_constraints = {
                'optional': [
                    {'DtlsSrtpKeyAgreement': true},
                    {'RtpDataChannels': true}
                ]
            };

// Session Description Protocol constraints:
// - use both audio and video regardless of what devices are available
//var sdpConstraints = {'mandatory': {
//  'OfferToReceiveAudio':true,
//  'OfferToReceiveVideo':true }};

            var sdpConstraints = webrtcDetectedBrowser === 'firefox' ?
                {'offerToReceiveAudio': true, 'offerToReceiveVideo': true} :
                {'mandatory': {'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true}};


/////////////////////////////////////////////

// Let's get started: prompt user for input (room name)
            var room = prompt('Enter room name:');

// Connect to signalling server
            var socket = io.connect();

// Send 'Create or join' message to singnalling server
            if (room !== '') {
                console.log('Create or join room', room);
                socket.emit('create or join', room);
            }

// Set getUserMedia constraints
            var constraints = {video: true};

// Call getUserMedia()
            navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);
            console.log('Getting user media with constraints', constraints);

// From this point on, execution proceeds based on asynchronous events...

        }
    }
</script>