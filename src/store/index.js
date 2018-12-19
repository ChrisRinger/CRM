import Vue from 'vue'
import Vuex from 'vuex'
import articles from './modules/articles'
//import events from './modules/events'
import roles from './modules/roles'
import mails from './modules/mails'
import newsletters from './modules/newsletters'
import users from './modules/users'
import search from './modules/search'
import auth from './modules/auth'
import chat from './modules/chat'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        articles,
        //events,
        roles,
        mails,
        newsletters,
        search,
        users,
        auth,
        chat
    }
})