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
          <q-route-tab name="login" label="Login" to="/" />
          <q-route-tab name="register" label="Register" to="/#register" exact/>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated swipeable>
          <q-tab-panel name="login" class="q-pa-xl">

            <div
              class="text-grey-8 text-body2" style="font-style: italic;">
              First time here? You know what to <a href="/#register">do</a>.
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

  mounted() {
    if (this.$route.query.r) {
      this.notify_and_push(this.$route.query.r);
    }
  },

  data () {
    return {
      tab: 'login'
    }
  },
  methods: {
    notify_and_push(reason) {
      let msg = '';
      let where = '/';
      if (reason == 'unregistered') {
        msg = 'Please register before trying to log in'
        where = '/#register'
      }
      else if (reason == 'reregister') {
        msg = 'You already have an account, please log in with this ID'
      }
      this.$q.notify({
        color: 'neutral',
        position: 'bottom',
        message: msg,
        icon: 'report_problem',
        actions: [
          { label: 'Dismiss', color: 'white' }
        ]
      });
      this.$router.push(where);
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
