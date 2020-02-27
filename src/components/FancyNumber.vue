<script>
    export default {
        name: 'FancyNumber',

        props: {
            value: {
                default: null
            },

            step: {
                type: Number,
                default: 1
            }
        },

        computed: {
            distance() {
                return (this.value - (this.value / this.numbers.length)) * 10
            },

            numbers() {
                const numbers = [...Array(10).keys()].filter((i) => {
                    return i % this.step === 0
                })
                numbers.push(0)
                return numbers
            }
        },
    }
</script>
<template>
    <span class="fancy-number">
        <span class="numbers" :style="{ transform: 'translateY(' + -distance + '%)' }">
            <span v-for="(i, j) in numbers" :key="j">{{ i }}</span>
        </span>
    </span>
</template>
<style lang="stylus">
.fancy-number
    height 25px
    width 15px
    display inline-block
    position relative
    overflow hidden

    .numbers
        position absolute
        display flex
        flex-direction column
        font-weight bold
        font-size 24px
        line-height 25px
        top 0
        left 0

</style>