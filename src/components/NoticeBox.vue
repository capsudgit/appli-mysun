<script>
    export default {
        name: 'BaseBox',
    }
</script>
<template>
    <div class="notice-box">
        <h5 class="notice-box-header">
            <slot name="header"></slot>
        </h5>
        <div class="notice-box-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
.notice-box
    border-radius 16px
    text-align center
    padding 24px
    background: #FFFFFF
    border 1px solid #F1F4FF

    .notice-box-header
        &:empty
            display none

    &.green-box
        background #EEFAD3
        border 1px solid transparent

    h5
        font-weight 600
        font-size 18px
        line-height 23px
        margin-bottom 24px

    p
        font-size 14px
        line-height 18px

    strong
        font-weight 900
        font-size 32px
        line-height 40px
</style>