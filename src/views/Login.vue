<script>
    import BaseInput from '@/components/BaseInput'
    import BaseBox from '@/components/BaseBox'
    import BaseButton from '@/components/BaseButton'
    import BaseSpinner from '@/components/BaseSpinner'

    export default {
        name: 'Login',

        components: {
            BaseInput,
            BaseBox,
            BaseButton,
            BaseSpinner,
        },

        data() {
            return {
                loading: false,
                // email: 'comercial@kvnbra.com',
                // password: 'comercialtest'
                email: '',
                password: ''
            }
        },

        methods: {
            handleLoginClick() {
                this.loading = true
                this.$store.dispatch('userAuthenticate', {
                    attributes: {
                        email: this.email,
                        username: this.email,
                        password: this.password
                    }
                }).then(() => {
                    this.$router.push('/')
                }).catch((err) => {
                    this.$toasted.error(err.response.data.message)
                    this.loading = false
                })
            }
        }
    }
</script>

<template>
    <div class="login-screen">
        <div class="body">
            <div class="logo">
                <img src="../assets/logo-large.png">
            </div>
            <BaseBox>
                <span slot="header">Se connecter</span>
                <div class="form-row">
                    <label>
                        <div class="label">Votre identifiant</div>
                        <BaseInput :value="email" @input="email = $event.target.value" placeholder="Mon identifiant" type="text"/>
                    </label>
                </div>
                <div class="form-row">
                    <label>
                        <div class="label">Mot de passe</div>
                        <BaseInput :value="password" @input="password = $event.target.value" type="password" placeholder="*********"/>
                    </label>
                </div>
                <div class="button-wrapper">
                    <BaseButton class="green-button filled-button" :disabled="loading" @click="handleLoginClick">
                        <BaseSpinner v-if="loading" />
                        <span v-else>Se connecter</span>
                    </BaseButton>
                </div>
            </BaseBox>
        </div>
    </div>
</template>

<style lang="stylus">
.login-screen
    background #FAFBFF

    .body
        min-height 100vh
        margin auto
        max-width 400px
        display flex
        flex-direction column
        justify-content center
        align-content center

    .logo
        text-align center
        margin-bottom 10vh

    .form-row
        margin-bottom 16px

        .label
            margin-bottom 10px

    .base-button
        margin-top 16px
        margin-bottom 12px
        box-sizing border-box
        width 100%
</style>