import Vue from 'vue'
import _ from 'lodash'
import { normalize } from 'normalizr'
import schemas from '@/store/schemas'

function draftToQuotation(draft, meId) {
    return {
        title: `${draft.name} ${draft.firstname}`,
        author: meId,
        fields: {
            personnal_informations: {
                name: draft.name,
                firstname: draft.firstname,
                email: draft.email,
                phone: draft.phone,
            },
            personnal_address: {
                country: 'FRANCE',
                address: draft.address,
                city: draft.city.city,
                zip: draft.city.zipcode,
            },
            pans_capacity: {
                pans: false,
                puissance_total_installable: draft.totalInstallablePower,
                puissance_total_productible: draft.totalProductiblePower,
            },
            consumption_informations: {
                consumption_annual: draft.annualConsumption,
                cost_annual: draft.annualCost,
                first_increase: draft.firstIncrease, // *100
                second_increase: draft.secondIncrease, // *100
                chart_consumption: draft.chartConsumption,
            },
            mysun_configurator: {
                install_power: draft.installedPower,
                battery: draft.hasBattery,
                self_consumption_rate: draft.autoConsumptionRate,
                self_production: draft.autoConsumption,
                sell_production: draft.soldProduction,
                // resale_production: draft.soldProduction,
                resale_production: draft.soldSurplus,
                chart_surplus: draft.chartSurplus,
            },
            choix_du_contrat: {
                duration: draft.contractDuration,
                monthly_rent: draft.monthlyCost,
                chart_rent: draft.chartRent,
            },
            summary: {
                autoconsommation: {
                    cumulative_resale: draft.cumulatedResale,
                    cumulative_edf_bill: draft.cumulativeBills[draft.contractDuration],
                },
                environmental_impact: {
                    waste: draft.radioactiveWaste,
                    co2: draft.CO2,
                    electric_car: draft.carsDistance,
                    home_rent: draft.houseElectricity,
                },
                bill_comparator: {
                    cost_edf_cumulative: draft.cumulativeBills[draft.contractDuration],
                    cost_mysun_cumulative: draft.cumulatedCosts,
                },
                cumulative_economy: draft.cumulatedEconomy,
                chart_compare_bills: draft.chartCompare,
                chart_cumulative_economy: draft.chartCumulativeEco,
                prime: draft.prime,
            },
        },
        status: 'publish'
    }

}

export default {
    state: {
        all: {},
        filteredItems: {},
        filteredPagination: {},
        drafts: {}
    },

    actions: {
        quotationsGet ({ commit }, { params, key }) {
            return Vue.prototype.$axios.get(`/wp/v2/devisapp`, { params }).then(
                (res) => {
                    const pagination = {
                        currentPage: params.page,
                        totalItems: parseInt(res.headers['x-wp-total']),
                        totalPages: parseInt(res.headers['x-wp-totalpages']),
                    }
                    const { data } = res

                    const { entities, result } = normalize(data, [schemas.quotation])

                    commit('QUOTATIONS_GET_SUCCESS', { entities, result, key, pagination })
                },
                (res) => {
                    throw res
                }
            )
        },

        quotationsSend({ commit, state, getters }, { draftId }) {
            const quotation = draftToQuotation(state.drafts[draftId], getters.me.id)

            return Vue.prototype.$axios.post(`/wp/v2/devisapp`, quotation).then(
                (res) => {
                    const { data } = res

                    const { entities, result } = normalize(data, schemas.quotation)

                    commit('QUOTATIONS_POST_SUCCESS', { entities, result })
                },
                (res) => {
                    throw res
                }
            )
        },

        quotationDelete({ commit, state }, {id}) {
            return Vue.prototype.$axios.delete(`/wp/v2/devisapp/`+id).then(
                (res) => {
                    const { data } = res
                    commit('QUOTATIONS_DELETE_POST', {id})
                },
                (res) => {
                    throw res
                }
            )
        },

        quotationsSaveDraft ({ commit }, { attributes, draftId }) {
            commit('QUOTATIONS_SAVE_DRAFT', { attributes, draftId })
        },

        quotationsDeleteDraft ({ commit }, { draftId }) {
            commit('QUOTATIONS_DELETE_DRAFT', { draftId })
        },
    },

    mutations: {
        QUOTATIONS_GET_SUCCESS (state, { entities, result, key, pagination }) {
            const newItems = _.uniq(_.union(state.filteredItems[key], result))

            Vue.set(state.filteredItems, key, newItems)
            Vue.set(state.filteredPagination, key, pagination)

            state.all = _.mergeWith({}, state.all, entities.quotations)
        },

        QUOTATIONS_POST_SUCCESS (state, { entities }) {
            state.all = _.assignWith({}, state.all, entities.quotations)
        },

        QUOTATIONS_SAVE_DRAFT (state, { attributes, draftId }) {
            Vue.set(
                state.drafts,
                draftId,
                Object.assign({}, state.drafts[draftId] || {}, attributes)
            )
        },

        QUOTATIONS_DELETE_DRAFT (state, { draftId }) {
            Vue.delete(state.drafts, draftId)
        },

        QUOTATIONS_DELETE_POST (state, {id}) {
            state.all = {} ;
            state.filteredItems = {} ;
            state.filteredPagination = {} ;
        }
    },

    getters: {
        allQuotations (state) {
            return Object.values(state.all)
        },

        quotationItemsByKey: (state) => (key) => {
            return _.map(state.filteredItems[key], (id) => {
                return state.all[id]
            })
        },

        quotationPaginationByKey: (state) => (key) => {
            return state.filteredPagination[key] || {}
        },

        allDrafts (state) {
            return Object.values(state.drafts)
        },

        quotationDraftById: (state) => (id) => {
            return state.drafts[id]
        },
    }
}