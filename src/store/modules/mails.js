const state = {
    items: [],
    refreshMails: 0,
    item: {

    }
}

const getters = {
    mails: state => {
        return state.items
    },
    mail: state => {
        return state.item
    },
    refreshMails: state => {
        return state.refreshMails
    }
}

const actions = {
    mails ({commit}) {
        axios('mails')
            .then(result => commit('MAILS', result.data.data))
    },
    sendMail ({commit}, item) {
        axios.post(`mails`, item)
            .then(() => commit('REFRESH_MAILS'))
    },
    editMail ({commit}, item) {
        axios.put(`mails/${item.id}`, item)
            .then(() => commit('REFRESH_MAILS'))
    },
    getMail ({commit}, id) {
        axios(`/mails/${id}`)
            .then(result => commit('MAIL', result.data.data))
    },
    deleteMail ({commit}, id) {
        axios.delete(`mails/${id}`)
            .then(() => commit('REFRESH_MAILS'))
    }
}

const mutations = {
    MAILS (state, items) {
        state.items = items
    },
    MAIL (state, item) {
        state.item = item
    },
    REFRESH_MAILS (state) {
        state.refreshMails = ++state.refreshMails
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}