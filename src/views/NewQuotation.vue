<script>
    import LayoutWithLeftSide from '@/layouts/LayoutWithLeftSide'
    import BaseRing from '@/components/BaseRing'

    export default {
        name: 'NewQuotation',

        components: {
            LayoutWithLeftSide,
            BaseRing,

        },

        computed: {
            options() {
                return this.$store.getters.options
            },

            draft() {
                return this.$store.getters.quotationDraftById(
                    this.$route.params.draftId
                ) || {}
            },

            step() {
                return this.draft.step
            },

            routeStep() {
                return this.$route.meta.step
            },
        },
    }
</script>

<template>
    <LayoutWithLeftSide class="new-quotation-screen">
        <div slot="left-side">
            <div class="logo" @click="$router.push('/')">
                <img src="../assets/logo.png">
            </div>
            <div class="ring-wrapper">
                <div class="steps">
                    <div class="step-label">Étape</div>
                    <div class="step-value">{{ routeStep }}/6</div>
                </div>
                <BaseRing :percentage="routeStep/6*100" />
            </div>

            <div class="sections">
                <section v-if="routeStep === 1 && step === 1" class="active">
                    <div class="section-title">
                        INFORMATIONS PERSONNELLES
                    </div>
                </section>
                <section v-else-if="step > 1"
                  class="clickable"
                  :class="{ active: routeStep === 1 }"
                  @click="$router.push({ name: 'new-quotation-client' })">
                    <div class="section-title">
                        Nom
                    </div>
                    <div class="section-content">
                        <strong>
                            {{ draft.firstname }} <br>
                            {{ draft.name }}
                        </strong>
                    </div>
                </section>
                <section v-if="routeStep === 2 && step === 2" class="active">
                    <div class="section-title">
                        capacité
                    </div>
                </section>
                <section v-else-if="step > 2"
                  class="clickable"
                  :class="{ active: routeStep === 2 }"
                  @click="$router.push({ name: 'new-quotation-roofing' })">
                    <div class="section-title">
                        Capacité toiture
                    </div>
                    <div class="section-content">
                        <div>
                            <strong>{{ draft.totalInstallablePower | format }}</strong> kWc <br>
                            <small>Puissance théorique installable</small>
                        </div>
                        <br>
                        <div>
                            <strong>{{ draft.totalProductiblePower | format }}</strong> kWh/kWc <br>
                            <small>Puissance productible théorique</small>
                        </div>
                    </div>
                </section>
                <section v-if="routeStep === 3 && step === 3" class="active">
                    <div class="section-title">
                        CONSOMMATION
                    </div>
                </section>
                <section v-else-if="step > 3"
                  class="clickable"
                  :class="{ active: routeStep === 3 }"
                  @click="$router.push({ name: 'new-quotation-consumption' })">
                    <div class="section-title">
                        Consommation
                    </div>
                    <div class="section-content">
                        <div>
                            <strong>{{ draft.annualConsumption | format }}</strong> kWh/an <br>
                            <small>Consommation annuelle</small>
                        </div>
                        <br>
                        <div>
                            <strong>{{ options.prix_kwh }}</strong> € <br>
                            <small>Coût du kilowattheure</small>
                        </div>
                    </div>
                </section>
                <section v-if="routeStep === 4 && step === 4" class="active">
                    <div class="section-title">
                        Configuration
                    </div>
                </section>
                <section v-else-if="step > 4"
                  class="clickable"
                  :class="{ active: routeStep === 4 }"
                  @click="$router.push({ name: 'new-quotation-configuration' })">
                    <div class="section-title">
                        Configuration
                    </div>
                    <div class="section-content">
                        <div>
                            <strong>{{ draft.installedPower }}</strong> kWc <br>
                            <small>Puissance à installer</small>
                        </div>
                        <br>
                        <div>
                            <strong>{{ draft.autoConsumptionRate }}</strong> % <br>
                            <small>Taux d’autoconsommation</small>
                        </div>
                    </div>
                </section>
                <section v-if="routeStep === 5 && step === 5" class="active">
                    <div class="section-title">
                        Contrat
                    </div>
                </section>
                <section v-else-if="step > 5"
                  class="clickable"
                  :class="{ active: routeStep === 5 }"
                  @click="$router.push({ name: 'new-quotation-contract' })">
                    <div class="section-title">
                        Contrat
                    </div>
                </section>
            </div>
        </div>
        <keep-alive>
            <router-view class="quotation-screen"/>
        </keep-alive>
    </LayoutWithLeftSide>
</template>

<style lang="stylus">
.quotation-screen
    & > *
        margin-bottom 32px

    .screen-header
        display flex
        align-items center
        background #fff
        font-weight bold
        font-size 24px
        line-height 30px
        color #2E364D
        height 80px
        border-bottom 1px solid #F2F4FF
        padding-left 24px
        padding-right 24px

        @media only screen and (max-width:750px)
            font-size 16px
            line-height 20px

        .logo 
            display none 
            @media only screen and (max-width:750px)
                display inline-block 
                margin-right 20px 
                width 50px


    .screen-footer
        background #FAFBFF
        display flex
        position absolute
        bottom 0
        left 0
        right 0
        margin-bottom 0

        .main-content
        .left-side
            padding-top 50px
            padding-bottom 50px

        .left-side
            width 270px
            background #FFF
            border-right 1px solid #F2F4FF
            text-align center

        .main-content
            flex-grow 1
            padding-left 24px
            padding-right 24px
            text-align right

            .base-button
                box-shadow 0px 10px 30px rgba(0, 0, 0, 0.1)

        .icon-arrow-right
            margin-left 24px

        .icon-arrow-left
            margin-right 24px

    .form-row
        display flex
        justify-content space-between
        margin-bottom 16px

        @media only screen and (max-width:750px)
            flex-direction column

        &:last-of-type
            margin-bottom 0

        label
            display inline-block
            margin-right 43px

            @media only screen and (max-width:750px)
                margin-right 0

            &:last-of-type
                margin-right 0

            .label
                color #8798AD
                margin-bottom 10px

</style>