<template>
  <q-page
    class="row justify-center items-center bg-grey-3"
    style="background: linear-gradient(#8274C, #5A4A9F);"
  >
    <div class="column  q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:580px;height:960px;">
          <q-card-section class="bg-deep-purple-8">
            <h4 class="text-h5 text-white q-px-md q-my-md"><font size='6'><b> SpliDwise</b></font></h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
            </div>
          </q-card-section>

          <form @submit.prevent.stop="onSubmit" class="q-gutter-md">
          <q-card-section >
            <q-form class="q-px-sm q-pt-sm q-pa-sm">
              <q-input square clearable ref= "email1" v-model="email1"  type="email" label="Email*" class="q-pa-lg"
              :rules="[ val => val && val.length > 0 || 'Please type Email ID']">
                <template v-slot:prepend>
                  <q-icon name="email" class="q-pa-md"/>
                </template>
              </q-input>
              <q-input square clearable ref= "password1" v-model="password1" type="password" label="Password*" class="q-pa-md"
              :rules="[ val => val && val.length > 0 || 'Please type password']">
                <template v-slot:prepend>
                  <q-icon name="lock" class="q-pa-md"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-xl q-pa-sm">
            <q-btn unelevated size="lg" color="purple-4" class="full-width text-white" type = "submit" label="Sign In" />
          </q-card-actions>
          <q-card-section class="text-center q-px-sms q-pt-md q-pa-sm">
            <!-- <q-btn unelevated size="md" class="full-width text-grey-7" label="Not Registered? Create an Account" /> -->
            <p class="text-grey-7 q-px-sm q-pa-sm"> Not Registered? Create an Account</p>
          </q-card-section>
        </form>
          <q-card-section >
            <q-form class="q-px-sm q-pt-sm q-pa-sm">
              <q-input square clearable v-model="email2"  type="email" label="Email" class="q-pa-lg">
                <template v-slot:prepend>
                  <q-icon name="email" class="q-pa-md"/>
                </template>
              </q-input>
              <q-input square clearable v-model="username"  type="text" label="Name" class="q-pa-md">
                <template v-slot:prepend>
                  <q-icon name="perm_identity" class="q-pa-md"/>
                </template>
              </q-input>
              <q-input square clearable v-model="password2" type="password" label="Password" class="q-pa-md">
                <template v-slot:prepend>
                  <q-icon name="lock" class="q-pa-md"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-xl q-pa-sm">
            <q-btn unelevated size="lg" to ="/app" color="purple-4" class="full-width text-white" label="Register" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
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
</style>
