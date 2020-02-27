<script>
    export default {
        name: 'BaseButton',
        props: {
            disabled: Boolean
        }
    }
</script>
<template>
    <div v-on="$listeners" v-bind="$attrs" class="base-button" :class="{ disabled }" role="button">
        <slot></slot>
    </div>
</template>
<style lang="stylus">
.base-button
    height 50px
    border-radius 50px
    display inline-flex
    padding-left 24px
    padding-right 24px
    font-weight 600
    font-size 16px
    cursor pointer
    border 1px solid transparent
    justify-content center
    align-items center

    &.disabled
        cursor default
        pointer-events none

    &.filled-button
        color #fff

        &.green-button
            background #66AE24

        &.orange-button
            background #F7C137

    &:not(.filled-button)
        &.green-button
            border-color #66AE24
            color #66AE24

        &.orange-button
            border-color #F7C137
            color #F7C137


</style>