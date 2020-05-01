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

            <q-btn ref="signinButton" class="flat"
            label="Login with Google"
            type="a"
            href="/auth/google"/>
            <br/><br/><br/>
            <q-btn class="flat"
            label="Simulate login"
            @click="dummyLogin"/>

          </q-tab-panel>

          <q-tab-panel name="register">
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
      tab: 'login'
    }
  },
  methods: {
    dummyLogin() {
      this.$router.push('/app/?u=user2@gmail.com&url=https%3A%2F%2Frandomuser.me%2Fapi%2Fportraits%2Fmen%2F11.jpg');
    }
  }
}
</script>

<style>
.login-desktop {
  width: 600px;
}
</style>
