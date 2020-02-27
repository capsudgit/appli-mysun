<script>
    export default {
        name: 'LayoutGeneric',

        computed: {
            me() {
                return this.$store.getters.me
            },

            initials() {
                let initials = this.me.name.match(/\b\w/g) || []
                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()

                return initials
            }
        },
    }
</script>

<template>
    <div class="layout-generic">
        <div class="main-body">
            <header>
                <img @click="$router.push('/')" class="logo" src="../assets/logo.png">
                <h1>
                    <slot name="header-title">Estimateur My Sun</slot>
                </h1>
                <div class="avatar">{{ initials }}</div>
            </header>
            <main class="main-content">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<style lang="stylus">
.layout-generic
    background #FAFBFF
    display flex
    flex-direction column
    min-height 100vh

    header
        padding-left 24px
        padding-right 24px
        height 80px
        background #FFF
        border-bottom 1px solid #EFF2FF
        display flex
        align-items center
        justify-content space-between

        .logo
            width 102px
            cursor pointer

            @media only screen and (max-width:750px)
                width 50px
                margin-right 20px

        h1
            font-weight bold
            font-size 24px
            line-height 30px
            color #2E364D
            text-align center
            flex-grow 1

            @media only screen and (max-width:750px)
                font-size 14px
                text-align left

        .avatar
            background #8798AD
            width 48px
            height 48px
            border-radius 50%
            color #FFF
            display flex
            justify-content center
            align-items center
            font-weight 900
            font-size 20px

            @media only screen and (max-width:750px)
                height 30px
                width 30px
                font-size 14px
</style>