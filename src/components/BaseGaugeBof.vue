<script>
    // not working above 80%
    export default {
        name: 'BaseGaugeBof',

        props: {
            value: {
                type:Number,
                default: 75
            }
        },

        computed: {
            angle() {
                return this.value * 2
            }
        },

        methods: {

        }
    }
</script>

<template>
    <div class="base-gauge-bof">
        <div class="stick"></div>
        <div class="stick2"></div>
        <div class="mask-wrapper" :style="{ transform: 'rotate('+ angle +'deg)'}">
            <div class="mask"></div>
            <div class="mask-before"></div>
            <div class="mask-after"></div>
        </div>
    </div>
</template>

<style lang="stylus">
.base-gauge-bof
    overflow hidden
    padding-bottom 59.4%
    background-image url('../assets/gauge.png')
    background-size contain
    background-position 50% 50%
    position relative

    .mask-wrapper
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        transform-origin: 50% 85%;

    .mask
        width 120%
        height 100%
        background rgba(255, 255, 255, 0.8)
        position absolute
        bottom 15%
        left -10%

    .mask-before
        position absolute
        bottom 0
        left 0
        width 50%
        height 15%
        background rgba(255, 255, 255, 0.8)
        clip-path: polygon(0 0, 0% 100%, 100% 0);

    .mask-after
        position absolute
        bottom 0
        right 0
        width 50%
        height 15%
        background rgba(255, 255, 255, 0.8)
        clip-path: polygon(100% 0, 0 0, 100% 100%);

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