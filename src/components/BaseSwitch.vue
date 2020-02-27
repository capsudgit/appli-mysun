<script>
    export default {
        name: 'BaseSwitch',

        props: {
            active: {
                type: Boolean,
                default: false
            }
        }
    }

</script>

<template>
    <div class="base-switch" :class="{active: active}">
        <div class="foreground"></div>
    </div>
</template>

<style lang="stylus">
.base-switch
    transition background .3s ease
    height 34px
    width 80px
    border-radius 20px
    background #fff
    border 1px solid #8798AD
    position relative
    cursor pointer

    &.active
        background #fff
        border-color #66AE24

        .foreground
            left 100%
            background #66AE24
            transform translateX(calc(-100% - 4px))

    .foreground
        transition left .3s ease, transform .3s ease
        background #8798AD
        position absolute
        transform translateX(4px)
        top 4px
        bottom 4px
        left 0
        width 26px
        border-radius 13px

</style>
