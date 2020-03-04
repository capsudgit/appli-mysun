<script>
    import VueApexCharts from 'vue-apexcharts'
    import exportSvg from '@/exportSvg.js'

    import BaseSwitch from '@/components/BaseSwitch'
    import BaseBox from '@/components/BaseBox'
    import NoticeBox from '@/components/NoticeBox'
    import SelectableBox from '@/components/SelectableBox'
    import BaseRange from '@/components/BaseRange'
    import FancyNumberB from '@/components/FancyNumberB'
    import BaseButton from '@/components/BaseButton'
    import IconArrowLeft from '@/components/IconArrowLeft'
    import IconArrowRight from '@/components/IconArrowRight'
    import IconStrike1 from '@/components/IconStrike1'
    import IconStrike2 from '@/components/IconStrike2'
    import IconStrike3 from '@/components/IconStrike3'
    import IconArrowLeftCompact from '@/components/IconArrowLeftCompact'
    import IconArrowRightCompact from '@/components/IconArrowRightCompact'

    export default {
        name: 'Configuration',

        components: {
            BaseSwitch,
            BaseBox,
            NoticeBox,
            SelectableBox,
            BaseButton,
            IconArrowLeft,
            IconArrowRight,
            IconStrike1,
            IconStrike2,
            IconStrike3,
            IconArrowLeftCompact,
            IconArrowRightCompact,
            BaseRange,
            FancyNumberB,
            apexchart: VueApexCharts,
        },

        data() {
            return {
                installedPower: 9,
                hasBattery: false,
                autoConsumptionRate: 40,
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
                    colors: ['#F7C137', '#66AE24'],
                    donut: {
                        size: '65%',
                    }
                }
            }
        },

        watch: {
            hasBattery() {
                if (!this.hasBattery) {
                    this.autoConsumptionRate = Math.min(this.autoConsumptionRate, 60)
                }
            }
        },

        computed: {
            draft() {
                return this.$store.getters.quotationDraftById(
                    this.$route.params.draftId
                )
            },

            autoConsumption() {
                return this.draft.totalProductiblePower * this.installedPower * (parseFloat(this.autoConsumptionRate)/100)
            },

            soldProduction() {
                return this.draft.totalProductiblePower * this.installedPower - this.autoConsumption
            },

            soldSurplus() {
                return this.soldProduction * parseFloat(this.surplusPrice)
            },

            options() {
                return this.$store.getters.options
            },

            surplusPrice() {
                return this.options.surplus_price
            },

            autoConsumptionSellingPrice() {
                return this.options['moyenne-autocomsommee-revendue']
            },

        },

        mounted() {
            this.injectDraftInState()
        },

        methods: {
            injectDraftInState() {
                if (this.draft && this.draft.step >= 5) {
                    this.installedPower = this.draft.installedPower
                    this.hasBattery = this.draft.hasBattery
                    this.autoConsumptionRate = this.draft.autoConsumptionRate
                }
            },

            saveDraft() {
                let svg = exportSvg(document.getElementById("chartExport"));

                const attributes = {
                    installedPower: this.installedPower,
                    hasBattery: this.hasBattery,
                    autoConsumptionRate: this.autoConsumptionRate,
                    autoConsumption: this.autoConsumption,
                    soldProduction: this.soldProduction,
                    soldSurplus: this.soldSurplus,
                    chartSurplus: svg,
                    step: Math.max(5, this.draft.step || 0),
                }

                return this.$store.dispatch('quotationsSaveDraft', {
                    attributes,
                    draftId: this.$route.params.draftId
                })
            },

            getScaleG(rate) {
                const pc = rate / 100
                return 0.6 + (0.5 * pc)
            },

            getScaleR(rate) {
                return (this.getScaleG(0) * 2) - this.getScaleG(rate)
            },

            handleAutoConsumptionChange({ value }) {
                this.autoConsumptionRate = value
            },

            handleNextClick() {
                this.saveDraft().then(() => {
                    this.$router.push({ name: 'new-quotation-contract' })
                })
            },
        }
    }
</script>

<template>
    <div class="configuration-screen">
        <header class="screen-header">
            <img @click="$router.push('/')" class="logo" src="../assets/logo.png">
            Choix de la configuration My Sun
        </header>
        <div class="body">
            <div class="btBack">
                <router-link :to="{ name: 'new-quotation-consumption', params: $route.params }">
                    <IconArrowLeft />
                    Retour
                </router-link>
            </div>
            <BaseBox>
                <span slot="header">Puissance à installer</span>
                <div class="selectable-box-wrapper">
                    <SelectableBox @click.native="installedPower = 3" :active="installedPower === 3">
                        <div class="disk">
                            <IconStrike1 />
                        </div>

                        <div class="value">
                            <strong>3</strong> kWc
                        </div>
                        <div class="max-value">
                            Production max <br>
                            <strong>{{ draft.totalProductiblePower * 3 | format }}  kWh</strong>
                        </div>
                    </SelectableBox>
                    <SelectableBox @click.native="installedPower = 6" :active="installedPower === 6">
                        <div class="disk">
                            <IconStrike2 />
                        </div>
                        <div class="value">
                            <strong>6</strong> kWc
                        </div>
                        <div class="max-value">
                            Production max <br>
                            <strong>{{ draft.totalProductiblePower * 6 | format }}  kWh</strong>
                        </div>
                    </SelectableBox>
                    <SelectableBox @click.native="installedPower = 9" :active="installedPower === 9">
                        <div class="disk">
                            <IconStrike3 />
                        </div>
                        <div class="value">
                            <strong>9</strong> kWc
                        </div>
                        <div class="max-value">
                            Production max <br>
                            <strong>{{ draft.totalProductiblePower * 9 | format }}  kWh</strong>
                        </div>
                    </SelectableBox>
                </div>
                <div class="stockage-wrapper">
                    <h5>
                        Optimisateur
                    </h5>
                    <label @click="hasBattery = !hasBattery">
                        <BaseSwitch :active="hasBattery" />
                        <span>
                            Ajouter un optimisateur
                        </span>
                    </label>
                </div>
            </BaseBox>
            <BaseBox>
                <span slot="header">Taux d’autoconsommation</span>
                <div class="bubbles">
                    <div class="bubble-wrapper">
                        <div class="bubble green"
                          :style="{ transform: 'scale(' + getScaleG(autoConsumptionRate) + ')' }">
                        </div>
                    </div>
                    <div class="bubble-wrapper">
                        <div class="bubble red"
                          :style="{ transform: 'scale(' + getScaleR(autoConsumptionRate) + ')' }">

                            <div class="edf-bill">
                                <div class="value">
                                    <strong>
                                        {{  draft.annualCost - (draft.annualCost * autoConsumptionRate / 100) | format}}
                                    </strong>€
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <BaseRange
                  :min="10"
                  :max="hasBattery ? 100 : 100"
                  :value="autoConsumptionRate"
                  @change="handleAutoConsumptionChange">
                    <div class="visual-handle" slot="handle">
                        <div class="value">
                            <FancyNumberB v-if="Math.trunc(autoConsumptionRate / 100)" :value="Math.trunc(autoConsumptionRate / 100)" />
                            <FancyNumberB :value="Math.trunc(autoConsumptionRate / 10)" />
                            <FancyNumberB :value="1 * Math.trunc(Math.trunc(autoConsumptionRate % 10) / 1)" :step="1" />
                            <sup style="margin-top: -3px;">%</sup>
                        </div>
                        <div class="helper">
                            <IconArrowLeftCompact />
                            <IconArrowRightCompact />
                        </div>
                    </div>
                </BaseRange>
            </BaseBox>
            <div class="notice-box-wrapper">
                <NoticeBox class="green-box">
                    <span slot="header">Tarif rachat du surplus</span>
                    <p>
                        <strong>{{ surplusPrice }}</strong> €/kWh
                    </p>
                </NoticeBox>
                <NoticeBox class="green-box">
                    <span slot="header">Moyenne kWh auto-consommée et revendue</span>
                    <p>
                       <strong>{{ autoConsumptionSellingPrice }}</strong> €/kWh
                    </p>
                </NoticeBox>
            </div>
            <BaseBox class="donut-box-wrapper">
                <div class="donut-and-legend">
                    <div class="donut-wrapper">
                        <div id="chart">
                        <div class="donut-center">
                            <strong>{{ Math.round(soldSurplus) | format }}<sup>€</sup></strong>
                            <p>Revente surplus par an</p>
                        </div>
                            <apexchart ref="testChart" type="donut" height="260" :options="chartOptions" :series="[autoConsumption, soldProduction]" />
                            <apexchart id="chartExport" class="hiddinChart" ref="testChart" type="donut" height="260" :options="chartOptions" :series="[autoConsumption, soldProduction]" />
                        </div>
                    </div>
                    <div class="legend">
                        <div class="legend-item">
                            <span class="circle" style="background: #F7C137"></span>
                            <span>
                                Production autoconsommée : <br>
                                <strong>{{ autoConsumption | format }} kWh</strong>
                            </span>
                        </div>
                        <div class="legend-item">
                            <span class="circle" style="background: #66AE24"></span>
                            <span>
                                Production revendue : <br>

                                <strong>{{ soldProduction | format }} kWh</strong>
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
                  @click="$router.push({ name: 'new-quotation-consumption' })">
                    <IconArrowLeft />
                    Consommation
                </BaseButton>
            </div>
            <div class="main-content">
                <BaseButton
                  class="green-button filled-button"
                  @click="handleNextClick">
                    Détails du contrat
                    <IconArrowRight />
                </BaseButton>
            </div>
        </footer>
    </div>
</template>

<style lang="stylus">
.configuration-screen
    .base-box
    .notice-box-wrapper
        margin-bottom 32px
        margin-left 24px
        margin-right 24px

    .selectable-box-wrapper
        display flex
        margin-bottom 32px
        @media only screen and (max-width:750px)
            flex-direction column

    .selectable-box
        margin-right 12px
        flex-grow 1
        flex-shrink 0
        max-width 33%
        box-sizing border-box
        
        @media only screen and (max-width:750px)
            max-width 100%
            margin-right 0
            margin-bottom 20px

        .disk
            display inline-flex
            align-items center
            justify-content center
            width 49px
            height 49px
            border-radius 50%
            background #E8F3DE
            color #66AE24
            margin-bottom 17px

        .value
            font-size 14px
            line-height 18px
            margin-bottom 10px

            strong
                font-weight 600
                font-size 26px
                line-height 33px

        .max-value
            font-size 14px
            line-height 24px
            color #8798AD

            strong
                font-weight bold
                font-size 14px
                line-height 20px

        &:last-of-type
            margin-right 0

    .stockage-wrapper
        h5
            font-weight 600
            font-size 18px
            line-height 23px
            margin-bottom 16px

        label
            display flex
            align-items center

            .base-switch
                margin-right 24px

    .base-range
        margin-top 55px
        margin-bottom 50px
        margin-left 24px
        margin-right 24px

        .before
            margin-left -24px

        .after
            margin-right -24px

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

            &:last-of-type
                margin-right 0

    .bubbles
        padding-top 24px
        padding-bottom 32px
        display flex
        justify-content space-between

        .bubble-wrapper
            width calc(50% - 20px)

        .bubble
            transform scale(0.8)
            width 100%
            padding-bottom 100%
            background silver
            position relative
            border-radius 50%

            &.green
                background-color #EEFAD3
                background-image url("../assets/sun.png")
                background-size 80% 80%
                background-repeat no-repeat
                background-position 50% 50%

            &.red
                background #FDD9C7

            .edf-bill
                background-color #FAF4F1
                background-image url("../assets/edf-bill.png")
                background-size cover
                background-repeat no-repeat
                background-position 50% 50%
                box-sizing border-box
                padding-bottom 15px
                width 105px
                height 135px
                position absolute
                left 50%
                top 50%
                transform translate(-50%, -50%)
                text-align center
                display flex
                flex-direction column-reverse
                font-weight bold
                font-size 15px
                color #BA0D0D

                strong
                    font-weight 900
                    font-size 19px

    .donut-box-wrapper
        margin-left 16px
        margin-right 16px

    .donut-and-legend
        display flex
        justify-content space-between
        
        @media only screen and (max-width:750px)
            flex-direction column
            align-items center

        .donut-wrapper
            width 240px
            height 240px
            position relative

        #chart
            margin-top 24px

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

            strong
                font-weight bold
                font-size 28px
                text-align center

                sup
                    font-weight bold
                    font-size 15px
                    line-height 60px
                    vertical-align super
                    position relative
                    top -5px
                    margin-left 3px
            p
                font-size 11.5px
                line-height 15px
                text-align center
                text-transform uppercase
                color #B0B4AF
                max-width 80%

        .legend
            display flex
            flex-direction column
            justify-content center

        .legend-item
            font-size 16px
            line-height 20px
            display flex
            margin-bottom 24px

            &:last-of-type
                margin-bottom 0

        strong
            font-weight bold
            font-size 16px
            line-height 20px

        .circle
            width 12px
            height 12px
            display inline-block
            border-radius 50%
            margin-right 10px
            margin-top 5px
            flex-shrink 0
    

    .hiddinChart
        position fixed
        bottom -200vh 
        left -200vw
        width 240px 
        height 240px
        z-index 99999
</style>