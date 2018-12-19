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
                    <video id="lVideo" autoplay></video>
                </td>
                <td>
                    <video v-html="rVideo" id="remoteVideo" autoplay></video>
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
                    <button id="sendButton">Send</button>
                </td>
                <td></td>
            </tr>
        </table>
    </div>


</template>

<script>

    import _ from 'lodash'
    import io from 'socket.io-client'

    //const localVideo = document.querySelector('#localVideo');
    const remoteVideo = document.querySelector('#remoteVideo');

    export default {
        data: () => ({
            //Check browser
            RTCPeerConnection: null,
            getUserMedia: null,
//            attachMediaStream: null,
//            reattachMediaStream: null,
            webrtcDetectedBrowser: null,
            webrtcDetectedVersion: null,//old

            room: null,
            socket: null,

            sendChannel: null,
            receiveChannel: null,

            // Streams
            localStream: null,
            remoteStream: null,

            pc: null,

            localVideo: null,
            lVideo: document.getElementById('lVideo'),
            rVideo: null,

            // Flags...
            channelReady: false,
            Initiator: false,
            isStarted: false,

            pc_config: null,
            pc_constraints: null,
            sdpConstraints: null,
            constraints: null,
        }),
        mounted() {
            this.$nextTick(function () {

                this.socket.on('created', (room) => {
                    console.log('Created room ' + room);
                    this.Initiator = true;
                    this.userMedia();
                });

                // Handle 'full' message coming back from server:
                // this peer arrived too late :-(
                this.socket.on('full', function (room) {
                    console.log('Room ' + room + ' is full');
                });

                // Handle 'join' message coming back from server:
                // another peer is joining the channel
                this.socket.on('join', (room) => {
                    console.log('Another peer made a request to join room ' + room);
                    console.log('This peer is the initiator of room ' + room + '!');
                    this.channelReady = true;
                    this.checkAndStart();
                });

                // Handle 'joined' message coming back from server:
                // this is the second peer joining the channel
                this.socket.on('joined', (room) => {
                    console.log('This peer has joined room ' + room);
                    this.channelReady = true;
                });

                // Server-sent log message...
                this.socket.on('log', function (array) {
                    console.log.apply(console, array);
                });

                // Receive message from the other peer via the signalling server
                this.socket.on('message', function (message) {
                    console.log('Received message:', message);
                    if (message === 'got user media') {
                        this.checkAndStart();
                    } else if (message.type === 'offer') {
                        if (!this.Initiator && !this.isStarted) {
                            this.checkAndStart();
                        }
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                        this.doAnswer();
                    } else if (message.type === 'answer' && this.isStarted) {
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                    } else if (message.type === 'candidate' && this.isStarted) {
                        var candidate = new RTCIceCandidate({
                            sdpMLineIndex: message.label,
                            candidate: message.candidate
                        });
                        pc.addIceCandidate(candidate);
                    } else if (message === 'bye' && this.isStarted) {
                        this.handleRemoteHangup();
                    }
                });

            })
        },
        computed: {
            channel: function () {
                console.log(this.channelReady + ' from computed method.');
                return this.channelReady;
            }
        },
        watch: {
            channelReady: function (val) {
                console.log(val + ' from watch method.');
            }
        },
        methods: {
            test: function () {
                return '123';
            },
            initWebRTCAdapter: function () {
                if (navigator.mozGetUserMedia) {
                    this.webDetectedBrowser = "firefox";
                    RTCPeerConnection = mozRTCPeerConnection;
                    RTCSessionDescription = mozRTCSessionDescription;
                    RTCIceCandidate = mozRTCIceCandidate;
                    this.getUserMedia = navigator.mozGetUserMedia.bind(navigator);

                    if (!MediaStream.prototype.getVideoTracks) {
                        MediaStream.prototype.getAudioTracks = function() {
                            return [];
                        };
                    };

                    return true
                } else if (navigator.webkitGetUserConnection) {
                    this.webrtcDetectedBrowser = "chrome";

                    RTCPeerConnection = webkitRTCPeerConnection;
                    this.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

                    if (!webkitMediaStream.prototype.getVideoTracks) {
                        webkitMediaStream.prototype.getVideoTracks = function() {
                            return this.videoTracks;
                        };
                        webkitMediaStream.prototype.getAudioTracks = function() {
                            return this.audioTracks;
                        };
                    }

                    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
                        webkitRTCPeerConnection.prototype.getLocalStreams = function() {
                            return this.localStreams;
                        };
                        webkitRTCConnection.prototype.getRemoteStreams = function() {
                            return this.remoteStreams;
                        };
                    }
                    return true;
                } else return false;
            },
            userMedia: function () {
                this.constraints = {video: true};

                navigator.mediaDevices.getUserMedia(this.constraints)
                    .then(function(stream) {

                        console.log(this.webDetectedBrowser + ' lobby');
                        if (this.webDetectedBrowser === "firefox") {
                            console.log(this.webDetectedBrowser + ' firefox');
                            this.lVideo.mozSrcObject = stream;
                            this.lVideo.play();
                        } else if (this.webDetectedBrowser === "chrome") {
                            console.log(this.webDetectedBrowser + ' chrome')
                            this.lVideo.src = webkitURL.createObjectURL(stream);
                        } else {
                            return false;
                        }
                    })
                    .catch(function(err) {

                    });
                console.log('Getting user media with constraints', this.constraints);
            },
            attachMediaStream: function (element, stream) {
                if (this.webDetectedBrowser === "firefox") {
                    element.mozSrcObject = stream;
                    element.play();
                } else if (this.webDetectedBrowser === "chrome") {
                    element.src = webkitURL.createObjectURL(stream);
                } else {
                    return false;
                }
            },
            reattachMediaStream: function (to, from) {
                if (this.webDetectedBrowser === "firefox") {
                    to.mozSrcObject = from.mozSrcObject;
                    to.play();
                } else if (this.webDetectedBrowser === "chrome") {
                    to.src = from.src;
                } else {
                    return false;
                }
            },
            /////////////////////////////////////////////
            // getUserMedia() handlers...
            handleUserMedia: function (stream) {
                this.localStream = stream;
                this.attachMediaStream(this.lVideo, stream);
                console.log(this.lVideo);
                console.log('Adding local stream.');
                this.sendMessage('got user media');
                if (this.Initiator) {
                    this.checkAndStart();
                }
            },
            handleUserMediaError: function (error) {
                console.log('navigator.getUserMedia error: ', error);
            },
            ////////////////////////////////////////////////
            // Send message to the other peer via the signalling server
            sendMessage: function (message) {
                console.log('Sending message: ', message);
                this.socket.emit('message', message);
            },
            ////////////////////////////////////////////////////
            // Channel negotiation trigger function
            checkAndStart: function () {
                if (!this.isStarted && typeof this.localStream != 'undefined' && this.channelReady) {
                    this.createPeerConnection();
                    console.log('createPeerConnection');
                    this.pc.addStream(this.localStream);
                    this.isStarted = true;
                    if (this.Initiator) {
                        this.doCall();
                    }
                }
            },
            /////////////////////////////////////////////////////////
            // Peer Connection management...
            createPeerConnection: function () {
                try {
                    this.pc = new RTCPeerConnection(this.pc_config, this.pc_constraints);
                    this.pc.onicecandidate = this.handleIceCandidate();
                    console.log('Created RTCPeerConnnection with:\n' +
                        '  config: \'' + JSON.stringify(this.pc_config) + '\';\n' +
                        '  constraints: \'' + JSON.stringify(this.pc_constraints) + '\'.');
                } catch (e) {
                    console.log('Failed to create PeerConnection, exception: ' + e.message);
                    alert('Cannot create RTCPeerConnection object.');
                    return;
                }
                this.pc.onaddstream = this.handleRemoteStreamAdded();
                this.pc.onremovestream = handleRemoteStreamRemoved();

                if (this.Initiator) {
                    try {
                        // Create a reliable data channel
                        sendChannel = this.pc.createDataChannel("sendDataChannel",
                            {reliable: true});
                        trace('Created send data channel');
                    } catch (e) {
                        alert('Failed to create data channel. ');
                        trace('createDataChannel() failed with exception: ' + e.message);
                    }
                    sendChannel.onopen = handleSendChannelStateChange;
                    sendChannel.onmessage = handleMessage;
                    sendChannel.onclose = handleSendChannelStateChange;
                } else { // Joiner
                    pc.ondatachannel = gotReceiveChannel;
                }
            },
            // Data channel management
            sendData: function () {
                var data = sendTextarea.value;
                if(isInitiator) sendChannel.send(data);
                else receiveChannel.send(data);
                trace('Sent data: ' + data);
            },
            // Handlers...
            gotReceiveChannel: function (event) {
                trace('Receive Channel Callback');
                receiveChannel = event.channel;
                receiveChannel.onmessage = handleMessage;
                receiveChannel.onopen = handleReceiveChannelStateChange;
                receiveChannel.onclose = handleReceiveChannelStateChange;
            },
            handleMessage: function (event) {
                trace('Received message: ' + event.data);
                receiveTextarea.value += event.data + '\n';
            },
            handleSendChannelStateChange: function () {
                var readyState = sendChannel.readyState;
                trace('Send channel state is: ' + readyState);
                // If channel ready, enable user's input
                if (readyState == "open") {
                    dataChannelSend.disabled = false;
                    dataChannelSend.focus();
                    dataChannelSend.placeholder = "";
                    sendButton.disabled = false;
                } else {
                    dataChannelSend.disabled = true;
                    sendButton.disabled = true;
                }
            },
            handleReceiveChannelStateChange: function () {
                var readyState = receiveChannel.readyState;
                trace('Receive channel state is: ' + readyState);
                // If channel ready, enable user's input
                if (readyState == "open") {
                    dataChannelSend.disabled = false;
                    dataChannelSend.focus();
                    dataChannelSend.placeholder = "";
                    sendButton.disabled = false;
                } else {
                    dataChannelSend.disabled = true;
                    sendButton.disabled = true;
                }
            },
            // ICE candidates management
            handleIceCandidate: function (event) {
                console.log('handleIceCandidate event: ', event);
                if (event.candidate) {
                    this.sendMessage({
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate});
                } else {
                    console.log('End of candidates.');
                }
            },
            // Create Offer
            doCall: function () {
                console.log('Creating Offer...');
                pc.createOffer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
            },
            // Signalling error handler
            onSignalingError: function (error) {
                console.log('Failed to create signaling message : ' + error.name);
            },
            // Create Answer
            doAnswer: function () {
                console.log('Sending answer to peer.');
                pc.createAnswer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
            },
            // Success handler for both createOffer()
            // and createAnswer()
            setLocalAndSendMessage: function (sessionDescription) {
                pc.setLocalDescription(sessionDescription);
                sendMessage(sessionDescription);
            },
            /////////////////////////////////////////////////////////
            // Remote stream handlers...
            handleRemoteStreamAdded: function (event) {
                console.log('Remote stream added.');
                attachMediaStream(remoteVideo, event.stream);
                remoteStream = event.stream;
            },
            handleRemoteStreamRemoved: function (event) {
                console.log('Remote stream removed. Event: ', event);
            },
            /////////////////////////////////////////////////////////
            // Clean-up functions...
            hangup: function () {
                console.log('Hanging up.');
                stop();
                sendMessage('bye');
            },
            handleRemoteHangup: function () {
                console.log('Session terminated.');
                stop();
                this.Initiator = false;
            },
            stop: function () {
                this.isStarted = false;
                if (sendChannel) sendChannel.close();
                if (receiveChannel) receiveChannel.close();
                if (pc) pc.close();
                pc = null;
                sendButton.disabled=true;
            }
        },
        created() {
            //Look after different browser vendors' ways of calling the getUserMedia() API method:
            //Opera --> getUserMedia
            //Chrome --> webkitGetUserMedia
            //Firefox --> mozGetUserMedia
            //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            this.initWebRTCAdapter();

            this.room = prompt('Enter room name:');
            this.socket = io.connect('http://localhost:8181');

            if (this.room !== '') {
                console.log('Create or join room', this.room);
                this.socket.emit('create or join', this.room);
            }

            this.pc_config = {"iceServers":
                [{url:'stun:23.21.150.121'},
                    {url:'stun:stun.1.google.com:19302'}]};

            this.sdpConstraints = this.webrtcDetectedBrowser === 'firefox' ?
                {'offerToReceiveAudio':true,'offerToReceiveVideo':true } :
                {'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }};



        }
    }
</script>