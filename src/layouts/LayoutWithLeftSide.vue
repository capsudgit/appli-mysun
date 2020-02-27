<script>
    export default {
        name: 'LayoutWithLeftSide',

        components: {
        },
    }
</script>

<template>
    <div class="layout-with-left-side">
        <div class="main-body">
            <aside class="left-side">
                <slot name="left-side"></slot>
            </aside>
            <main class="main-content">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<style lang="stylus">
.layout-with-left-side
    background #FAFBFF
    display flex
    flex-direction column
    min-height 100vh

    .main-body
        display flex
        align-items stretch
        flex-grow 1
        position relative // so we can stick (absolute) footer at the bottom

    .main-content
    .left-side
        padding-bottom 120px // make some room for the footer

    .left-side
        flex-shrink 0
        width 270px
        background #FFF
        border-right 1px solid #F2F4FF

        @media only screen and (max-width:750px)
            display none

        .logo
            width 123px
            display block
            margin auto
            padding-top 16px
            cursor pointer

            img
                width 100%

        .ring-wrapper
            position relative
            width 130px
            height 130px
            display block
            margin auto
            margin-top 30px
            margin-bottom 30px

            .steps
                position absolute
                top 0
                left 0
                right 0
                bottom 0
                display flex
                align-items center
                justify-content center
                flex-direction column

            .step-value
                font-size 26px
                line-height 33px

        .sections
            section
                border-left 9px solid transparent
                padding-left 25px
                padding-top 16px
                padding-bottom 16px
                padding-right 10px
                border-top 1px solid #EAEDFD

                &:last-of-type
                    border-bottom 1px solid #EAEDFD

                &.clickable
                    cursor pointer

                &.active
                    border-left 9px solid #66AE24

                    .section-title
                        color #A4BF9B

            .section-title
                font-weight normal
                font-size 16px
                line-height 20px
                text-transform uppercase
                color: #8798AD

            .section-content
                padding-top 12px
                padding-bottom 8px

            strong
                font-weight 600
                font-size 20px
                line-height 25px

            small
                font-weight normal
                font-size 14px
                line-height 18px

    .main-content
        flex-grow 1

</style>