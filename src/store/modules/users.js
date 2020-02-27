import Vue from 'vue'
import _ from 'lodash'
import { normalize } from 'normalizr'
import schemas from '@/store/schemas'

const setToken = (token) => {
    window.localStorage.setItem('token', token)
    Vue.prototype.$axios.defaults.headers['Authorization'] = `Bearer ${token}`
}
const unsetToken = () => {
    window.localStorage.removeItem('token')
    delete Vue.prototype.$axios.defaults.headers["Authorization"];
}
const setIds = (attributes) => {
    // console.log(attributes);
    // window.localStorage.setItem('ids', attributes.email);
    window.localStorage.setItem('email', attributes.email);
    window.localStorage.setItem('password', attributes.password);
    window.localStorage.setItem('username', attributes.username);
}
const unsetIds = () => {
    window.localStorage.removeItem('ids')
}

export default {
    state: {
        all: {},
        meId: undefined
    },

    actions: {
        userMeGet ({ commit }) {
            return Vue.prototype.$axios.get(`wp/v2/users/me`).then(
                (res) => {
                    const { data } = res

                    const { entities, result } = normalize(data, schemas.user)

                    return commit('USERS_ME_GET_SUCCESS', { entities, result })
                },
                (res) => {
                    commit('USERS_ME_GET_ERROR')
                    throw res
                }
            )
        },

        userAuthenticate ({ dispatch }, { attributes }) {
            unsetToken()
            // unsetIds()
            setIds(attributes);
            return Vue.prototype.$axios.post(`jwt-auth/v1/token`, attributes).then(
                (res) => {
                    const { data } = res

                    setToken(data.token)

                    return dispatch('userMeGet')
                },
                (res) => {
                    throw res
                }
            )
        },

        userRefreshToken({dispatch}) {
            console.log("refresh token");
            const attributes = { 
                'email': window.localStorage.getItem('email'),
                'password' : window.localStorage.getItem('password'),
                'username' : window.localStorage.getItem('username'),
            }
            // console.log('attributes =>',attributes )
            return Vue.prototype.$axios.post(`jwt-auth/v1/token`, attributes).then(
                (res) => {
                    const { data } = res
                    console.log("new token => ",data.token);
                    setToken(data.token)

                    return dispatch('userMeGet')
                },
                (res) => {
                    throw res
                }
            )
        },

        userValidateToken ({ dispatch }) {
            return Vue.prototype.$axios.post(`jwt-auth/v1/token/validate`).then(
                (res) => {
                    const { data } = res
                    console.log(`data: `, data)
                },
                (res) => {
                    throw res
                }
            )
        },

        userPost ({ commit }, { attributes }) {
            console.warning('Backend not implemented')
            return Vue.prototype.$axios.post(`wp/v2/users/register`, attributes).then(
                (res) => {
                    const { data } = res

                    const { entities } = normalize(data, schemas.user)

                    return commit('USERS_POST_SUCCESS', { entities })
                },
                (res) => {
                    throw res
                }
            )
        },

        userMePost ({ commit }, { attributes }) {
            return Vue.prototype.$axios.post(`/wp/v2/users/me`, attributes).then(
                (res) => {
                    const { data } = res

                    const { entities } = normalize(data, schemas.user)

                    return commit('USERS_ME_POST_SUCCESS', { entities })
                },
                (res) => {
                    throw res
                }
            )
        },

        userMeDelete ({ commit }) {
            return Vue.prototype.$axios.delete(`wp/v2/users/me`).then(
                (res) => {
                    unsetToken()
                    return commit('USERS_ME_DELETE_SUCCESS')
                },
                (res) => {
                    throw res
                }
            )
        },

        userLogout ({ commit }) {
            unsetToken()
            return commit('USERS_LOGOUT')
        },
    },

    mutations: {
        USERS_ME_GET_SUCCESS (state, { entities, result }) {
            state.meId = result
            state.all = _.assignWith({}, state.all, entities.users)
        },

        USERS_ME_GET_ERROR(state) {
            state.meId = undefined
        },

        USERS_POST_SUCCESS (state, { entities }) {
            state.all = _.assignWith({}, state.all, entities.users)
        },

        USERS_ME_POST_SUCCESS (state, { entities }) {
            state.all = _.assignWith({}, state.all, entities.users)
        },

        USERS_ME_DELETE_SUCCESS(state) {
            state.all = _.reject(state.all, (user) => user.id === state.meId)
            state.meId = undefined
        },

        USERS_LOGOUT(state) {
            state.meId = undefined
        }
    },

    getters: {
        allUsers (state) {
            return Object.values(state.all)
        },

        me: (state) => {
            return state.all[state.meId]
        },

        isUserLogged: (state) => {
            return !!state.all[state.meId]
        },
    }
}