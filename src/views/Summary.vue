<script>
    import _ from 'lodash'

    import calculateBills from '@/consumption.js'
    import exportSvg from '@/exportSvg.js'

    import LayoutGeneric from '@/layouts/LayoutGeneric'
    import BaseBox from '@/components/BaseBox'
    import BaseButton from '@/components/BaseButton'
    import NoticeBox from '@/components/NoticeBox'
    import BaseGauge from '@/components/BaseGauge'
    import BaseSpinner from '@/components/BaseSpinner'
    import BaseLineChart from '@/components/BaseLineChart'
    import IconArrowLeft from '@/components/IconArrowLeft'
    import IconExport from '@/components/IconExport'
    import IconCheck from '@/components/IconCheck'
    import IlluCentrale from '@/components/IlluCentrale'
    import IlluPoubelle from '@/components/IlluPoubelle'
    import IlluBatterie from '@/components/IlluBatterie'
    import IlluLumiere from '@/components/IlluLumiere'

    const now = parseInt(new Date().getFullYear())

    export default {
        name: 'Summary',

        components: {
            LayoutGeneric,
            BaseBox,
            BaseButton,
            NoticeBox,
            BaseGauge,
            BaseLineChart,
            IconArrowLeft,
            IconExport,
            IconCheck,
            IlluCentrale,
            IlluPoubelle,
            IlluBatterie,
            IlluLumiere,
            BaseSpinner,
        },

        data() {
            const chartXs = [2020, 2025, 2030, 2035, 2040, 2045, 2050]

            return {
                loading: false,
                chartXs: chartXs,
                chartOptions: {
                    colors:['#66AE24', '#FFA742'],
                    markers: {
                        strokeColors: ['#66AE24', '#FFA742'],
                    },
                    xaxis: {
                        categories: chartXs,
                    }
                },
                chartEconomyOptions: {
                    colors:['#66AE24'],
                    markers: {
                        size: 5,
                        strokeColors: ['#66AE24'],
                    },
                    fill: {
                        gradient: {
                            opacityFrom: 0.7,
                            opacityTo: 0.4,
                        },
                    },
                    grid: {
                        xaxis: {
                            lines: {
                                show: false,
                            }
                        },
                        yaxis: {
                            lines: {
                                show: false,
                            }
                        }
                    },
                    xaxis: {
                        labels: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                        axisBorder: {
                            show: false,
                        },
                    },
                    yaxis: {
                        show: false,
                    }
                }
            }
        },

        computed: {
            draft() {
                return this.$store.getters.quotationDraftById(
                    this.$route.params.draftId
                )
            },

            economyXs() {
                return _.range(now, now + this.draft.contractDuration)
            },

            cumulatedCosts() {
                const periodBills = this.MySunBillsMinusRevenu.slice(0, this.draft.contractDuration)
                return Math.round(_.sum(periodBills))
            },

            EDFBills() {
                return calculateBills(now, 2050, this.draft.annualCost, this.draft.firstIncrease, this.draft.secondIncrease)
            },

            chartValuesWithoutPV() {
                return this.chartXs.map((x) => {
                    const periodBills = this.EDFBills.slice(0, x - now)
                    return Math.round(_.sum(periodBills))
                })
            },

            MySunBills() {
                return calculateBills(now, 2050, parseInt(this.draft.monthlyCost) * 12, 0, 0)
            },

            MySunBillsMinusRevenu() {
                return this.MySunBills.map((mySunBill, i) => {
                    let billMinusRevenu = (this.draft.annualCost * (100 - this.draft.autoConsumptionRate) / 100) + mySunBill - this.draft.soldSurplus - this.centralValorisation
                    if (i < 5) {
                        billMinusRevenu = billMinusRevenu - this.primeAutoConsumption
                    }

                    return billMinusRevenu
                })
            },

            chartValuesWithPV() {
                return this.chartXs.map((x) => {
                    const periodBills = this.MySunBillsMinusRevenu.slice(0, x - now)
                    return Math.round(_.sum(periodBills))
                })
            },

            chartValuesEconomy() {
                return this.economyXs.map((x, i) => {
                    const periodMySunBills = this.MySunBillsMinusRevenu[i]
                    const periodEDFBills = this.EDFBills[i]
                    return Math.round(periodEDFBills - periodMySunBills)
                })
            },

            options() {
                return this.$store.getters.options
            },

            cumulatedResale() {
                return this.draft.soldSurplus * this.draft.contractDuration
            },

            primeAutoConsumption() {
                return parseInt(this.options.prime_autoconsommation[this.draft.installedPower + 'kwh'])
            },

            totalPrimeAutoConsumption() {
                return parseInt(this.options.prime_autoconsommation[this.draft.installedPower + 'kwh'] * 5)
            },

            centralValorisation() {
                return parseInt(this.options.valorisation_de_la_centrale[this.draft.installedPower + 'kwh']) / this.draft.contractDuration
            },

            radioactiveWaste() {
                return Math.round(((this.draft.autoConsumption + this.draft.soldProduction) * this.draft.contractDuration * 11) / 11000)
            },

            CO2() {
                return Math.round((this.draft.autoConsumption + this.draft.soldProduction) * this.draft.contractDuration / 11000)
            },

            carsDistance() {
                return Math.round((this.draft.autoConsumption + this.draft.soldProduction) * this.draft.contractDuration * 10)
            },

            houseElectricity() {
                return Math.round((this.draft.autoConsumption + this.draft.soldProduction) * this.draft.contractDuration / 15000)
            },

            gainsTotaux() {
                return this.cumulatedResale + this.chartValuesEconomy[this.chartValuesEconomy.length - 1] + this.totalPrimeAutoConsumption;
            },
        },

        methods: {
            saveDraft() {
                let chart1 = exportSvg(document.getElementById("chartExport1"));
                let chart2 = exportSvg(document.getElementById("chartExport2"));

                const attributes = {
                    chartCompare: chart1,
                    chartCumulativeEco: chart2,
                    radioactiveWaste: this.radioactiveWaste,
                    CO2: this.CO2,
                    carsDistance: this.carsDistance,
                    houseElectricity: this.houseElectricity,
                    cumulatedCosts: this.cumulatedCosts,
                    cumulatedEconomy: Math.round(this.gainsTotaux),
                    cumulatedResale: this.cumulatedResale,
                    prime: this.totalPrimeAutoConsumption,
                    step: 7,
                }

                // console.log('prime =', this.totalPrimeAutoConsumption);

                return this.$store.dispatch('quotationsSaveDraft', {
                    attributes,
                    draftId: this.$route.params.draftId
                })
            },

            handleSendSummaryClick() {
                this.loading = true;

                this.saveDraft().then(() => {
                    return this.$store.dispatch('quotationsSend', {
                        draftId: this.$route.params.draftId
                    })
                }).then(() => {
                    this.loading = false;

                    this.$router.push({
                        name: 'home'
                    })

                    this.$toasted.success('Devis envoyé.')

                    this.$store.dispatch('quotationsDeleteDraft', {
                        draftId: this.$route.params.draftId
                    })
                })
            },

            handleSaveSummaryClick() {
                this.$router.push({
                    name: 'home'
                })
            }
        }
    }
</script>

<template>
    <LayoutGeneric class="summary-screen">
        <div class="padded-content" v-if="draft">
            <div class="breadcrumb">
                <div class="line"></div>
                <div class="items">
                    <router-link :to="{ name: 'new-quotation-client', params: $route.params }"
                        class="breadcrumb-item">
                        <div class="circle">
                            <IconCheck/>
                        </div>
                        <p>
                            Informations personnelles
                        </p>
                    </router-link>
                    <router-link :to="{ name: 'new-quotation-roofing', params: $route.params }"
                        class="breadcrumb-item">
                        <div class="circle">
                            <IconCheck/>
                        </div>
                        <p>
                            Informations toiture
                        </p>
                    </router-link>
                    <router-link :to="{ name: 'new-quotation-consumption', params: $route.params }"
                        class="breadcrumb-item">
                        <div class="circle">
                            <IconCheck/>
                        </div>
                        <p>
                            Informations facture
                        </p>
                    </router-link>
                    <router-link :to="{ name: 'new-quotation-configuration', params: $route.params }"
                        class="breadcrumb-item">
                        <div class="circle">
                            <IconCheck/>
                        </div>
                        <p>
                            Choix du rendement
                        </p>
                    </router-link>
                    <router-link :to="{ name: 'new-quotation-contract', params: $route.params }"
                        class="breadcrumb-item">
                        <div class="circle">
                            <IconCheck/>
                        </div>
                        <p>
                            Choix du contrat
                        </p>
                    </router-link>
                    <router-link :to="{ name: 'new-quotation-summary', params: $route.params }"
                        class="breadcrumb-item">
                        <div class="circle">
                            <IconCheck/>
                        </div>
                        <p>
                            Récapitulatif
                        </p>
                    </router-link>
                </div>
            </div>
            <div class="btBack">
                <router-link :to="{ name: 'new-quotation-contract', params: $route.params }">
                    <IconArrowLeft />
                    Retour
                </router-link>
            </div>
            <BaseBox>
                <span slot="header">Potentiel de l’habitation</span>
                <div class="form-row">
                    <div class="summary-figure">
                        <label>
                            Puissance installable théorique
                        </label>
                        <div class="figure">
                            <strong>{{ draft.totalInstallablePower }}</strong> kWc
                        </div>
                    </div>
                    <div class="summary-figure">
                        <label>
                            Puissance productible théorique
                        </label>
                        <div class="figure">
                            <strong>{{ draft.totalProductiblePower | format }}</strong> kWh/kWc
                        </div>
                    </div>
                </div>
            </BaseBox>
            <BaseBox>
                <span slot="header">Choix de la configuration</span>
                <div class="form-row">
                    <div class="summary-figure">
                        <label>
                            Puissance installée
                        </label>
                        <div class="figure">
                            <strong>{{ draft.installedPower }}</strong> kWc
                        </div>
                    </div>
                    <div class="summary-figure">
                        <label>
                            Puissance produite
                        </label>
                        <div class="figure">
                            <strong>{{ (draft.soldProduction + draft.autoConsumption) | format }}</strong> kWh/an
                        </div>
                    </div>
                </div>
            </BaseBox>
            <BaseBox>
                <span slot="header">Détails de l'autoconsommation</span>
                <div class="form-row" style="margin-bottom: 24px;">
                    <div class="summary-figure">
                        <label>
                            Puissance autoconsommée
                        </label>
                        <div class="figure">
                            <strong>{{ draft.autoConsumption | format }}</strong> kWh/an
                        </div>
                    </div>
                    <div class="summary-figure">
                        <label>
                            Surplus de production
                        </label>
                        <div class="figure">
                            <strong>{{ draft.soldProduction | format }}</strong> kWh/an
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="gauge-wrapper summary-figure summary-figure-green">
                        <h5>Niveau d'autonomie</h5>
                        <div class="gauge-inner">
                            <BaseGauge :value="draft.autoConsumptionRate" />
                            <div class="gauge-center">
                                <strong>{{ draft.autoConsumptionRate }}</strong>%
                            </div>
                        </div>
                    </div>
                    <div class="gauge-cards">
                        <div class="summary-figure" style="margin-bottom: 24px;">
                            <label>
                                Gains cumulés avec économies et aides (estimation)
                            </label>
                            <div class="figure">
                                <strong>{{ Math.round( gainsTotaux ) | format }} </strong> €
                            </div>
                        </div>
                        <div class="summary-figure">
                            <label>
                                Facture EDF cumulée / {{ draft.contractDuration }} ans sans photovoltaïque (estimation)
                            </label>
                            <div class="figure">
                                <strong>{{ draft.cumulativeBills[draft.contractDuration] | format }}</strong> €
                            </div>
                        </div>
                    </div>
                </div>
            </BaseBox>

            <BaseBox>
                <span slot="header">Détails du contrat</span>
                <div class="notice-box-wrapper">
                    <NoticeBox class="green-box">
                        <span slot="header">Durée du contrat</span>
                        <p>
                            <strong>{{ draft.contractDuration }}</strong> ans
                        </p>
                    </NoticeBox>
                    <NoticeBox class="green-box">
                        <span slot="header">Loyer mensuel TTC</span>
                        <p>
                           <strong>{{ draft.monthlyCost }}</strong> €
                        </p>
                    </NoticeBox>
                </div>
            </BaseBox>

            <BaseBox>
                <span slot="header">Impact environnemental</span>
                <div class="impact-cards">
                    <div class="card">
                        <IlluCentrale />
                        <p class="text">Déchets radioactifs évités sur {{ draft.contractDuration }} ans :</p>
                        <div class="value">
                            <strong>{{ radioactiveWaste | format  }}</strong> kg
                        </div>
                    </div>
                    <div class="card">
                        <IlluPoubelle />
                        <p class="text">Émissions de CO2  évitées sur {{ draft.contractDuration }} ans :</p>
                        <div class="value">
                            <strong>{{ CO2 | format  }}</strong> {{ 'tonne' | plural(CO2) }}
                        </div>
                    </div>
                    <div class="card">
                        <IlluBatterie />
                        <p class="text">Équivalent en consommation d’une voiture électrique sur 1 an :</p>
                        <div class="value">
                            <strong>{{ carsDistance | format  }}</strong> km
                        </div>
                    </div>
                    <div class="card">
                        <IlluLumiere />
                        <p class="text">Équivalent en consommation des foyers francais sur 1 an :</p>
                        <div class="value">
                            <strong>{{ houseElectricity | format  }}</strong> {{ 'foyer' | plural(houseElectricity) }}
                        </div>
                    </div>
                </div>
            </BaseBox>

            <BaseBox class="chart-box">
                <span slot="header">Comparatif des dépenses annuelles avec PV et sans PV</span>
                <BaseLineChart id="chart1" :series="[{ data: chartValuesWithPV }, { data: chartValuesWithoutPV }]" :options="chartOptions"/>
                <BaseLineChart id="chartExport1" class="hiddeChartFirst" :series="[{ data: chartValuesWithPV }, { data: chartValuesWithoutPV }]" :options="chartOptions"/>
                <div class="legend">
                    <div class="legend-item">
                        <span class="circle" style="background: #F7C137"></span>
                        <span>
                            Consommation EDF sans photovoltaïque
                        </span>
                    </div>
                    <div class="legend-item">
                        <span class="circle" style="background: #66AE24"></span>
                        <span>
                            Loyer + consommation EDF
                        </span>
                    </div>
                </div>

                <div class="chart-figures">
                    <div class="form-col">
                        <h5>Dépenses EDF</h5>
                        <div class="summary-figure">
                            <label>
                                Coût annuel
                            </label>
                            <div class="figure">
                                <strong>{{ draft.annualCost }}</strong> €
                            </div>
                        </div>
                        <div class="summary-figure">
                            <label>
                                Coût EDF cumulé sur {{ draft.contractDuration }} ans
                            </label>
                            <div class="figure">
                                <strong>{{ draft.cumulativeBills[draft.contractDuration] | format }}</strong> €
                            </div>
                        </div>
                    </div>
                    <div class="form-col">
                        <h5>Dépenses My Sun Sérénité</h5>
                        <div class="summary-figure">
                            <label>
                                Puissance productible théorique
                            </label>
                            <div class="figure">
                                <strong>{{ draft.totalProductiblePower | format }}</strong> kWh/an
                            </div>
                        </div>
                        <div class="summary-figure">
                            <label>
                                Prime à l’autoconsommation
                            </label>
                            <div class="figure">
                                <!-- <strong>{{ cumulatedCosts | format }}</strong> € -->
                                <strong>{{totalPrimeAutoConsumption}}</strong> €
                            </div>
                        </div>
                    </div>
                </div>
            </BaseBox>

            <BaseBox class="economy">
                <!-- <span slot="header">Économies cumulées sur {{ draft.contractDuration }} ans</span> -->
                <span slot="header">Gains cumulés sur {{ draft.contractDuration }} ans (estimation)</span>
                <div class="chart-cropper">
                    <div class="fat-value">
                        <strong>{{ Math.round(gainsTotaux) | format }}</strong> €
                        <!-- <strong>{{ this.chartValuesEconomy[this.chartValuesEconomy.length - 1] | format }}</strong> € -->
                    </div>
                    <BaseLineChart id="chart2" :series="[{ data: chartValuesEconomy }]" :options="chartEconomyOptions"/>
                    <BaseLineChart id="chartExport2" class="hiddeChartSecond" :series="[{ data: chartValuesEconomy }]" :options="chartEconomyOptions"/>
                </div>
            </BaseBox>

            <div class="button-wrapper">
                <BaseButton class="green-button"
                  @click="$router.push({ name: 'new-quotation-contract' })">
                    <IconArrowLeft />
                    Contract
                </BaseButton>
                <BaseButton v-if="isOnline" class="green-button filled-button"
                  @click="handleSendSummaryClick">
                    <BaseSpinner v-if="loading" />
                    <template v-else>
                        Générer le pdf
                        <IconExport />
                    </template>
                </BaseButton>

                <BaseButton v-if="isOffline" class="green-button filled-button"
                  @click="handleSaveSummaryClick">
                    <BaseSpinner v-if="loading" />
                    <template v-else>
                        Enregistrer le devis
                        <!-- <IconExport /> -->
                    </template>
                </BaseButton>
            </div>

            <div v-if="isOffline" class="offline-warning">
                <p>Vous êtes actuellement <b>hors ligne</b>, vous pouvez uniquement <b>enregistrer votre devis</b>.</p>
                <p><b>Connectez-vous à internet</b> pour <b>générer le pdf</b>.</p>
            </div>

        </div>
    </LayoutGeneric>
</template>

<style lang="stylus">
.summary-screen
    .padded-content
        margin-left 90px
        margin-right 90px
        padding-top 32px

        @media only screen and (max-width:750px)
            margin-left 20px 
            margin-right 20px 

        & > *
            margin-bottom 32px

    .form-row
        display flex
        justify-content space-between
        padding-bottom 12px

        @media only screen and (max-width:750px)
            flex-direction column


        & > *
            margin-right 24px
            flex-grow 1

            @media only screen and (max-width:750px)
                margin-right 0
            
            &:first-child
                @media only screen and (max-width:750px)
                    margin-bottom 20px

            &:last-child
                margin-right 0

    .breadcrumb
        padding-top 38px
        
        @media only screen and (max-width:750px)
            display none

        .line
            background #66AE24
            height 4px

        .items
            display flex
            text-align center
            margin-top -12px
            justify-content space-between
            margin-left -9%
            margin-right -9%

        .breadcrumb-item
            width 16.6%
            .circle
                color #66AE24
                display inline-block
            p
                padding-top 9px
                font-size 16px
                line-height 20px
                text-align center
                color #8798AD

            &.active
                .circle
                    background #FAFBFF
                    width 14px
                    height 14px
                    border-radius 50%
                    border 4px solid #66AE24

                p
                    font-weight bold
                    font-size 16px
                    color #66AE24

                .base-icon
                    opacity 0
    
    .gauge-cards
        width 50%
        
        @media only screen and (max-width:750px)
            width 100%

    .gauge-wrapper
        align-self stretch
        width 50%
        text-align center
        display flex
        flex-direction column
        align-items center
        justify-content space-around

        @media only screen and (max-width:750px)
            width 80%

        h5
            font-weight 600
            font-size 18px
            line-height 23px
            color #66AE24

        .gauge-inner
            max-width 225px
            width 100%
            display inline-block
            position relative

            .gauge-center
                position absolute
                left 0
                right 0
                bottom 15px
                display flex
                align-items center
                justify-content center
                color #66AE24
                font-weight 600
                font-size 24px
                text-align center

                strong
                    font-weight 900
                    font-size 40px
                    position relative
                    top -5px
                    margin-left 2px

    .summary-figure
        border 1px solid #E3E8FC
        border-radius 16px
        padding 16px
        padding-bottom 20px

        &.summary-figure-green
            border-color #66AE24

        label
            font-size 16px
            color #8798AD
            margin-bottom 16px
            display block

        .figure
            font-weight 600
            font-size 20px
            color #2E364D

            strong
                font-size 28px

    .notice-box-wrapper
        display flex
        justify-content space-between
        @media only screen and (max-width:750px)
            flex-direction column

        .notice-box
            flex-grow 1
            margin-right 23px
            box-sizing border-box
            
            @media only screen and (max-width:750px)
                margin-right 0
                margin-bottom 20px

            p
                font-size 24px

            strong
                font-size 50px

            &:last-of-type
                margin-right 0

    .impact-cards
        display flex
        justify-content space-between
        flex-wrap wrap

        .card
            width calc(50% - 12px)
            box-sizing border-box
            margin-bottom 24px
            border 1px solid #E3E8FC
            border-radius 16px
            padding 16px
            padding-top 24px
            padding-bottom 20px
            display flex
            flex-direction column
            justify-content space-between

            @media only screen and (max-width:750px)
                width 100%

            .base-illu
                width 150px
                margin auto
                display block
                margin-bottom 24px

            .text
                font-size 16px
                line-height 20px
                color #8798AD
                padding-bottom 9px

            .value
                font-weight 600
                color #66AE24
                font-size 20px

                strong
                    font-size 28px

    #chart1 
        @media only screen and (max-width:750px)
            display none 

    .chart-box
        .legend
            display flex
            flex-direction column
            justify-content center
            padding-bottom 48px
            @media only screen and (max-width:750px)
                display none

        .legend-item
            font-size 16px
            line-height 20px
            display flex
            margin-bottom 16px

            &:last-of-type
                margin-bottom 0

        .circle
            width 12px
            height 12px
            display inline-block
            border-radius 50%
            margin-right 10px
            margin-top 5px

        .chart-figures
            display flex

            @media only screen and (max-width:750px)
                flex-direction column

            & > *
                margin-right 24px
                flex-grow 1

                @media only screen and (max-width:750px)
                    margin-right 0

                &:last-child
                    margin-right 0

            h5
                margin-bottom 16px
                font-weight 600
                font-size 18px
                line-height 23px

            .summary-figure
                margin-bottom 24px

    .base-box.economy
        padding 0
        border 1px solid #66AE24
        border-radius 16px
        color #66AE24

        h3
            padding-left 32px
            padding-top 24px
            margin-bottom -50px

        .fat-value
            font-weight: 900;
            font-size: 30px;
            line-height: 42px;
            padding-left 32px
            position absolute
            top 30%
            left 0

            strong
                font-size 58px
                line-height 82px

        .base-box-content
            overflow hidden

        .chart-cropper
            margin-left -12px
            margin-right -12px
            margin-bottom -40px

    .button-wrapper
        display flex
        align-items center
        justify-content space-between

        @media only screen and (max-width:750px)
            flex-direction column-reverse

            & > * 
                &:first-child
                    display none

        .icon-export
            margin-left 24px

        .icon-arrow-left
            margin-right 24px
    
    .hiddeChartFirst
        position fixed!important
        left 0 
        bottom 0 
        width 1070px 
        height 350px 
        bottom -200vh 
        left -200vw
    
    .hiddeChartSecond
        position fixed!important
        left 0 
        bottom 0 
        width 1142px 
        height 365px 
        bottom -200vh 
        left -200vw
    
    .offline-warning
        border 1px solid rgba(0,0,0,0.4)
        padding 20px 20px
        border-radius 10px
        text-align center
        font-size 13px
        line-height 16px

        b 
            font-weight bold
        
        p
            margin-bottom 10px

            &:last-child
                margin-bottom 0
        
       
</style>