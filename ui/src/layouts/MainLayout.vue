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
        <!-- <q-toolbar-title>
          SPLIDWISE
        </q-toolbar-title> -->
      </q-toolbar>
        <div class="q-px-lg q-pt-xl q-mb-md">
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
        <q-scroll-area style="height: calc(100% - 192px); margin-top: 192px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item
            to="/app/login"
            exact
            clickable
            v-ripple>
              <q-item-section avatar>
                <q-icon name="supervisor_account" />
              </q-item-section>

              <q-item-section>
                Login
              </q-item-section>
            </q-item>

            <q-item
            to="/app/register"
            exact
            clickable
            v-ripple>
              <q-item-section avatar>
                <q-icon name="supervisor_account" />
              </q-item-section>

              <q-item-section>
                Register
              </q-item-section>
            </q-item>

            <q-item
            to="/app/dashboard"
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

        <q-img class="absolute-top" src="statics/alt.jpg" style="height: 192px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://s.gravatar.com/avatar/4f0ba5cd9ec13e0c103a265fc4bc231e?s=80">
            </q-avatar>
            <div class="text-weight-bold">Deepraj Pandey</div>
            <div>@DeeprajPandey</div>
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
import { supervisor_account } from '@quasar/extras/material-icons'
import { date } from 'quasar'
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  created(){
    this.supervisor_account=supervisor_account
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        },
        {
          title: 'Quasar Awesome',
          caption: 'Community Quasar projects',
          icon: 'favorite',
          link: 'https://awesome.quasar.dev'
        }
      ]
    }
  },

  computed: {
    todaysDate() {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM')
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
