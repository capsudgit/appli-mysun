<script>
    export default {
        name: 'BaseInput',
        inheritAttrs: false,
    }
</script>
<template>
    <div class="base-input">
        <slot name="before"></slot>
        <input
          v-bind="$attrs"
          v-on="$listeners">
        <slot name="after"></slot>
    </div>
</template>
<style lang="stylus">
.base-input
    height 50px
    line-height 50px
    background #FDFDFD
    font-size 16px
    border 1px solid #CECFD0
    border-radius 16px
    padding-left 16px
    padding-right 16px
    color #2E364D
    display flex
    align-items center

    &:focus-within
        box-shadow 0px 0px 5px rgba(blue, 0.1)

    input
        flex-grow 1
        flex-shrink 1
        width 100%
        color inherit
        background inherit
        border 0
        outline 0
        font-family inherit
        font-size inherit

</style>