<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space></q-space>
        <q-btn
          flat
          icon='exit_to_app'
          label='Logout'
          @click="logout"
        />
        <!-- <q-toolbar-title>
          SPLIDWISE
        </q-toolbar-title> -->
      </q-toolbar>
      <div class="q-px-lg q-pt-lg q-mb-md">
        <div class="text-h3">Splidwise</div>
        <div class="text-subtitle1">{{ todaysDate }}</div>
      </div>
      <q-img
        src="statics/alt.jpg"
        class="header-image absolute-top" />
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="250"
        :breakpoint="600"
      >
        <q-scroll-area style="height: calc(100% - 168px); margin-top: 168px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item
            to="/app"
            exact
            clickable
            v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item>

            <q-item
            to="/app/pay"
            exact
            clickable
            v-ripple>
              <q-item-section avatar>
                <q-icon name="payment" />
                <!-- <q-icon name="euro_symbol" /> -->
                <!-- <q-icon name="receipt" /> -->
              </q-item-section>

              <q-item-section>
                Pay for Someone
              </q-item-section>
            </q-item>

            <q-item
            to="/app/unapproved"
            exact
            clickable
            v-ripple>
              <q-item-section avatar>
                <q-icon name="dynamic_feed" />
                <!-- <q-icon name="all_inbox" /> -->
                <!-- <q-icon name="notification_important" /> -->
                <!-- <q-icon name="new_releases" /> -->
              </q-item-section>

              <q-item-section>
                Approve Payments
              </q-item-section>
            </q-item>

            <q-item
            to="/app/help"
            exact
            clickable
            v-ripple>
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>

              <q-item-section>
                Help
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="statics/alt.jpg" style="height: 168px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="pic_url">
            </q-avatar>
            <div class="text-weight-bold">{{ name }}</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'MainLayout',

  computed: {
    ...mapActions('user_info', [
      'clearUserData'
    ]),
    ...mapGetters('user_info', [
      'name', 'pic_url'
    ]),
    todaysDate() {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM')
    }
  },

  data () {
    return {
      leftDrawerOpen: false
    }
  },

  methods: {
    logout() {
      // clear user info from state and clear the session
      this.clearUserData;
      sessionStorage.clear();
      this.$router.push('/logout');
    }
  }
}
</script>

<style lang="scss">
  .header-image {
    height: 100%;
    z-index: -1;
    opacity: 0.2;
    filter: grayscale(100%);
  }
</style>
