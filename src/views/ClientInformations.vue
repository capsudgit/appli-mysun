<script>
    import _ from 'lodash'

    import BaseInput from '@/components/BaseInput'
    import BaseBox from '@/components/BaseBox'
    import BaseButton from '@/components/BaseButton'
    import IconArrowLeft from '@/components/IconArrowLeft'
    import IconArrowRight from '@/components/IconArrowRight'

    export default {
        name: 'ClientInformations',

        components: {
            BaseInput,
            BaseBox,
            BaseButton,
            IconArrowLeft,
            IconArrowRight,
        },

        data() {
            return {
                foundCities: [],
                city: undefined,
                email: undefined,
                firstname: undefined,
                name: undefined,
                phone: undefined,
                address: undefined,
                zip: undefined,
            }
        },

        computed: {
            draft() {
                return this.$store.getters.quotationDraftById(
                    this.$route.params.draftId
                ) || {}
            },

            cityObject() {
                return JSON.parse(this.city)
            }
        },

        watch: {
            zip: {
                handler:function () {
                    if (this.zip) {
                        this.debounceFindCities(this.zip)
                    }
                },

                immediate: true
            }
        },

        mounted() {
            this.injectDraftInState()
        },

        methods: {
            debounceFindCities: _.debounce(function (zip) {
                window.storageServer.cities.query('zipcode')
                    .only(zip)
                    .execute()
                    .then((results) => {
                        this.foundCities = results
                        this.city = JSON.stringify(this.foundCities[0])
                    });
            }, 500),

            injectDraftInState() {
                if (this.draft && this.draft.step >= 2) {
                    this.email = this.draft.email
                    this.firstname = this.draft.firstname
                    this.name = this.draft.name
                    this.phone = this.draft.phone
                    this.address = this.draft.address
                    this.city = JSON.stringify(this.draft.city)
                    this.zip = this.draft.zip
                }
            },

            saveDraft() {
                const attributes = {
                    draftId: this.$route.params.draftId,
                    email: this.email,
                    firstname: this.firstname,
                    name: this.name,
                    phone: this.phone,
                    address: this.address,
                    city: this.cityObject,
                    zip: this.zip,
                    step: Math.max(2, this.draft.step || 0),
                }

                return this.$store.dispatch('quotationsSaveDraft', {
                    attributes,
                    draftId: this.$route.params.draftId
                })
            },

            handlecityChange($event) {
                this.city = $event.target.value
            },

            handleZipInput(value) {
                this.zip = value
            },

            handleNextClick() {
                if(!this.name || !this.firstname || !this.address || !this.city || !this.zip ){
                    this.$toasted.show(`Attention, vous devez remplir l'ensemble des champs`);
                }else{
                    this.saveDraft().then(() => {
                        this.$router.push({ name: 'new-quotation-roofing' })
                    })
                }
            }
        }
    }
</script>

<template>
    <div class="client-informations-screen">
        <header class="screen-header">
            <img @click="$router.push('/')" class="logo" src="../assets/logo.png">
            Informations Client
        </header>
        <div class="body">
            <BaseBox>
                <span slot="header">Informations personnelles</span>
                <div class="form-row">
                    <label>
                        <div class="label">Nom</div>
                        <BaseInput type="text"
                          :value="name"
                          @input="name = $event.target.value"/>
                    </label>
                    <label>
                        <div class="label">Prénom</div>
                        <BaseInput type="text"
                          :value="firstname"
                          @input="firstname = $event.target.value"/>
                    </label>
                </div>
                <div class="form-row">
                    <label>
                        <div class="label">Adresse email</div>
                        <BaseInput type="text"
                          :value="email"
                          @input="email = $event.target.value"/>
                    </label>
                    <label>
                        <div class="label">N° de téléphone</div>
                        <BaseInput type="text"
                          :value="phone"
                          @input="phone = $event.target.value"/>
                    </label>
                </div>
            </BaseBox>

            <BaseBox>
                <span slot="header">Informations de domicile</span>
                <div class="form-row">
                    <label>
                        <div class="label">Adresse</div>
                        <BaseInput type="text"
                          :value="address"
                          @input="address = $event.target.value"/>
                    </label>
                </div>
                <div class="form-row">
                    <label>
                        <div class="label">Code postal</div>
                        <BaseInput type="text"
                          :value="zip"
                          @input="handleZipInput($event.target.value)"/>
                    </label>
                    <label>
                        <div class="label">Ville</div>
                        <select v-if="foundCities.length"
                          :disabled="foundCities.length <= 1"
                          :value="city"
                          @change="handlecityChange($event)"
                          class="base-select">
                            <option v-for="foundCity in foundCities"
                              :key="foundCity.zipcode + '' + foundCity.city"
                              :value="JSON.stringify(foundCity)">
                                {{ foundCity.city }}
                            </option>
                        </select>
                        <BaseInput v-else type="text"
                          :value="''"
                          disabled/>
                    </label>
                </div>
            </BaseBox>
        </div>
        <footer class="screen-footer">
            <div class="left-side">
                <BaseButton
                  class="green-button"
                  @click="$router.push('/')">
                    <IconArrowLeft />
                    Accueil
                </BaseButton>
            </div>
            <div class="main-content">
                <BaseButton
                  class="green-button filled-button"
                  @click="handleNextClick">
                    Information sur la toiture
                    <IconArrowRight />
                </BaseButton>
            </div>
        </footer>
    </div>
</template>

<style lang="stylus">
.client-informations-screen
    .base-box
        margin-left 24px
        margin-right 24px
        margin-bottom 32px

    .base-box
        label
            display inline-block
            width calc(50% - 12px)

            @media only screen and (max-width:750px)
                width 100%

            .label
                color #8798AD
                margin-bottom 10px

</style>