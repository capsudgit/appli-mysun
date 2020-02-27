<script>
    import VueApexCharts from 'vue-apexcharts'
    import _ from 'lodash'

    const defaults = {
        colors:['#FFA742'],
        tooltip: {
            enabled: false
        },
        chart: {
            height: 350,
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false,
            },

        },
        legend: {
            show: false,
        },
        markers: {
            size: 4,
            colors: 'white',
            strokeColors: ['#FFA742'],
            strokeWidth: 3,
            strokeOpacity: 1,
            fillOpacity: 1,
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 4,
            curve: 'straight'
        },
        fill: {
            gradient: {
                opacityFrom: 0.4,
                opacityTo: 0.2,
            },
        },
        grid: {
            borderColor: '#C3C3C3',
            strokeDashArray: 1,
            xaxis: {
                lines: {
                    show: true,
                }
            },
            yaxis: {
                lines: {
                    show: true,
                }
            }
        },
        xaxis: {
            labels: {
                style: {
                    fontSize: '16px',
                    fontFamily: 'Muli, Helvetica, Arial, sans-serif',
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            axisBorder: {
                show: true,
                color: '#ECF0FD',
            },
        },
        yaxis: {
            min: 0,
            labels: {
                style: {
                    fontSize: '16px',
                    fontFamily: 'Muli, Helvetica, Arial, sans-serif',
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            axisBorder: {
                show: true,
                color: '#ECF0FD',
            },
        },
    }

    export default {
        name: 'BaseLineChart',

        components: {
            apexchart: VueApexCharts,
        },

        props: {
            series: {
                type: Array,
                required: true
            },

            options: {
                type: Object,
                default: () => { return {} }
            },
        },

        computed: {
            mergedOptions() {
                return _.merge({}, defaults, this.options)
            }
        },
    }
</script>

<template>
    <div class="base-line-chart">
        <apexchart type="area" height="350" :options="mergedOptions" :series="series" />
    </div>
</template>

<style lang="stylus">
.base-line-chart
    .apexcharts-xaxis-label
        fill #8798AD

</style>