import Vue from 'vue'
import db from 'db.js'
import _ from 'lodash'

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export default {
    state: {
        options: {
            prix_kwh: '0.16',
            loyer_mensuel_20ans: { '3kwh': '59', '6kwh': '86', '9kwh': '129' },
            loyer_mensuel_20ans_with_battery: { '3kwh': '128', '6kwh': '175', '9kwh': '208' },
            loyer_mensuel_30ans: { '3kwh': '76', '6kwh': '107', '9kwh': '159' },
            loyer_mensuel_30ans_with_battery: { '3kwh': '103', '6kwh': '142', '9kwh': '170' },
            prime_autoconsommation: { '3kwh': '240', '6kwh': '360', '9kwt': '540' },
            valorisation_de_la_centrale: {
                '3kwh': '11599',
                '6kwh': '16731',
                '9kwh': '22548',
            },
            surplus_price: '0.10',
            'moyenne-autocomsommee-revendue': '0.13',
            detail_du_loyer: {
                epargne: '40',
                optimisation_de_la_centrale: '30',
                frais_financiers: '20',
                supervision_et_entretien: '10',
            },
        },
        citiesProgress: 0
    },

    actions: {
        optionsGet ({ commit }) {
            return Vue.prototype.$axios.get(`acf/v3/options/capsud-app-options/datas`).then(
                (res) => {
                    return commit('OPTIONS_GET_SUCCESS', { options: res.data.datas })
                }
            )
        },

        async setIDBCities({ commit }) {
            window.storageServer = await db.open({
                server: 'my-app',
                version: 1,
                schema: {
                    cities: {
                        key: {
                            keyPath: ['zipcode', 'city']
                        },
                        indexes: {
                            name: {
                                keyPath: ['zipcode', 'city']
                            },
                            zipcode: {},
                        }
                    }
                }
            })

            const count = await window.storageServer.cities.count()

            if (count < 36689) {
                // use bash : uniq -d src/cities.js
                // to find duplicated entries breaking idb insert
                const { default: cities } = await import('@/cities')

                const formatedCities = cities.map((city) => {
                    return {
                        zipcode: city[0],
                        city: city[1],
                        solEdge: city[2]
                    }
                })

                const groupedCities = _.chunk(formatedCities, 367);

                await asyncForEach(groupedCities, async (group, index) => {
                    try {
                        await window.storageServer.cities.add(group);
                        commit('CITIES_SET_PROGRESS', {
                            progress: index / groupedCities.length * 100
                        })
                    } catch (e) {
                        console.error('debug: Error while inserting city on IDB (likely a duplicate)', e)
                    }
                })
            } else {
                commit('CITIES_SET_PROGRESS', {
                    progress: 100
                })
            }
        }
    },

    mutations: {
        OPTIONS_GET_SUCCESS(state, { options }) {
            state.options = options
        },

        CITIES_SET_PROGRESS(state, { progress }) {
            state.citiesProgress = progress
        },
    },

    getters: {
        options: (state) => {
            return state.options
        },

        citiesProgress: (state) => {
            return state.citiesProgress
        },
    }
}
