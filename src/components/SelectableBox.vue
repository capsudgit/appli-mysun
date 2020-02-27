<script>
    import IconCheck from '@/components/IconCheck'

    export default {
        name: 'SelectableBox',

        components: {
            IconCheck,
        },

        props: {
            active: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<template>
    <div class="selectable-box" :class="{active: active}">
        <IconCheck v-show="active" />
        <slot></slot>
    </div>
</template>
<style lang="stylus">
.selectable-box
    transition opacity ease .3s
    border 2px solid #E8F3DE
    padding 8px
    padding-top 16px
    padding-bottom 12px
    border-radius 16px
    text-align center
    position relative
    cursor pointer
    opacity 0.5

    .icon-check
        transition opacity ease .3s
        color #66AE24
        position absolute
        top 2px
        right 2px
        transform translate(50%, -50%)
        opacity 0

    &.active
        opacity 1
        border-color #66AE24

    .icon-check
        opacity 1

</style>