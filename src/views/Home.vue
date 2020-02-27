<script>
    import _ from 'lodash'
    import FileSaver from 'file-saver'
    import PopperMenu from '@/components/PopperMenu'
    import LayoutGeneric from '@/layouts/LayoutGeneric'
    import BaseBox from '@/components/BaseBox'
    import BaseButton from '@/components/BaseButton'
    import BaseInput from '@/components/BaseInput'
    import BaseSpinner from '@/components/BaseSpinner'
    import IconLoupe from '@/components/IconLoupe'
    import IconExport from '@/components/IconExport'
    import IconTrash from '@/components/IconTrash'
    import IconWarning from '@/components/IconWarning'
    import IconPlus from '@/components/IconPlus'
    import IconDots from '@/components/IconDots'

    const stepToRoute = {
        1: 'new-quotation-client',
        2: 'new-quotation-roofing',
        3: 'new-quotation-consumption',
        4: 'new-quotation-configuration',
        5: 'new-quotation-contract',
    }

    export default {
        name: 'Home',

        components: {
            PopperMenu,
            LayoutGeneric,
            BaseBox,
            BaseButton,
            BaseInput,
            BaseSpinner,
            IconLoupe,
            IconExport,
            IconTrash,
            IconWarning,
            IconPlus,
            IconDots,
        },

        data() {
            return {
                popperOpen: false,
                quotationsLoading: false,
                quotationsDeleting: false,
                page: 1,
                search: '',
                awaitingSearch: false,
                showPopUp: false,
                selectedPop: null,
            }
        },

        computed: {
            allDrafts() {
                return this.$store.getters.allDrafts
            },

            me() {
                return this.$store.getters.me
            },

            notSentDrafts() {
                return _.filter(this.allDrafts, (draft) => {
                    return draft.step === 6
                })
            },

            incompleteDrafts() {
                return _.filter(this.allDrafts, (draft) => {
                    return draft.step < 6
                })
            },

            filterKey() {
                return JSON.stringify(this.filters)
            },

            filters() {
                return {
                    // dbd_recipe_category: [],
                    search: String(this.search),
                    per_page: 6,
                    page: this.page,
                    'filter[author]': this.me.id,
                    'filter[orderby]': 'date',
                    order: 'desc',
                }
            },

            quotations() {
                return this.$store.getters.quotationItemsByKey(this.filterKey)
            },

            pagination() {
                return this.$store.getters.quotationPaginationByKey(this.filterKey)
            },

            nextPage() {
                const { totalPages, currentPage } = this.pagination
                if (totalPages === undefined || currentPage === undefined) {
                    return 1
                }
                return Math.min(totalPages, currentPage + 1)
            },

            hasMore() {
                const { totalPages, currentPage } = this.pagination
                if (totalPages === undefined || currentPage === undefined) {
                    return true
                }
                return currentPage < totalPages
            }
        },

        watch: {
            search(val) {
                if (!this.awaitingSearch) {
                    setTimeout(() => {
                        this.quotationsLoading = true
                        this.fetchQuotations().finally(() => {
                            this.quotationsLoading = false;
                            this.awaitingSearch = false;
                        })
                    }, 1000); // 1 sec delay
                }
                this.awaitingSearch = true;
            }
        },

        mounted() {
            this.quotationsLoading = true
            this.fetchQuotations().finally(() => {
                this.quotationsLoading = false
            });
        },

        methods: {
            fetchQuotations() {
                return this.$store.dispatch('quotationsGet', {
                    params: {
                        ...this.filters
                    },
                    key: this.filterKey
                })
            },

            handleCreateQuotationClick() {
                this.$router.push({
                    name: 'new-quotation-client',
                    params: {
                        draftId: new Date().valueOf()
                    }
                })
            },

            handRefresh() {
                this.quotationsLoading = true
                this.fetchQuotations().finally(() => {
                    this.quotationsLoading = false
                })
            },

            handlePageClick(page) {
                this.page = page
                this.quotationsLoading = true
                this.fetchQuotations().finally(() => {
                    this.quotationsLoading = false
                })
            },

            handlePrevClick() {
                this.page = this.page - 1
                this.quotationsLoading = true
                this.fetchQuotations().finally(() => {
                    this.quotationsLoading = false
                })
            },

            handleNextClick() {
                this.page = this.page + 1
                this.quotationsLoading = true
                this.fetchQuotations().finally(() => {
                    this.quotationsLoading = false
                })
            },

            handleNotSentClick(draft) {
                this.$router.push({
                    name: 'new-quotation-summary',
                    params: {
                        draftId: draft.draftId
                    }
                })
            },

            handleIncompleteClick(draft) {
                this.$router.push({
                    name: stepToRoute[draft.step],
                    params: {
                        draftId: draft.draftId
                    }
                })
            },

            downloadPdf(url, name) {
                var oReq = new XMLHttpRequest();
                // The Endpoint of your server 
                var URLToPDF = url;

                // Configure XMLHttpRequest
                oReq.open("GET", URLToPDF, true);

                // Important to use the blob response type
                oReq.responseType = "blob";

                // When the file request finishes
                // Is up to you, the configuration for error events etc.
                oReq.onload = function() {
                    // Once the file is downloaded, open a new window with the PDF
                    // Remember to allow the POP-UPS in your browser
                    var file = new Blob([oReq.response], { 
                        type: 'application/pdf' 
                    });
                    
                    // Generate file download directly in the browser !
                    saveAs(file, name);
                };

                oReq.send();
            },

            removeQuote(id) {
                this.quotationsDeleting = true;
                this.showPopUp = false;
                this.selectedPop = null;
                return this.$store.dispatch('quotationDelete', {id: id}).then(() => {
                    console.log("post delete");
                    this.quotationsLoading = true
                    this.fetchQuotations().finally(() => {
                        this.quotationsLoading = false;
                        this.quotationsDeleting = false;
                    });
                });
            },
        }
    }
</script>
<template>
    <LayoutGeneric class="home-screen">

        <div v-if="showPopUp" class="popUp">
            <div class="popUp-bg" @click="showPopUp = false" />
            <div class="popUp-ctt">
                <a class="popUp-ctt-close" @click="showPopUp = false">
                    <img src="/img/icon-close.svg" />
                </a>
                <h1 class="popUp-ctt-title">Infos devis</h1>
                <div class="popUp-ctt-date">{{ quotations[selectedPop].date.split('T')[0] }}</div>
                <div class="popUp-ctt-name">{{quotations[selectedPop].title.rendered}}</div>
                <div class="popUp-ctt-mail">
                    <a :href="'mailto:'+quotations[selectedPop].acf.personnal_informations.email">{{quotations[selectedPop].acf.personnal_informations.email}}</a>
                </div>
                <div class="popUp-ctt-phone">{{quotations[selectedPop].acf.personnal_informations.phone}}</div>
                <div class="popUp-ctt-address">{{quotations[selectedPop].acf.personnal_address.address}}, {{quotations[selectedPop].acf.personnal_address.city}}</div>
                <a class="popUp-ctt-remove" @click="removeQuote(quotations[selectedPop].id)">Supprimer le devis</a>
                <!-- <a class="popUp-ctt-remove" @click="$store.dispatch('quotationDelete', { id: quotations[selectedPop].id })">Supprimer le devis</a> -->

                <div class="popUp-ctt-btParent">
                    <!-- <a v-if="quotations[selectedPop].acf.pdf_url" class="popUp-ctt-bt" :href="quotations[selectedPop].acf.pdf_url" target="_blank" type="application/octet-stream" :download="'Devis - '+quotations[selectedPop].title.rendered">
                        Télécharger le pdf
                    </a> -->
                    <div v-if="quotations[selectedPop].acf.pdf_url">
                        <a class="popUp-ctt-bt" @click="downloadPdf(quotations[selectedPop].acf.pdf_url, 'Estimation - '+quotations[selectedPop].title.rendered)">
                            Télécharger le pdf
                        </a>
                        <div class="popUp-ctt-url">
                            Lien du pdf : <a :href="quotations[selectedPop].acf.pdf_url" target="_blank">{{quotations[selectedPop].acf.pdf_url}}</a>
                        </div>
                    </div>
                    <div v-else>
                        <div class="popUp-ctt-btParent-alert">La génération du devis est en cours</div>
                        <BaseButton class="green-button filled-button" :disabled="quotationsLoading" @click="handRefresh">
                            <BaseSpinner v-if="quotationsLoading" />
                            <span v-else>Raffraichir</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <div class="padded-content">
            <div class="button-wrapper">
                <BaseButton class="green-button filled-button new-quotation"
                  @click="handleCreateQuotationClick">
                    <IconPlus />
                    Créer un nouveau devis
                </BaseButton>
            </div>

            <div v-if="isOnline" class="search-wrapper">
                <BaseInput :value="search" @input="search = $event.target.value" placeholder="Rechercher un devis par nom du client">
                    <IconLoupe slot="before"/>
                </BaseInput>
            </div>
            <BaseBox class="awaiting-quotations" v-if="notSentDrafts && notSentDrafts.length">
                <span slot="header">Mes devis enregistrés</span>
                <span class="awaiting-quotations-subheader">(en attente de la génération du pdf)</span>
                <div class="quotation-list">
                    <BaseBox v-for="draft in notSentDrafts"
                      :key="draft.draftId"
                      @click.native="handleNotSentClick(draft)"
                      class="base-box-compact awaiting-quotation">
                        <span slot="header">{{ draft.firstname + ' ' + draft.name }}</span>

                        <div slot="top-right">
                            <PopperMenu @click.native.stop>
                                <ul>
                                    <!-- <li>
                                        <IconExport /><span>Exporter en PDF</span>
                                    </li> -->
                                    <!-- <li>
                                        <IconTrash /><span>Archiver le devis</span>
                                    </li> -->
                                    <li @click="$store.dispatch('quotationsDeleteDraft', { draftId: draft.draftId })">
                                        <IconTrash /><span>Supprimer le devis</span>
                                    </li>
                                </ul>
                            </PopperMenu>
                        </div>

                        <p>
                            {{ draft.address }}
                            <br>
                            {{ draft.city.zipcode }} {{ draft.city.city }}
                        </p>
                    </BaseBox>
                </div>
                <p v-if="isOffline" class="recap" >
                    <IconWarning /> Vous devez être connecté à internet pour générer les pdf
                </p>
                <p v-if="isOnline" class="recap" >
                    <!-- <IconWarning /> -->
                    Cliquez sur les devis pour générer les pdf. 
                </p>
                <!-- <p class="recap" v-if="notSentDrafts.length === 1">
                    <IconWarning /> Vous avez 1 devis terminé qui n’a pas été envoyé au client
                </p>
                <p class="recap" v-else>
                    <IconWarning /> Vous avez {{ notSentDrafts.length }} devis terminés qui n’ont pas été envoyés aux clients
                </p> -->
                <!-- <BaseButton class="orange-button filled-button"
                  @click="$router.push({ name: 'new-quotation-client' })">
                    Envoyer les récapitulatifs
                    <IconExport />
                </BaseButton> -->
            </BaseBox>
            <BaseBox v-if="incompleteDrafts && incompleteDrafts.length">
                <span slot="header">Mes devis en cours</span>
                <div class="quotation-list">
                    <BaseBox v-for="draft in incompleteDrafts"
                      :key="draft.draftId"
                      @click.native="handleIncompleteClick(draft)"
                      class="base-box-compact">
                        <span slot="header">{{ draft.firstname + ' ' + draft.name }}</span>

                        <div slot="top-right">
                            <PopperMenu @click.native.stop>
                                <ul>
                                    <!-- <li>
                                        <IconExport /><span>Exporter en PDF</span>
                                    </li> -->
                                    <!-- <li>
                                        <IconTrash /><span>Archiver le devis</span>
                                    </li>
                                    -->
                                    <li @click="$store.dispatch('quotationsDeleteDraft', { draftId: draft.draftId })">
                                        <IconTrash /><span>Supprimer le devis</span>
                                    </li> 
                                </ul>
                            </PopperMenu>
                        </div>

                        <p>
                            {{ draft.address }}
                            <br>
                            {{ draft.city.zipcode }} {{ draft.city.city }}
                        </p>
                    </BaseBox>
                </div>
            </BaseBox>
            <BaseBox v-if="isOnline" class="quotations-history">
                <span slot="header">Mon historique de devis</span>
                <div class="spinner-wrapper" v-if="quotationsLoading && !quotations">
                    <BaseSpinner />
                </div>

                <div class="spinner-wrapper" v-if="quotationsDeleting">
                    <BaseSpinner />
                </div>

                <div v-else>
                    <ul class="quotation-list-compact">
                        <li class="history-item" v-for="(quotation, index) in quotations" :key="quotation.id" @click="selectedPop = index; showPopUp = true">
                            <div class="date">
                                {{ quotation.date.split('T')[0] }}
                            </div>
                            <div class="name">
                                {{ quotation.title.rendered }}
                            </div>
                            <div class="city">
                                {{ quotation.acf.personnal_address.city }}
                            </div>
                            <div class="popper-trigger" @click="selectedPop = quotation; showPopUp = true">
                                <IconDots />
                            </div>
                            <!-- <PopperMenu @click.native.stop>
                                <ul>
                                    <li>
                                        <IconExport /><span>Exporter en PDF</span>
                                    </li>
                                </ul>
                            </PopperMenu> -->
                        </li>
                    </ul>
                    <ul class="pagination">
                        <li class="prev" :class="{ disabled: page === 1 }" @click="handlePrevClick"> < </li>
                        <li class="page" :class="{ active: i === page }"
                          v-for="i in pagination.totalPages"
                          :key="i"
                          @click="handlePageClick(i)">
                            {{ i }}
                        </li>
                        <li class="next" :class="{  disabled: page === pagination.totalPages }" @click="handleNextClick"> > </li>
                    </ul>
                </div>
            </BaseBox>
            <BaseBox v-if="isOffline">
                <span slot="header">Vous êtes actuellement hors ligne !</span>
                <div>Dans ce mode, seul la fonctionnalité de <strong>création de nouveaux devis</strong> est disponible. <br> Pour consulter / télécharger vos anciens devis, vous devez être connecté à internet !</div>
            </BaseBox>
        </div>
    </LayoutGeneric>
</template>
<style lang="stylus">
.home-screen

    .popUp
        position fixed
        left 0
        top 0 
        width 100%
        height 100vh
        z-index 99999

        &-bg 
            display block
            position absolute
            left 0
            top 0
            width 100%
            height 100% 
            cursor pointer 
            background-color rgba(0,0,0,0.4)
            z-index 1

        &-ctt 
            background-color #FFF 
            padding 50px 30px
            border-radius 5px 
            box-shadow 0 20px 20px 0px rgba(0,0,0,0.1)
            position absolute
            left 50% 
            top 50% 
            transform translate(-50%,-50%)
            z-index 10
            width 50vw

            @media only screen and (max-width:750px)
                box-sizing border-box
                width 90vw

            &-close 
                position absolute
                right 20px 
                top 20px 
                cursor pointer

                img 
                    width 20px

            &-title 
                font-weight bold 
                font-size 25px
                text-align center
                margin-bottom 5px
                text-transform uppercase
            
            &-name 
                font-size 20px
                font-weight bold 
                margin-bottom 20px
                position relative 

                &:after 
                    content ''
                    position absolute
                    bottom -10px
                    left 0 
                    width 20px 
                    height 2px 
                    background-color #000
            
            &-date 
                font-size 13px
                text-align center 
                margin-bottom 30px

            &-mail,&-phone
                margin-bottom 5px

            &-address 
                margin-bottom 25px
            

            &-remove 
                color red 
                margin-bottom 25px
                display inline-block
                position relative 
                cursor pointer

                &:after 
                    content ''
                    position absolute
                    bottom -10px 
                    left 0
                    height 1px 
                    width 100%
                    background-color red

            &-btParent
                text-align center 
                border-top 1px solid rgba(0,0,0,0.1)
                padding-top 25px

                &-alert 
                    font-weight bold 
                    font-size 14px
                    margin-bottom 10px

            &-bt 
                display inline-block
                height 50px 
                line-height 50px
                border-radius 25px 
                background-color #66ae24
                color #FFF 
                padding 0 30px
                font-weight bold 
                margin-top 10px
                cursor pointer
            
            &-url 
                font-size 12px
                opacity 0.8
                text-align center
                margin-top 20px


    .padded-content
        margin-left 90px
        margin-right 90px
        padding-top 32px

        @media only screen and (max-width:750px)
            margin-left 30px
            margin-right 30px

        & > *
            margin-bottom 32px

        .base-button.new-quotation
            box-shadow 0px 10px 30px rgba(0, 0, 0, 0.1)
            .base-icon
                margin-right 24px

        .search-wrapper
            .icon-loupe
                margin-right 10px

        .quotation-list
            display flex
            flex-wrap wrap
            justify-content space-between

            & > *
                margin-bottom 24px
                box-sizing border-box
                width calc(50% - 12px)
                
                @media only screen and (max-width:750px)
                    width 100%

            .base-box-compact
                cursor pointer

        .base-box .recap
            font-weight 600
            font-size 18px
            line-height 23px
            margin-bottom 24px
            display flex
            align-items center

            .base-icon
                margin-right 20px

        .awaiting-quotations
            .base-button .base-icon
                margin-left 24px
        
        .awaiting-quotations-subheader 
            margin-top -20px
            margin-bottom 20px
            display block
            font-size 13px

        .awaiting-quotation
            border-color #F7C137

        .spinner-wrapper
            height 150px
            display flex
            align-items center
            justify-content center
            color #66AE24

        .quotation-list-compact
            .history-item
                display flex
                height 55px
                border 1px solid #EEF1FD
                border-radius 16px
                align-items center
                justify-content space-between
                padding-left 24px
                padding-right 16px
                margin-bottom 16px
                font-weight normal
                font-size 16px
                cursor pointer

                .name
                    font-weight 600
                    font-size 18px
                    line-height 23px

                @media only screen and (max-width:750px)
                    flex-direction column
                    height auto 
                    padding-top 25px
                    padding-bottom 25px
                    align-items flex-start


                    .popper-trigger 
                        display none
            

        .pagination
            display flex
            justify-content center
            align-items center
            padding-top 8px

            li
                display flex
                align-items center
                justify-content center

            .prev
            .next
                width 45px
                height 45px
                border-radius 50%
                border 1px solid #66AE24
                color #66AE24
                font-weight 900
                font-family monospace
                font-size 30px
                cursor pointer

                @media only screen and (max-width:750px)
                    display none

                &.disabled
                    border 1px solid #D7D8D9
                    color #D7D8D9
                    cursor default
                    pointer-events none

            .next
                margin-left 44px

            .prev
                margin-right 44px

            .page
                width 31px
                height 31px
                font-weight bold
                font-size 14px
                color #8798AD
                cursor pointer

                &:hover
                &.active
                    color #FFF
                    background #66AE24
                    border-radius 9px
</style>