<script>
export default {
    name: `TransitionGroupExpandAndFadeIn`,
    functional: true,
    render(createElement, context) {
        if(context.props.disabled) {
            return createElement(`transition-group`, {}, context.children);
        }

        const data = {
            props: {
                name: `group-expand`,
                tag: context.props.tag !== undefined ? context.props.tag : `ul`,
                appear: context.props.appear !== undefined ? context.props.appear : true,
            },
            on: {
                afterEnter(element) {
                    element.style.height = `auto`;
                },
                enter(element) {
                    const { width } = getComputedStyle(element);

                    element.style.width = width;
                    element.style.position = `absolute`;
                    element.style.visibility = `hidden`;
                    element.style.height = `auto`;

                    const { height } = getComputedStyle(element);

                    element.style.width = null;
                    element.style.position = null;
                    element.style.visibility = null;
                    element.style.height = 0;

                    // Force repaint to make sure the
                    // animation is triggered correctly.
                    getComputedStyle(element).height;

                    setTimeout(() => {
                        element.style.height = height;
                    });
                },
                leave(element) {
                    const { height } = getComputedStyle(element);

                    element.style.height = height;

                    // Force repaint to make sure the
                    // animation is triggered correctly.
                    getComputedStyle(element).height;

                    setTimeout(() => {
                        element.style.height = 0;
                    });
                }
            }
        };
        return createElement(
            `transition-group`,
            Object.assign(context.data, data),
            context.children
        );
    }
};

</script>

<style lang="stylus" scoped>
* >>> * {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
</style>

<style lang="stylus">
.group-expand-enter {
    opacity 0
    transform translateY(200px)
}
.group-expand-enter-to {
    opacity 1
    transform translateY(0)
}
.group-expand-enter-active,
.group-expand-leave-active {
    transition: height .25s ease-in-out,
        opacity .5s 0.20s ease,
        transform .5s 0.20s ease;
    // transition: height .15s ease-in-out;
    overflow: hidden !important;
}

.group-expand-enter,
.group-expand-leave-to {
    height: 0;
}
</style>
