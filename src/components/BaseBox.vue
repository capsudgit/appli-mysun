<script>
    export default {
        name: 'BaseBox',
    }
</script>
<template>
    <div class="base-box">
        <h3 class="base-box-header">
            <slot name="header"></slot>
        </h3>
        <div class="base-box-top-right">
            <slot name="top-right"></slot>
        </div>
        <div class="base-box-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
.base-box
    position relative
    background #fff
    border 1px solid #F2F4FF
    padding 24px
    border-radius 16px
    line-height 25px

    .base-box-header
        margin-bottom 24px
        font-style normal
        font-weight 800
        font-size 20px
        color #2E364D

        &:empty
            display none

    .base-box-top-right
        position absolute
        right 20px
        top 20px
    
    .base-box-content
        strong 
            font-weight bold

    &.base-box-compact
        padding 16px

        .base-box-header
            font-weight 600
            font-size 18px
            margin-bottom 14px

</style>