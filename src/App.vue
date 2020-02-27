<script>
    export default {
        name: 'App',

        data() {
            return {
                loadingCities: false,
                loadingOptions: false
            }
        },

        computed: {
            citiesProgress() {
                return this.$store.getters.citiesProgress
            },
        },

        beforeMount() {
            if (navigator.onLine) {
                this.loadingOptions = true
                
                this.$store.dispatch('userRefreshToken').then(() => {

                }).catch(() => {
                    this.$toasted.show('Impossible de regénérer un token, vous devez vous reconnecter !')
                    this.loadingOptions = false
                    this.$router.push('/login')
                })

                this.$store.dispatch('optionsGet').then(() => {
                    this.loadingOptions = false
                }).catch(() => {
                    this.$toasted.show('Impossible de charger les options, utilisation des valeurs par defaut.')
                    this.loadingOptions = false
                })
            }

            this.loadingCities = true
            this.$store.dispatch('setIDBCities').then(() => {
                this.loadingCities = false
            }).catch(() => {
                this.$toasted.error('Erreur lors du chargement de l\'annuaire de ville.')
                this.loadingCities = false
            })
        }
    }
</script>
<template>
    <div id="app">
        <div class="loading-screen" v-if="loadingCities || loadingOptions">
            <img class="logo" src="./assets/logo-extra-large.png">
            <div class="loader">
                <div class="progress" :style="{ width: citiesProgress + '%' }"></div>
            </div>
        </div>
        <router-view v-else/>
    </div>
</template>
<style lang="stylus">
@import './assets/css/fonts.css'

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
    display: block;
}
body {
    line-height: 1;
    font-family: 'Muli';
    font-size 16px
    color #2E364D
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
a
    text-decoration none
    color inherit

.loading-screen
    display flex
    align-items center
    justify-content space-around
    min-height 100vh
    flex-direction column

    .logo
        width 80%
        max-width 500px

    .loader
        position relative
        height 6px
        background rgba(#8798AD, 0.3)
        max-width 500px
        width 80%
        overflow hidden
        border-radius 3px

        .progress
            transition width ease .2s
            background #66AE24
            position absolute
            top 0
            bottom 0
            left 0
            width 0%


.base-range
    .visual-handle
        height 24px
        width 48px
        border 2px solid #F7C137
        background #FFF
        border-radius 24px
        position relative

        .helper
            position absolute
            left 4px
            right 4px
            top 0
            bottom 0
            color #F7C137
            display flex
            align-items center
            justify-content space-between

        .value
            display flex
            justify-content center
            margin-top -35px
            font-weight bold
            font-size 24px
            line-height 30px

            & > *
                flex-shrink 0

.base-select
    height 50px
    line-height 50px
    background #FDFDFD
    font-size 16px
    border 1px solid #CECFD0
    border-radius 16px
    padding-left 16px
    padding-right 16px
    color #2E364D
    box-sizing border-box
    width 100%
    outline 0

    &:focus
        outline 0
        box-shadow 0px 0px 5px rgba(blue, 0.1)

.input-with-suffix
    display flex
    align-items center

    span
        margin-left 10px

.btBack
    display none 
    @media only screen and (max-width:750px)
        display block 
        margin-left 24px 
        margin-right 24px
        margin-bottom 25px

        svg 
            margin-right 10px

</style>
