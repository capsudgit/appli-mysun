import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

import ui from '@/store/modules/ui.js'
import users from '@/store/modules/users.js'
import quotations from '@/store/modules/quotations.js'

Vue.use(Vuex)

export default new Vuex.Store({
	plugins: [createLogger(), createPersistedState()],

    modules: {
        ui,
        users,
        quotations,
    }
})