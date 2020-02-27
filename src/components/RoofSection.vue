<script>
    import PopperMenu from '@/components/PopperMenu'
    import BaseInput from '@/components/BaseInput'
    import BaseBox from '@/components/BaseBox'
    import BaseRange from '@/components/BaseRange'
    import FancyNumberB from '@/components/FancyNumberB'
    import IconSheets from '@/components/IconSheets'
    import IconTrash from '@/components/IconTrash'
    import IconArrowLeftCompact from '@/components/IconArrowLeftCompact'
    import IconArrowRightCompact from '@/components/IconArrowRightCompact'

    import orientations from '@/orientations'

    export default {
        name: 'RoofSection',

        components: {
            PopperMenu,
            BaseInput,
            BaseBox,
            BaseRange,
            FancyNumberB,
            IconSheets,
            IconTrash,
            IconArrowLeftCompact,
            IconArrowRightCompact,
        },

        props: {
            id: {
                type: [String, Number],
                required: true
            },

            area: {
                type: Number,
            },

            tilt: {
                type: Number,
            },

            mainOrientation: {
                type: String
            },

            detailedOrientation: {
                type: [String, Number],
            },

            installablePower: {
                type: Number,
                default: 0
            }
        },

        watch: {
            mainOrientation() {
                let detailedOrientation
                if (this.mainOrientation === 'NORD') {
                    detailedOrientation = -180
                }
                if (this.mainOrientation === 'EST') {
                    detailedOrientation = -90
                }
                if (this.mainOrientation === 'SUD') {
                    detailedOrientation = 0
                }
                if (this.mainOrientation === 'OUEST') {
                    detailedOrientation = 90
                }

                this.$nextTick(() => {
                    this.$emit('detailedOrientationChange', { id: this.id, value: detailedOrientation })
                })
            }
        },

        computed: {
            orientations() {
                return orientations[this.mainOrientation]
            },
        }
    }
</script>

<template>
    <BaseBox class="roof-section">
        <div slot="header">
            <slot name="header"></slot>
        </div>
        <div slot="top-right">
            <PopperMenu>
                <ul>
                    <li @click="$emit('duplicateSectionClick', { area, tilt, mainOrientation, detailedOrientation })">
                        <IconSheets /><span>Duppliquer le pan</span>
                    </li>
                    <li @click="$emit('removeSectionClick', { id })">
                        <IconTrash /><span>Supprimer le pan</span>
                    </li>
                </ul>
            </PopperMenu>
        </div>

        <div class="form-row area">
            <label>
                <div class="label">Surface du pan</div>
                <div class="input-with-suffix">
                    <BaseInput
                      style="width:32px;"
                      type="text"
                      :value="area"
                      @input="$emit('areaInput', { id: id, value: $event.target.value })"
                      />
                    <span>m²</span>
                </div>
            </label>
        </div>
        <div class="form-row orientation">
            <label>
                <div class="label">Orientation principale</div>
                <select
                  :value="mainOrientation"
                  @change="$emit('mainOrientationChange', { id: id, value: $event.target.value })"
                  class="base-select"
                  style="width: 130px;">
                    <option value="SUD">SUD</option>
                    <option value="NORD">NORD</option>
                    <option value="EST">EST</option>
                    <option value="OUEST">OUEST</option>
                </select>
            </label>
            <label>
                <div class="label">Orientation en degrés</div>
                <select
                  :value="parseInt(detailedOrientation)"
                  @change="$emit('detailedOrientationChange', { id: id, value: $event.target.value })"
                  class="base-select"
                  style="width: 145px;">
                    <option v-for="item in orientations" :key="item.key" :value="item.angle">
                        {{ item.key }}
                    </option>
                </select>
            </label>
        </div>
        <div class="form-row inclination">
            <label>
                <div class="label">Pente</div>
                <BaseRange :min="10" :max="60" :value="tilt" @change="({ value }) => $emit('tiltChange', { id, value })">
                    <span slot="before">10°</span>
                    <div class="visual-handle" slot="handle">
                        <div class="value">
                            <FancyNumberB :value="Math.trunc(tilt / 10)" />
                            <FancyNumberB :value="1 * Math.trunc(Math.trunc(tilt % 10) / 1)" :step="1" />
                            <sup style="margin-top: -3px">°</sup>
                        </div>
                        <div class="helper">
                            <IconArrowLeftCompact />
                            <IconArrowRightCompact />
                        </div>
                    </div>
                    <span slot="after">60°</span>
                </BaseRange>
            </label>
        </div>
        <p class="recap">
            Puissance installable : <strong>{{ installablePower | format }}</strong> kWc
        </p>
    </BaseBox>
</template>

<style lang="stylus">
.roof-section
    .base-box-top-right
        z-index 1
    .form-row
        display block

    .form-row.inclination
        label
            width 100%

        .base-range
            margin-top 55px
            margin-bottom 50px
            margin-left 24px
            margin-right 24px

            .before
                margin-left -24px

            .after
                margin-right -24px
    .recap
        font-weight 600
        font-size 18px
        line-height 23px

        strong
            font-size 24px
            font-weight 700
</style>