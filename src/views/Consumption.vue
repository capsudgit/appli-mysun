<script>
    import _ from 'lodash'

    import calculateBills from '@/consumption.js'
    import exportSvg from '@/exportSvg.js'

    import BaseInput from '@/components/BaseInput'
    import BaseBox from '@/components/BaseBox'
    import BaseLineChart from '@/components/BaseLineChart'
    import BaseButton from '@/components/BaseButton'
    import IconArrowLeft from '@/components/IconArrowLeft'
    import IconArrowRight from '@/components/IconArrowRight'
    import NoticeBox from '@/components/NoticeBox'

    const now = parseInt(new Date().getFullYear())

    export default {
        name: 'Consumption',

        components: {
            BaseInput,
            BaseBox,
            BaseButton,
            IconArrowLeft,
            IconArrowRight,
            BaseLineChart,
            NoticeBox,
        },

        data() {
            const chartXs = [2020, 2025, 2030, 2035, 2040, 2045, 2050]
            return {
                annualConsumption: undefined,
                annualCost: undefined,
                firstIncrease: 0.04,
                secondIncrease: 0.12,
                chartXs: chartXs,
                chartOptions: {
                    colors:['#FFA742'],
                    markers: {
                        strokeColors: ['#FFA742'],
                    },
                    xaxis: {
                        categories: chartXs,
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

            bills() {
                return calculateBills(now, 2050, this.annualCost, this.firstIncrease, this.secondIncrease)
            },

            chartValues() {
                return this.chartXs.map((x) => {
                    const periodBills = this.bills.slice(0, x - now)
                    return Math.round(_.sum(periodBills))
                })
            },

            options() {
                return this.$store.getters.options
            },

            kwh() {
                return parseFloat(this.options.prix_kwh)
            },
        },

        mounted() {
            this.injectDraftInState()
        },

        methods: {
            injectDraftInState() {
                if (this.draft && this.draft.step >= 4) {
                    this.annualConsumption = this.draft.annualConsumption
                    this.annualCost = this.draft.annualCost
                    this.firstIncrease = this.draft.firstIncrease
                    this.secondIncrease = this.draft.secondIncrease
                }
            },

            saveDraft() {
                let svg = exportSvg(document.getElementById("exportChart"));

                const attributes = {
                    annualConsumption: this.annualConsumption,
                    annualCost: this.annualCost,
                    firstIncrease: this.firstIncrease,
                    secondIncrease: this.secondIncrease,
                    cumulativeBills: {
                        20: Math.round(_.sum(this.bills.slice(0, 20))),
                        30: Math.round(_.sum(this.bills.slice(0, 30))),
                    },
                    chartConsumption: svg,
                    step: Math.max(4, this.draft.step || 0),
                }

                return this.$store.dispatch('quotationsSaveDraft', {
                    attributes,
                    draftId: this.$route.params.draftId
                })
            },

            handleAnnualConsumptionInput($event) {
                this.annualConsumption = $event.target.value
                this.annualCost = Math.round(this.annualConsumption * this.kwh)
            },

            handleAnnualCostInput($event) {
                this.annualCost = $event.target.value
                this.annualConsumption = Math.round(this.annualCost/this.kwh)
            },

            handleNextClick() {

                if(!this.annualConsumption || !this.annualCost ) {
                    this.$toasted.show('Attention, vous devez remplir les informations relatives  à la facture d\'électricité');
                }else {
                    this.saveDraft().then(() => {
                        this.$router.push({ name: 'new-quotation-configuration' })
                    })
                }
            },
        }
    }
</script>

<template>
    <div class="consumption-screen">
        <header class="screen-header">
            <img @click="$router.push('/')" class="logo" src="../assets/logo.png">
            Informations sur la consommation
        </header>
        <div class="body">
            <div class="btBack">
                <router-link :to="{ name: 'new-quotation-roofing', params: $route.params }">
                    <IconArrowLeft />
                    Retour
                </router-link>
            </div>
            <BaseBox>
                <span slot="header">Facture d’électricité</span>
                <div class="form-row">
                    <label>
                        <div class="label">Consommation annuelle</div>
                        <div class="input-with-suffix">
                            <BaseInput
                              :value="annualConsumption"
                              @input="handleAnnualConsumptionInput($event)"
                              maxlength="8"
                              style="width:80px;"
                              type="text"/>
                            <span>kWh/an</span>
                        </div>
                    </label>
                    <label>
                        <div class="label">Coût annuel</div>
                        <div class="input-with-suffix">
                            <BaseInput
                              :value="annualCost"
                              @input="handleAnnualCostInput($event)"
                              maxlength="12"
                              style="width:80px;"
                              type="text"/>
                            <span>€/an</span>
                        </div>
                    </label>
                </div>
                <p class="base-box-recap">
                    Coût du kilowattheure : <strong>{{ kwh }}</strong> €
                </p>
            </BaseBox>
        </div>

        <div class="notice-box-wrapper">
            <NoticeBox>
                <span slot="header">Augmentation en % du prix de 1 à 5 ans</span>
                <select v-model="firstIncrease"
                  class="base-select"
                  style="width: 80px;">
                    <option v-for="i in 10" :value="i / 100" :key="i">{{ i }}</option>
                </select>
            </NoticeBox>
            <NoticeBox>
                <span slot="header">Augmentation en % du prix de 6 à 20 ans</span>
                <select v-model="secondIncrease"
                  class="base-select"
                  style="width: 80px;">
                    <option v-for="i in 20" :value="i / 100" :key="i">{{ i }}</option>
                </select>
            </NoticeBox>
        </div>

        <BaseBox class="theChart" id="chart">
            <span slot="header">Facture cumulée</span>
            <BaseLineChart :series="[ { data: chartValues } ]" :options="chartOptions"/>
        </BaseBox>
        <BaseLineChart id="exportChart" class="hiddinChart" :series="[ { data: chartValues } ]" :options="chartOptions"/>

        <footer class="screen-footer">
            <div class="left-side">
                <BaseButton
                  class="green-button"
                  @click="$router.push({ name: 'new-quotation-roofing' })">
                    <IconArrowLeft />
                    Capacité toiture
                </BaseButton>
            </div>
            <div class="main-content">
                <BaseButton
                  class="green-button filled-button"
                  @click="handleNextClick">
                    Choix de la configuration
                    <IconArrowRight />
                </BaseButton>
            </div>
        </footer>
    </div>
</template>

<style lang="stylus">
.consumption-screen
    .notice-box-wrapper
    .base-box
        margin-left 24px
        margin-right 24px
        margin-bottom 32px
    
    .theChart
        @media only screen and (max-width:750px)
            display none

    .base-box-recap
        font-weight 600
        font-size 18px
        line-height 23px
        display flex
        align-items center
        margin-top 32px
        
        @media only screen and (max-width:750px)
            font-size 16px

        strong
            font-size 24px
            font-weight 700
            margin-left 20px
            margin-right 3px
            
            @media only screen and (max-width:750px)
                font-size 20px

    .input-with-suffix
        span
            font-weight 600
            font-size 18px
            line-height 23px

    .notice-box-wrapper
        display flex
        justify-content space-between
        
        @media only screen and (max-width:750px)
            flex-direction column

        .notice-box
            width calc(50% - 12px)
            box-sizing border-box
            
            @media only screen and (max-width:750px)
                width 100%
                margin-bottom 20px
    
    .hiddinChart
        position fixed
        bottom -200vh 
        left -200vw
        width 931px 
        height 365px
        z-index 99999
    
</style>