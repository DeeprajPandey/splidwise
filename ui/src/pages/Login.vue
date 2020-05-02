<template>
  <!-- row    -->
  <q-page class="flex q-pa-lg justify-center bg-grey-3">
    <q-card
      :class="{ 'full-width':$q.platform.is.mobile, 'login-desktop':!$q.platform.is.mobile }">
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
          <q-tab-panel name="login" class="q-pa-xl">

            <div
              class="text-grey-8 text-body2" style="font-style: italic;">
              First time here? You know what to do.
            </div>
            <div
              class="text-grey-8 text-body2" style="font-style: italic;">
              No? You still know what to do.
            </div><br/><br/>
            <q-btn
            class="full-width google-btn q-pa-xs q-mt-lg"
            size="2vh"
            icon="fab fa-google"
            label="Login with Ashoka ID"
            type="a"
            href="/auth/google/login"/>
            <div class="login-panel"></div>

          </q-tab-panel>

          <q-tab-panel name="register" class="q-pa-xl">

            <div
              class="text-grey-8 text-body2" style="font-style: italic;">
              Psst.. Splidwise is currently in private beta and open only at Ashoka University.
            </div><br/><br/>
            <q-btn
            class="full-width google-btn q-pa-xs q-mt-lg"
            size="2vh"
            icon="fab fa-google"
            label="Register with Ashoka ID"
            type="a"
            href="/auth/google/register"/>
            <div class="login-panel"></div>

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

.login-panel {
  height: 200px;
  width: 100%;
}

.google-btn {
  background: #de5246;
  color: white;
}
</style>
