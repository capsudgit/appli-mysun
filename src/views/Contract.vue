<script>
    import VueApexCharts from 'vue-apexcharts'
    import exportSvg from '@/exportSvg.js'

    import BaseBox from '@/components/BaseBox'
    import NoticeBox from '@/components/NoticeBox'
    import BaseButton from '@/components/BaseButton'
    import IconArrowLeft from '@/components/IconArrowLeft'
    import IconArrowRight from '@/components/IconArrowRight'
    import SelectableBox from '@/components/SelectableBox'

    export default {
        name: 'Contract',

        components: {
            BaseBox,
            BaseButton,
            IconArrowLeft,
            IconArrowRight,
            NoticeBox,
            SelectableBox,
            apexchart: VueApexCharts,
        },

        data() {
            return {
                contractDuration: 30,
                chartOptions: {
                    states: {
                        hover: {
                            filter: {
                                type: 'none',
                            }
                        },
                        active: {
                            filter: {
                                type: 'none',
                            }
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        show: false
                    },
                    colors: ['#FF006E', '#3A86FF', '#F7C137', '#73FBD3'],
                }
            }
        },

        computed: {
            draft() {
                return this.$store.getters.quotationDraftById(
                    this.$route.params.draftId
                )
            },

            options() {
                return this.$store.getters.options
            },

            monthlyCost20() {
                return [
                    this.options.loyer_mensuel_20ans,
                    this.options.loyer_mensuel_20ans_with_battery
                ]
            },

            monthlyCost30() {
                return [
                    this.options.loyer_mensuel_30ans,
                    this.options.loyer_mensuel_30ans_with_battery,
                ]
            },

            monthlyCost() {
                const costIndex = this.draft.hasBattery ? 1 : 0
                if (this.contractDuration === 20) {
                    return this.monthlyCost20[costIndex][this.draft.installedPower +'kwh']
                }
                if (this.contractDuration === 30) {
                    return this.monthlyCost30[costIndex][this.draft.installedPower +'kwh']
                }
                return 0
            },

            costShares() {
                return this.options.detail_du_loyer
            },

            costSharesNumbers() {
                return Object.values(this.costShares).map(Number)
            }
        },

        mounted() {
            this.injectDraftInState()
        },

        methods: {
            injectDraftInState() {
                if (this.draft && this.draft.step >= 6) {
                    this.contractDuration = this.draft.contractDuration
                }
            },

            saveDraft() {
                let svg = exportSvg(document.getElementById("chart"));

                const attributes = {
                    contractDuration: this.contractDuration,
                    monthlyCost: this.monthlyCost,
                    chartRent: svg,
                    step: Math.max(6, this.draft.step || 0),
                }

                return this.$store.dispatch('quotationsSaveDraft', {
                    attributes,
                    draftId: this.$route.params.draftId
                })
            },

            handleNextClick() {
                this.saveDraft().then(() => {
                    this.$router.push({ name: 'new-quotation-summary' })
                })
            },
        }
    }
</script>

<template>
    <div class="contract-screen">
        <header class="screen-header">
            <img @click="$router.push('/')" class="logo" src="../assets/logo.png">
            Choix du contrat
        </header>
        <div class="body">
            <div class="btBack">
                <router-link :to="{ name: 'new-quotation-configuration', params: $route.params }">
                    <IconArrowLeft />
                    Retour
                </router-link>
            </div>
            <BaseBox>
                <span slot="header">Durée du contrat</span>
                <div class="selectable-box-wrapper">
                    <SelectableBox
                      @click.native="contractDuration = 20"
                      :active="contractDuration === 20">
                        <p>Contrat sur</p>
                        <div class="value">
                            <strong>20</strong> ans
                        </div>
                    </SelectableBox>
                    <span class="separator">ou</span>
                    <SelectableBox
                      @click.native="contractDuration = 30"
                      :active="contractDuration === 30">
                        <p>Contrat sur</p>
                        <div class="value">
                            <strong>30</strong> ans
                        </div>
                    </SelectableBox>
                </div>
            </BaseBox>
            <NoticeBox class="green-box">
                <p>
                    Montant du loyer mensuel (TTC) : <strong>{{ monthlyCost }}</strong>  €/mois
                </p>
            </NoticeBox>
            <BaseBox>
                <span slot="header">Détail du loyer</span>
                <div class="donut-and-legend">
                    <div class="donut-wrapper">
                        <div id="chart">
                            <div class="donut-center">
                                <p>Total</p>
                                <span class="value">
                                    <strong>{{ monthlyCost }}</strong>€
                                </span>
                            </div>
                            <apexchart type="donut" height="360" :options="chartOptions" :series="costSharesNumbers" />
                        </div>
                    </div>
                    <div class="legend">
                        <div class="legend-item" v-for="(percent, key) in costShares" :key="key">
                            <span class="circle" v-if="key === 'epargne'" style="background: #FF006E"></span>
                            <span class="circle" v-if="key === 'optimisation_de_la_centrale'" style="background: #3A86FF"></span>
                            <span class="circle" v-if="key === 'frais_financiers'" style="background: #F7C137"></span>
                            <span class="circle" v-if="key === 'supervision_et_entretien'" style="background: #73FBD3"></span>

                            <span class="percentage">
                                {{ percent }}%
                            </span>
                            <span class="label" v-if="key === 'epargne'">
                                Épargne
                            </span>
                            <span class="label" v-if="key === 'optimisation_de_la_centrale'">
                                Optimisation de la centrale
                            </span>
                            <span class="label" v-if="key === 'frais_financiers'">
                                Frais financiers
                            </span>
                            <span class="label" v-if="key === 'supervision_et_entretien'">
                                Supervision et entretien
                            </span>
                        </div>
                    </div>
                </div>
            </BaseBox>
        </div>
        <footer class="screen-footer">
            <div class="left-side">
                <BaseButton
                  class="green-button"
                  @click="$router.push({ name: 'new-quotation-configuration' })">
                    <IconArrowLeft />
                    Configuration
                </BaseButton>
            </div>
            <div class="main-content">
                <BaseButton
                  class="green-button filled-button"
                  @click="handleNextClick">
                    Voir le récapitulatif
                    <IconArrowRight />
                </BaseButton>
            </div>
        </footer>
    </div>
</template>

<style lang="stylus">
.contract-screen
    .base-box
    .notice-box
        margin-bottom 32px
        margin-left 24px
        margin-right 24px

    .selectable-box-wrapper
        display flex
        margin-bottom 32px
        align-items center
        justify-content space-around

        .selectable-box
            flex-grow 1
            max-width 130px
            height 130px
            display flex
            align-items center
            flex-direction column
            justify-content center

        p
            font-size 14px
            line-height 18px
            color #2E364D
            margin-bottom 10px

        .value
            font-weight 600
            font-size 20px
            line-height 25px
            text-align center

            strong
                font-size 28px
                line-height 35px

        .separator
            font-size 16px
            line-height 20px
            padding-left 10px
            padding-right 10px

    .notice-box p
        display flex
        align-items center
        justify-content center
        font-weight 600
        font-size 18px
        line-height 23px

        @media only screen and (max-width:750px)
            flex-direction column
            font-size 16px

        strong
            font-weight 900
            font-size 40px
            line-height 50px
            text-align center
            margin-left 25px
            margin-right 5px
            position relative
            top -3px
            @media only screen and (max-width:750px)
                margin-left 0
                margin-right 0
                margin-top 5px

    .donut-and-legend
        .donut-center
            position absolute
            top 0
            bottom 20px
            left 50px
            right 50px
            display flex
            align-items center
            justify-content center
            flex-direction column
            p
                font-weight 600
                font-size 14px

            .value
                font-weight 600
                font-size 18px
                margin-top 5px

                strong
                    font-weight 900
                    font-size 40px

        .legend
            display flex
            flex-direction column
            justify-content center

        .legend-item
            font-size 16px
            line-height 20px
            display flex
            margin-bottom 16px

            .circle
                width 12px
                height 12px
                display inline-block
                border-radius 50%
                margin-right 10px
                margin-top 5px

            .percentage
                margin-right 16px
                font-weight bold
                font-size 16px
                line-height 20px

            &:last-of-type
                margin-bottom 0

</style>