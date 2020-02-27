<script>
    import BaseRing from '@/components/BaseRing'

    export default {
        name: 'BaseGauge',

        components: {
            BaseRing,
        },

        props: {
            value: {
                type:Number,
                default: 50
            }
        },

        computed: {
            percentage() {
                return 55.9 * Math.abs(100-this.value) / 100
            }
        }
    }
</script>

<template>
    <div class="base-gauge">
        <div class="stick"></div>
        <div class="stick2"></div>
        <div class="ring">
            <BaseRing
              :percentage="percentage"
              :stroke="'16%'"
              :foreground="'transparent'"
              :background="'rgba(255, 255, 255, 0.9)'"/>
        </div>

    </div>
</template>

<style lang="stylus">
.base-gauge
    overflow hidden
    padding-bottom: 59.402%
    background-image url('../assets/gauge.png')
    background-size contain
    background-position 50% 0%
    position relative
    background-repeat no-repeat

    .ring
        transform: scale(-1, 1);
        position absolute
        top 0%
        left 0
        right 0
        width 100%
        padding-bottom 100%
        overflow hidden

        .base-ring
            transform rotate(-101.3deg)

        circle
            stroke-linecap butt

    .stick
        display none
        width 2px
        height 200px
        left 50%
        margin-left -1px
        position absolute
        background red

    .stick2
        display none
        width 200px
        height 2px
        bottom 15%
        margin-top -1px
        position absolute
        background red
</style>