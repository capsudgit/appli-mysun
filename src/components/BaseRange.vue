<script>
    export default {
        name: 'BaseRange',

        props: {
            value: {
                default: null
            },

            min: {
                type: Number,
                default: 0,
            },

            max: {
                type: Number,
                default: 100,
            },

            step: {
                type: Number,
                default: 1
            }
        },

        data() {
            return {
                dragging: false,
                currentX: undefined,
                initialX: undefined,
                xOffset: undefined,
            }
        },

        watch: {
            dragging() {
                if (this.dragging) {
                    this.$emit('dragStart')
                } else {
                    this.$emit('dragEnd')
                }
            },

            max() {
                this.init()
            },

            min() {
                this.init()
            },

            step() {
                this.init()
            }
        },

        computed: {
            distance() {
                return (this.value - this.min) / (this.max - this.min) * 100
            }
        },

        mounted() {
            this.init()
        },

        beforeDestroy() {
            this.removeListeners()
        },

        methods: {
            init() {
                this.removeListeners()
                const distance = this.value / (this.max - this.min) * 100
                this.xOffset = (this.$el.clientWidth * (distance / 100))
                this.addListeners()
            },

            drag(e) {
                if (this.dragging) {
                    e.preventDefault()

                    if (e.type === "touchmove") {
                        this.currentX = e.touches[0].clientX - this.initialX
                    } else {
                        this.currentX = e.clientX - this.initialX
                    }

                    this.xOffset = this.currentX
                    const percentage = (this.xOffset / this.$el.clientWidth)
                    let value = (this.max - this.min) * percentage
                    value = this.step * Math.round(value / this.step);
                    value = Math.max(this.min, value)
                    value = Math.min(this.max, value)

                    this.$emit('change', { value })
                }
            },

            dragStart(e) {
                if (e.type === "touchstart") {
                    this.initialX = e.touches[0].clientX - this.xOffset
                } else {
                    this.initialX = e.clientX - this.xOffset
                }
                if (e.target === this.$refs.handle || this.$refs.handle.contains(e.target)) {
                    this.dragging = true
                }
            },

            dragEnd() {
                this.initialX = this.currentX
                this.dragging = false
            },

            addListeners() {
                window.addEventListener("touchstart", this.dragStart, false)
                window.addEventListener("touchend", this.dragEnd, false)
                window.addEventListener("touchmove", this.drag, false)

                window.addEventListener("mousedown", this.dragStart, false)
                window.addEventListener("mouseup", this.dragEnd, false)
                window.addEventListener("mousemove", this.drag, false)
            },

            removeListeners() {
                window.removeEventListener("touchstart", this.dragStart)
                window.removeEventListener("touchend", this.dragEnd)
                window.removeEventListener("touchmove", this.drag)

                window.removeEventListener("mousedown", this.dragStart)
                window.removeEventListener("mouseup", this.dragEnd)
                window.removeEventListener("mousemove", this.drag)
            }
        }
    }
</script>
<template>
    <div class="base-range">
        <div class="before">
            <slot name="before">{{ min }}%</slot>
        </div>
        <div ref="handle" class="handle-wrapper" :style="{ left: distance + '%' }">
            <slot name="handle">
                <div class="handle"></div>
            </slot>
        </div>
        <div class="foreground" :style="{ width: distance + '%' }"></div>
        <div class="after">
            <slot name="after">{{ max }}%</slot>
        </div>
    </div>
</template>
<style lang="stylus">
.base-range
    background #FDEEC7
    height 4px
    position relative

    .before
    .after
        position absolute
        font-weight 600
        font-size 18px
        line-height 23px
        top 100%
        margin-top 8px

    .before
        left 0

    .after
        right 0

    .foreground
        background #F7C137
        position absolute
        height 100%
        left 0
        z-index 1

    .handle-wrapper
        position absolute
        z-index 2
        touch-action none
        user-select none
        transform translate(-50%, -50%)
        cursor pointer

    .handle
        height 24px
        width 24px
        border 2px solid #F7C137
        background #FFF
        border-radius 24px

</style>