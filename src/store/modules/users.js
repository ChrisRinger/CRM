const state = {
    items: [],
    refreshUsers: 0,
    item: {}
}

const getters = {
    users: state => {
        return state.items
    },
    user: state => {
        return state.item
    },
    refreshUsers: state => {
        return state.refreshUsers
    }
}

const actions = {
    users ({commit}) {
        axios('users')
            .then(result => commit('USERS', result.data.data))
    },
    storeUser ({commit}, item) {
        axios.post(`/users`, item)
            .then(() => commit('REFRESH_USERS'))
    },
    updateUser ({commit}, item) {
        axios.put(`/users/${item.id}`, item)
            .then(() => commit('REFRESH_USERS'))
    },
    getUser ({commit}, id) {
        axios(`/users/${id}`)
            .then(result => commit('USER', result.data.data))
    },
    deleteUser ({commit}, id) {
        axios.delete(`/users/${id}`)
            .then(() => commit('REFRESH_USERS'))
    }
}

const mutations = {
    USERS (state, items) {
        state.items = items
    },
    USER (state, item) {
        state.item = item
    },
    REFRESH_USERS (state) {
        state.refreshUsers = ++state.refreshUsers
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}