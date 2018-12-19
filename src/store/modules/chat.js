const state = {
    isConnected: false,
    socketMessage: null
}

const getters = {
    isConnected: state => {
        return state.isConnected
    },
    socketMessage: state => {
        return state.socketMessage
    }
}

const actions = {
    connect ({commit}) {
        console.log('commit')
        // axios('http://localhost:3000')
        //     .then(result => commit('SOCKET_CONNECT', result.data.data))
    }
}

const mutations = {
    SOCKET_CONNECT (state) {
        state.isConnected = true
    },
    SOCKET_DISCONNECT (state) {
        state.isConnected = false
    },
    SOCKET_USER_MESSAGE (state, message) {
        state.socketMessage = message
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}