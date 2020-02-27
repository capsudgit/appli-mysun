<script>
    export default {
        name: 'BaseRing',

        props: {
            foreground: {
                type: String,
                default: '#E8F3DE'
            },

            background: {
                type: String,
                default: '#66AE24'
            },

            stroke: {
                type: [Number, String],
                default: 35
            },

            percentage: {
                type: Number,
                required: true
            }
        }
    }
</script>

<template>
<svg viewBox="-25 -25 400 400" class="base-ring">
    <circle :stroke="foreground" cx="175" cy="175" r="175" :stroke-width="stroke" fill="none"></circle>
    <circle :stroke="background" transform="rotate(-90 175 175)" cx="175" cy="175" r="175" stroke-dasharray="1100" :stroke-width="stroke" stroke-dashoffset="1100" stroke-linecap="round" fill="none" :style="{ 'stroke-dashoffset': 1100 - 1100 * percentage / 100 + 'px' }"></circle>
</svg>
</template>

<style lang="stylus">

.base-ring
    width 100%
    height 100%
    circle
        transition stroke-dashoffset .5s ease
</style>