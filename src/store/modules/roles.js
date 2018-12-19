const state = {
    items: [],
    refreshRoles: 0,
    item: {}
}

const getters = {
    roles: state => {
        return state.items
    },
    role: state => {
        return state.item
    },
    refreshRoles: state => {
        return state.refreshRoles
    }
}

const actions = {
    roles ({commit}) {
        axios('/roles')
            .then(result => commit('ROLES', result.data.data))
    },
    storeRole ({commit}, item) {
        axios.post(`/roles`, item)
            .then(() => commit('REFRESH_ROLES'))
    },
    updateRole ({commit}, item) {
        axios.put(`/roles/${item.id}`, item)
            .then(() => commit('REFRESH_ROLES'))
    },
    getRole ({commit}, id) {
        axios(`/roles/${id}`)
            .then(result => commit('ROLE', result.data.data))
    },
    deleteRole ({commit}, id) {
        axios.delete(`/roles/${id}`)
            .then(() => commit('REFRESH_ROLES'))
    }
}

const mutations = {
    ROLES (state, items) {
        state.items = items
    },
    ROLE (state, item) {
        state.item = item
    },
    REFRESH_ROLES (state) {
        state.refreshRoles = ++state.refreshRoles
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}