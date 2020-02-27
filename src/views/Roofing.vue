<script>
    import _ from 'lodash'
    import TransitionGroupExpandAndFadeIn from '@/transitions/TransitionGroupExpandAndFadeIn'
    import BaseButton from '@/components/BaseButton'
    import NoticeBox from '@/components/NoticeBox'
    import RoofSection from '@/components/RoofSection'
    import IconPlus from '@/components/IconPlus'
    import IconArrowLeft from '@/components/IconArrowLeft'
    import IconArrowRight from '@/components/IconArrowRight'

    import tilts from '@/tilts'

    function computeSunshine(orientation, tilt) {
        return tilts[orientation][5 * Math.round(tilt / 5)]
    }

    function computeInstallablePower(area) {
        if (!area) {
            return 0
        }
        if (area < 18) {
            return 0
        }else if(area >= 18 && area <= 38) {
            return 3
        } else if (area > 38 && area < 60) {
            return 6
        } else {
            return 9
        }
    }

    function computeProductiblePower(sunshine, installablePower, solEdge) {
        if (!installablePower) {
            return 0
        }

        return ((sunshine / 100) * installablePower) / installablePower * solEdge
    }

    export default {
        name: 'Roofing',

        components: {
            TransitionGroupExpandAndFadeIn,
            BaseButton,
            NoticeBox,
            RoofSection,
            IconPlus,
            IconArrowLeft,
            IconArrowRight,
        },

        data() {
            return {
                sections: [{
                    id: new Date().valueOf(),
                    area: undefined,
                    tilt: 20,
                    mainOrientation: 'EST',
                    detailedOrientation: -90,
                }]
            }
        },

        computed: {
            draft() {
                return this.$store.getters.quotationDraftById(
                    this.$route.params.draftId
                )
            },

            solEdge() {
                return parseInt(this.draft.city.solEdge)
            },

            augmentedSections() {
                return this.sections.map((section) => {
                    const sunshine = computeSunshine(section.detailedOrientation, section.tilt)
                    const installablePower = computeInstallablePower(section.area)
                    const productiblePower = computeProductiblePower(sunshine, installablePower, this.solEdge)
                    return Object.assign({}, section, {
                        sunshine,
                        installablePower,
                        productiblePower,
                    })
                })
            },

            totalInstallablePower() {
                return _.sumBy(this.augmentedSections, 'installablePower')
            },

            totalProductiblePower() {
                const sunshinePowers = _.map(this.augmentedSections, ({ installablePower, sunshine }) => {
                    return (sunshine / 100) * installablePower
                })
                const result = Math.floor(_.sum(sunshinePowers) / this.totalInstallablePower * this.solEdge);
                return result * (1 - (4/100))
            }
        },

        mounted() {
            this.injectDraftInState()
        },

        methods: {
            injectDraftInState() {
                if (this.draft && this.draft.step >= 3) {
                    this.sections = this.draft.sections
                }
            },

            saveDraft() {
                const attributes = {
                    sections: this.sections,
                    totalInstallablePower: this.totalInstallablePower,
                    totalProductiblePower: this.totalProductiblePower,
                    step: Math.max(3, this.draft.step || 0),
                }

                return this.$store.dispatch('quotationsSaveDraft', {
                    attributes,
                    draftId: this.$route.params.draftId
                })
            },

            handleNextClick() {

                let error = false;
                
                for (let index = 0; index < this.sections.length; index++) {
                    const element = this.sections[index];
                    if(element.area < 18 || element.area === undefined || isNaN(element.area)) error = true;
                }

                if(!error){
                    this.saveDraft().then(() => {
                        this.$router.push({ name: 'new-quotation-consumption' })
                    })
                } else {
                    this.$toasted.show('Attention, 1 ou plusieurs pans ont une surface vide ou insuffisante');
                }
            },

            handleAddSectionClick() {
                this.sections.push({
                    id: new Date().valueOf(),
                    area: undefined,
                    tilt: 20,
                    mainOrientation: 'EST',
                    detailedOrientation: -90,
                })
            },

            handleDuplicateSectionClick(section) {
                this.sections.push({
                    ...section,
                    id: new Date().valueOf(),
                })
            },

            handleRemoveSectionClick({ id }) {
                const index = _.findIndex(this.sections, { id })
                this.sections.splice(index, 1);
            },

            handleSectionAreaInput({ id, value }) {
                const index = _.findIndex(this.sections, { id })
                this.$set(this.sections, index, {
                    ...this.sections[index],
                    area: value ? parseInt(value) : undefined,
                })
            },

            handleSectionTiltChange({ id, value }) {
                const index = _.findIndex(this.sections, { id })
                this.$set(this.sections, index, {
                    ...this.sections[index],
                    tilt: parseInt(value),
                })
            },

            handleSectionMainOrientationChange({ id, value }) {

                const index = _.findIndex(this.sections, { id })
                this.$set(this.sections, index, {
                    ...this.sections[index],
                    mainOrientation: value,
                })
            },

            handleSectionDetailedOrientationChange({ id, value }) {
                const index = _.findIndex(this.sections, { id })
                this.$set(this.sections, index, {
                    ...this.sections[index],
                    detailedOrientation: value
                })
            },

        }
    }
</script>

<template>
    <div class="roofing-screen">
        <header class="screen-header">
            <img @click="$router.push('/')" class="logo" src="../assets/logo.png">
            Capacité de la toiture
        </header>
        <div class="body">
            <div class="btBack">
                <router-link :to="{ name: 'new-quotation-client', params: $route.params }">
                    <IconArrowLeft />
                    Retour
                </router-link>
            </div>
            <TransitionGroupExpandAndFadeIn :appear="false" class="sections">
                <li v-for="(section, i) in augmentedSections" :key="section.id">
                    <RoofSection
                      @removeSectionClick="handleRemoveSectionClick"
                      @duplicateSectionClick="handleDuplicateSectionClick"
                      @areaInput="handleSectionAreaInput"
                      @tiltChange="handleSectionTiltChange"
                      @mainOrientationChange="handleSectionMainOrientationChange"
                      @detailedOrientationChange="handleSectionDetailedOrientationChange"
                      :area="section.area"
                      :tilt="section.tilt"
                      :mainOrientation="section.mainOrientation"
                      :detailedOrientation="section.detailedOrientation"
                      :installablePower="section.installablePower"
                      :id="section.id">
                        <span slot="header">Pan de toit n°{{ i + 1 }}</span>
                    </RoofSection>
                </li>
            </TransitionGroupExpandAndFadeIn>

            <div class="button-wrapper">
                <BaseButton @click="handleAddSectionClick" class="green-button add-section">
                    <IconPlus />
                    Ajouter un pan
                </BaseButton>
            </div>

            <div class="notice-box-wrapper">
                <NoticeBox class="green-box">
                    <span slot="header">Puissance totale installable</span>
                    <p>
                        <strong>{{ totalInstallablePower | format }}</strong> kWc
                    </p>
                </NoticeBox>
                <NoticeBox class="green-box">
                    <span slot="header">Puissance totale productible</span>
                    <p v-if="totalProductiblePower">
                       <strong>{{ totalProductiblePower | format }}</strong> kWh/kWc
                    </p>
                    <p v-else>
                       <strong>0</strong> kWh/kWc
                    </p>
                </NoticeBox>
            </div>
        </div>
        <footer class="screen-footer">
            <div class="left-side">
                <BaseButton
                  class="green-button"
                  @click="$router.push({ name: 'new-quotation-client' })">
                    <IconArrowLeft />
                    Coordonnées
                </BaseButton>
            </div>
            <div class="main-content">
                <BaseButton
                  class="green-button filled-button"
                  @click="handleNextClick">
                    Informations sur la consommation
                    <IconArrowRight />
                </BaseButton>
            </div>
        </footer>
    </div>
</template>

<style lang="stylus">
.roofing-screen
    .notice-box-wrapper
    .base-box
        margin-left 24px
        margin-right 24px
        margin-bottom 32px

    .button-wrapper
        text-align center
        margin-bottom 32px
        .base-button.add-section
            .base-icon
                margin-right 24px

    .notice-box-wrapper
        display flex
        justify-content space-between

        .notice-box
            width calc(50% - 12px)
            box-sizing border-box

</style>