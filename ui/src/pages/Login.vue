<template>
  <!-- row    -->
  <q-page class="flex q-pa-lg justify-center bg-grey-3">
    <q-card
      :class="{ 'full-width':$q.platform.is.mobile, 'login-desktop':!$q.platform.is.mobile }"
    >
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated swipeable>
          <q-tab-panel name="login">
            <div class="text-h5">Login</div>
          </q-tab-panel>

          <q-tab-panel name="register">
            <div class="text-h5">Register</div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      tab: 'login',
      email1: null,
      email2: '',
      username: '',
      password1: null,
      password2: ''
    }
  },
  methods: {
    onSubmit () {
      this.$refs.email1.validate()
      this.$refs.password1.validate()

      if (this.$refs.email1.hasError || this.$refs.password1.hasError) {
        this.formHasError = true
      }
      else this.$router.push("/app")
      // else if (this.accept !== true) {
      //   this.$q.notify({
      //     color: 'negative',
      //     message: 'You need to fill the log in details'
      //   })
      // }
      // else {
      //   this.$q.notify({
      //     icon: 'done',
      //     color: 'positive',
      //     message: 'Signed In'
      //   })
      // }
    }
  }
}
</script>

<style>
.login-desktop {
  width: 600px;
}
</style>
