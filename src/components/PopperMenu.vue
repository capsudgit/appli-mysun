<script>
    import Popper from 'vue-popperjs';

    import IconDots from '@/components/IconDots'

    export default {
        name: 'Home',

        components: {
            Popper,

            IconDots,
        },

        data() {
            return {
                open: false
            }
        }
    }
</script>
<template>
    <popper class="popper-menu" :class="{ 'popper-open': open }"
      trigger="click"
      :tagName="'div'"
      @show="open = true"
      @hide="open = false"
      :visible-arrow="false"
      :stop-propagation="true"
      :options="{
        placement: 'bottom-end',
        modifiers: {
          offset: { offset: '0px, -1px' } ,
          flip: { enabled: false },
        }
      }">
        <slot></slot>
        <div class="popper-trigger" slot="reference"><IconDots /></div>
    </popper>
</template>
<style lang="stylus">
.popper-menu
    .popper-trigger
        line-height 0

        .icon-dots
            padding 10px
            padding-bottom 16px
            border-top-left-radius 10px
            border-top-right-radius 10px
            cursor pointer
            background #FFF
            border 1px solid transparent
            color #8798AD

            &:hover
                color #2E364D

    &.popper-open
        z-index 100
        .icon-dots
            border 1px solid #E3E8FC
            border-bottom 1px solid #fff
            color #2E364D

    ul
        border-radius 10px
        border-top-right-radius 0px
        border 1px solid #E3E8FC
        background #FFF
        width 250px
        z-index 1

        li
            padding 16px
            border-bottom 1px solid #E3E8FC
            cursor pointer
            display flex
            align-items center

            .base-icon
                margin-right 28px

            &:last-of-type
                border-bottom #000

            &:hover
                color #2E364D

</style>