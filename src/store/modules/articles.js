const state = {
    items: [],
    refreshArticles: 0,
    item: {}
}

const getters = {
    articles: state => {
        return state.items
    },
    article: state => {
        return state.item
    },
    refreshArticles: state => {
        return state.refreshArticles
    }
}

const actions = {
    articles ({commit}) {
        axios('articles')
            .then(result => commit('ARTICLES', result.data.data))
    },
    storeArticle ({commit}, item) {
        axios.post(`/articles`, item)
            .then(() => commit('REFRESH_ARTICLES'))
    },
    updateArticle ({commit}, item) {
        axios.put(`/articles/${item.id}`, item)
            .then(() => commit('REFRESH_ARTICLES'))
    },
    getArticle ({commit}, id) {
        axios(`/articles/${id}`)
            .then(result => commit('ARTICLE', result.data.data))
    },
    deleteArticle ({commit}, id) {
        axios.delete(`/articles/${id}`)
            .then(() => commit('REFRESH_ARTICLES'))
    }
}

const mutations = {
    ARTICLES (state, items) {
        state.items = items
    },
    ARTICLE (state, item) {
        state.item = item
    },
    REFRESH_ARTICLES (state) {
        state.refreshArticles = ++state.refreshArticles
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}