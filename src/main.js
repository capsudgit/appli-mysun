import Vue from 'vue'
import axios from 'axios'
import Toasted from 'vue-toasted'
import VueOffline from 'vue-offline'

import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.prototype.$axios = axios.create({
    baseURL: `https://groupe-capsud.com/wp-json/`,
    headers: {
        'Accept': 'application/json'
    }
})

Vue.use(VueOffline)

Vue.use(Toasted, {
    position: 'bottom-center',
    fullWidth: true,
    duration: 5000,
})

Vue.filter('format', function(value) {
    return new Intl.NumberFormat().format(value)
})

Vue.filter('plural', function(value, count) {
    if (count > 1) {
        return value + 's'
    }

    return value
})

window.serviceWorkerRefreshToast = Vue.toasted.show.bind(this, 'Nouvelle version disponible', {
    action : {
        text : 'Mettre à jour',
        onClick : () => {
            document.location.reload(true)
        }
    },
})

if (window.serviceWorkerUpdated) {
    window.serviceWorkerRefreshToast()
}

const token = window.localStorage.getItem('token')
if (token) {
    Vue.prototype.$axios.defaults.headers['Authorization'] = `Bearer ${token}`
}


// service worker skipWaiting can cause app to stay up with outdated
// chunks, when we don't find the requested chunk we reload
const initialHash = window.location.hash
router.onError((error) => {
    if (/^Loading( CSS)? chunk (\d)+ failed\./.test(error.message)) {
        if (initialHash !== '#retry') {
            Vue.toasted.show('Installation de la dernière version...', { duration: null })

            setTimeout(() => {
                window.location.hash = 'retry'
                window.location.reload(true)
            }, 2000)
        } else {
            Vue.toasted.error('Build corrompu.', { duration: null })
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
