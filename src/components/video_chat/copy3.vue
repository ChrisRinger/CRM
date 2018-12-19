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
                    <button id="sendButton" v-show="isSendButton" v-on:click="sendData">Send</button>
                </td>
                <td></td>
            </tr>
        </table>
    </div>


</template>

<script>

    import _ from 'lodash'
    import io from 'socket.io-client'

    //    import videoChatAdapter from 'videoChatAdapter'
    //    import videoChatApp from 'videoChatApp'

    export default {
        data: () => ({
            //Check browser
            RTCPeerConnection: null,
            getUserMedia: null,
            attachMediaStream: null,
            reattachMediaStream: null,
            webrtcDetectedBrowser: null,
            webrtcDetectedVersion: null,
            createIceServer: null,

            isSendButton: false,

            // Data channel information
            sendChannel: null,
            receiveChannel: null,

            // Flags...
            isChannelReady: null,
            isInitiator: null,
            isStarted: null,

            // WebRTC data structures
            // Streams
            localStream: null,
            remoteStream: null,
            // Peer Connection
            pc: null,

            room: null,
            socket: null,

            pc_constraints: null,
            sdpConstraints: null,
            constraints: null,
            pc_config: null,
        }),
        mounted: function() {
            this.$nextTick(function () {

                // Server-mediated message exchanging...
                /////////////////////////////////////////////

                // 1. Server-->Client...
                /////////////////////////////////////////////

                // Handle 'created' message coming back from server:
                // this peer is the initiator
                socket.on('created', function (room){
                    console.log('Created room ' + room);
                    this.isInitiator = true;
                }.bind(this));

                // Handle 'full' message coming back from server:
                // this peer arrived too late :-(
                socket.on('full', function (room){
                    console.log('Room ' + room + ' is full');
                }.bind(this));

                // Handle 'join' message coming back from server:
                // another peer is joining the channel
                socket.on('join', function (room){
                    console.log('Another peer made a request to join room ' + room);
                    console.log('This peer is the initiator of room ' + room + '!');
                    this.isChannelReady = true;
                }.bind(this));

                // Handle 'joined' message coming back from server:
                // this is the second peer joining the channel
                socket.on('joined', function (room){
                    console.log('This peer has joined room ' + room);
                    this.isChannelReady = true;
                }.bind(this));

                // Server-sent log message...
                socket.on('log', function (array){
                    console.log.apply(console, array);
                }.bind(this));

                // Receive message from the other peer via the signalling server
                socket.on('message', function (message){
                    console.log('Received message:', message);
                    if (message === 'got user media') {
                        this.checkAndStart();
                    } else if (message.type === 'offer') {
                        if (!this.isInitiator && !this.isStarted) {
                            this.checkAndStart();
                        }
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                        doAnswer();
                    } else if (message.type === 'answer' && this.isStarted) {
                        pc.setRemoteDescription(new RTCSessionDescription(message));
                    } else if (message.type === 'candidate' && this.isStarted) {
                        var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
                            candidate:message.candidate});
                        pc.addIceCandidate(candidate);
                    } else if (message === 'bye' && this.isStarted) {
                        this.handleRemoteHangup();
                    }
                }.bind(this));
            })
        },
        methods: {
            trace: function (text) {
                // This function is used for logging.
                if (text[text.length - 1] == '\n') {
                    text = text.substring(0, text.length - 1);
                }
                console.log((performance.now() / 1000).toFixed(3) + ": " + text);
            },
            initWebRTCAdapter: function () {
                if (navigator.mozGetUserMedia) {
                    this.webDetectedBrowser = "firefox";
                    RTCPeerConnection = mozRTCPeerConnection;
                    RTCSessionDescription = mozRTCSessionDescription;
                    RTCIceCandidate = mozRTCIceCandidate;
                    this.getUserMedia = navigator.mozGetUserMedia.bind(navigator);

                    attachMediaStream = function(element, stream) {
                        element.mozSrcObject = stream;
                        element.play();
                    };

                    reattachMediaStream = function(to, from) {
                        to.mozSrcObject = from.mozSrcObject;
                        to.play();
                    };

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

                    attachMediaStream = function(element, stream) {
                        element.src = webkitURL.createObjectURL(stream);
                    };

                    reattachMediaStream = function(to, from) {
                        to.src = from.src;
                    };

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
            /////////////////////////////////////////////

            // getUserMedia() handlers...
            /////////////////////////////////////////////
            handleUserMedia: function (stream) {
                this.localStream = stream;
                this.attachMediaStream(localVideo, stream);
                console.log('Adding local stream.');
                this.sendMessage('got user media');
                if (this.isInitiator) {
                    this.checkAndStart();
                }
            },
            handleUserMediaError: function (error) {
                console.log('navigator.getUserMedia error: ', error);
            },
            ////////////////////////////////////////////////

            // 2. Client-->Server
            ////////////////////////////////////////////////
            // Send message to the other peer via the signalling server
            sendMessage: function (message) {
                console.log('Sending message: ', message);
                socket.emit('message', message);
            },
            ////////////////////////////////////////////////////

            ////////////////////////////////////////////////////
            // Channel negotiation trigger function
            checkAndStart: function () {
                if (!this.isStarted && typeof this.localStream != 'undefined' && this.isChannelReady) {
                    createPeerConnection();
                    pc.addStream(localStream);
                    isStarted = true;
                    if (isInitiator) {
                        doCall();
                    }
                }
            },
            /////////////////////////////////////////////////////////
            // Peer Connection management...
            createPeerConnection: function () {
                try {
                    pc = new RTCPeerConnection(pc_config, pc_constraints);
                    pc.onicecandidate = handleIceCandidate;
                    console.log('Created RTCPeerConnnection with:\n' +
                        '  config: \'' + JSON.stringify(pc_config) + '\';\n' +
                        '  constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
                } catch (e) {
                    console.log('Failed to create PeerConnection, exception: ' + e.message);
                    alert('Cannot create RTCPeerConnection object.');
                    return;
                }
                pc.onaddstream = handleRemoteStreamAdded;
                pc.onremovestream = handleRemoteStreamRemoved;

                if (isInitiator) {
                    try {
                        // Create a reliable data channel
                        sendChannel = pc.createDataChannel("sendDataChannel",
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
                    isSendButton = true;
                } else {
                    dataChannelSend.disabled = true;
                    isSendButton = false;
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
                    isSendButton = true;
                } else {
                    dataChannelSend.disabled = true;
                    isSendButton = false;
                }
            },
            // ICE candidates management
            handleIceCandidate: function (event) {
                console.log('handleIceCandidate event: ', event);
                if (event.candidate) {
                    sendMessage({
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
                attachMediaStream(removeVideo, event.stream);
                remoteStream = event.stream;
            },
            handleRemoteStreamRemoved: function (event) {
                console.log('Remote stream removed. Event: ', event);
            },
            /////////////////////////////////////////////////////////

            /////////////////////////////////////////////////////////
            // Clean-up functions...
            hangup: function () {
                console.log('Hanging up.');
                stop();
                sendMessage('Bye');
            },
            handleRemoteHangup: function () {
                console.log('Session terminated');
                stop();
                isInitiator = false;
            },
            stop: function () {
                isStarted = false;
                if (sendChannel) sendChannel.close();
                if (receiveChannel) receiveChannel.close();
                if (pc) pc.close();
                pc = null;
                this.isSend = true;
            }
        },
        created () {

            this.initWebRTCAdapter();

            //Look after different browser vendors' ways of calling the getUserMedia() API method:
            //Opera --> getUserMedia
            //Chrome --> webkitGetUserMedia
            //Firefox --> mozGetUserMedia
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Clean-up function:
            // collect garbage before unloading browser's window
            window.onbeforeunload = function(e){
                hangup();
            }


            var sendTextarea = document.getElementById("dataChannelSend");
            var receiveTextarea = document.getElementById("dataChannelReceive");

            // HTML5 <video> elements
            var localVideo = document.querySelector('#localVideo');
            var remoteVideo = document.querySelector('#remoteVideo');


            // Peer Connection ICE protocol configuration (either Firefox or Chrome)
//            var pc_config = webrtcDetectedBrowser === 'firefox' ?
//                {'iceServers':[{'urls':'stun:23.21.150.121'}]} : // IP address
//                {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};

            // Peer Connection contraints: (i) use DTLS; (ii) use data channel
            this.pc_constraints = {
                'optional': [
                    {'DtlsSrtpKeyAgreement': true},
                    {'RtpDataChannels': true}
                ]};

            // Session Description Protocol constraints:
            // - use both audio and video regardless of what devices are available
            //var sdpConstraints = {'mandatory': {
            //  'OfferToReceiveAudio':true,
            //  'OfferToReceiveVideo':true }};

            this.sdpConstraints = this.webrtcDetectedBrowser === 'firefox' ?
                {'offerToReceiveAudio':true,'offerToReceiveVideo':true } :
                {'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }};


            /////////////////////////////////////////////
            // Let's get started: prompt user for input (room name)
            this.room = prompt('Enter room name:');

            // Connect to signalling server
            this.socket = io.connect('http://localhost:8181');

            // Send 'Create or join' message to singnalling server
            if (this.room !== '') {
                console.log('Create or join room', this.room);
                this.socket.emit('create or join', this.room);
            }

            // Set getUserMedia constraints
            this.constraints = {video: true};

            // Call getUserMedia()
            navigator.getUserMedia(this.constraints, this.handleUserMedia, this.handleUserMediaError);
            console.log('Getting user media with constraints', this.constraints);
        }
    }
</script>