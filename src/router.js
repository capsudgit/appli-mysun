import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js'

Vue.use(Router)

const retrieveUser = () => {
    return new Promise((resolve, reject) => {
        let unsubscribe

        if (store.getters.isUserLogged) {
            return resolve()
        } else if (!window.localStorage.getItem('token.access_token')) {
            return reject()
        } else {
            store.dispatch('usersGetMe').catch(() => {})
        }

        unsubscribe = store.subscribe(({ type }) => {
            if (type === 'USERS_ME_GET_SUCCESS') {
                unsubscribe()
                return resolve()
            }

            if (type === 'USERS_ME_GET_ERROR') {
                unsubscribe()
                return reject()
            }
        })
    })
}

const onlyForAuthenticatedUser = function(to, from, next) {
    // before entering the app we check if the user is loged in
    return retrieveUser().then(() => {
        next()
    }).catch(() => {
        return next({
            name: 'login',
            query: {
                continueTo: to.fullPath
            }
        })
    })
}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/quotations'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/Login.vue'),
        },
        {
            path: '/quotations',
            name: 'quotations',
            beforeEnter: onlyForAuthenticatedUser,
            component: () => import('./views/Home.vue'),
        },
        {
            path: '/quotations/:draftId',
            name: 'new-quotation',
            beforeEnter: onlyForAuthenticatedUser,
            component: () => import('./views/NewQuotation.vue'),
            children: [
                {
                    path: 'client',
                    name: 'new-quotation-client',
                    component: () => import('./views/ClientInformations.vue'),
                    meta: {
                        step: 1
                    }
                }, {
                    path: 'roofing',
                    name: 'new-quotation-roofing',
                    component: () => import('./views/Roofing.vue'),
                    meta: {
                        step: 2
                    }
                }, {
                    path: 'consumption',
                    name: 'new-quotation-consumption',
                    component: () => import('./views/Consumption.vue'),
                    meta: {
                        step: 3
                    }
                }, {
                    path: 'configuration',
                    name: 'new-quotation-configuration',
                    component: () => import('./views/Configuration.vue'),
                    meta: {
                        step: 4
                    }
                }, {
                    path: 'contract',
                    name: 'new-quotation-contract',
                    component: () => import('./views/Contract.vue'),
                    meta: {
                        step: 5
                    }
                },
            ]
        }, {
            path: '/quotations/:draftId/summary',
            name: 'new-quotation-summary',
            beforeEnter: onlyForAuthenticatedUser,
            component: () => import('./views/Summary.vue'),
        },
    ]
})
