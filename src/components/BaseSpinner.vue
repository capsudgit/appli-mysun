<script>
    export default {
        props: {
            'background': { default: 'transparent' },
            'foreground': { default: 'currentColor' }
        }
    }
</script>
<template>
    <svg class="base-spinner" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect>
        <circle cx="50" cy="50" r="40" :stroke="background" fill="none" stroke-width="14" stroke-linecap="round"></circle>
        <circle cx="50" cy="50" r="40" :stroke="foreground" fill="none" stroke-width="10" stroke-linecap="round">
            <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate>
            <animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate>
        </circle>
    </svg>
</template>
