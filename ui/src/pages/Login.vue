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
            @click="onUserLogIn"/>
            <br/><br/><br/>
            <q-btn class="flat"
            label="Simulate login"
            @click="dummyLogin"/>

            <div class="q-pa-lg">Code sent to server: {{ googledata }}<br/>
            Userdata received: {{ userdata }}</div>
          </q-tab-panel>

          <q-tab-panel name="register">
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
import { axiosInstance } from 'boot/axios'
import { mapActions } from 'vuex'

export default {
  name: 'Login',

  data () {
    return {
      tab: 'login',
      googledata: "hello",
      userdata: {
        username: 'user2@gmail.com',
        name: 'Rachit Rawat',
        lent_money_to: [],
        owes_money_to: [],
        pic_url: 'https://randomuser.me/api/portraits/men/11.jpg'
      }
    }
  },
  methods: {
    ...mapActions('user_info', [
      'setUserData'
    ]),

    dummyLogin() {
      this.setUserData(this.userdata);
      this.$router.push('/app');
    },

    onUserLogIn () {
      auth2.grantOfflineAccess().then(this.passToServer);
    },

    passToServer(authResult) {
      if (authResult['code']) {
        console.log(authResult['code']);
        this.googledata = authResult['code'];

        // send the code to redirect endpoint
        axiosInstance.post('/auth/google/redirect', {
          code: authResult['code']
        })
        .then(response => {
          this.userdata = response.data.data;
          // place the authenticated user info in the store
          // this.setUserData(response.data.data);
          this.$q.notify({
            color: 'neutral',
            position: 'bottom',
            timeout: 500,
            message: `${response.data.message}`,
            icon: 'info',
            actions: [{ icon: 'close', color: 'white' }]
          });
          // put userdata in store
          // now redirect to dashboard
        })
        .catch(err => {
          console.log(err.response);
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: `[${err.response.status}] ${err.response.data.error}`,
            icon: 'report_problem'
          });
        })
      } else {
        console.log('error');
      }
    }
  }
}
</script>

<style>
.login-desktop {
  width: 600px;
}
</style>
