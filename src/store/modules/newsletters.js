const state = {
    items: [],
    refreshNewsletters: 0,
    item: {

    }
}

const getters = {
    newsletters: state => {
        return state.items
    },
    newsletter: state => {
        return state.item
    },
    refreshNewsletters: state => {
        return state.refreshNewsletters
    }
}

const actions = {
    newsletters ({commit}) {
        axios('newsletters')
            .then(result => commit('NEWSLETTERS', result.data.data))
    },
    sendNewsletter ({commit}, item) {
        axios.post(`newsletters`, item)
            .then(() => commit('REFRESH_NEWSLETTERS'))
    },
    editNewsletter ({commit}, item) {
        axios.put(`newsletters/${item.id}`, item)
            .then(() => commit('REFRESH_NEWSLETTERS'))
    },
    getNewsletter ({commit}, id) {
        axios(`/newsletters/${id}`)
            .then(result => commit('NEWSLETTER', result.data.data))
    },
    deleteNewsletter ({commit}, id) {
        axios.delete(`newsletters/${id}`)
            .then(() => commit('REFRESH_NEWSLETTERS'))
    }
}

const mutations = {
    NEWSLETTERS (state, items) {
        state.items = items
    },
    NEWSLETTER (state, item) {
        state.item = item
    },
    REFRESH_NEWSLETTERS (state) {
        state.refreshNewsletters = ++state.refreshNewsletters
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}