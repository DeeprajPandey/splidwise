<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class="q-pa-lg bg-grey-3 column">
    <div class="q-pa-md" 
    v-if="lent_money_to.length > 0">
      <div class="text-h6 q-pb-md">People you paid for</div>
      <q-list class="rounded-borders bg-white" bordered separator>
        
        <DashboardItem
          v-for="(debtor_arr, index) in lent_money_to"
          :key="index"
          :user-arr="debtor_arr"
          type="credit"
          @addedAmounts="displayAmount"></DashboardItem>

      </q-list>
    </div>
    <div class="q-pa-md" 
    v-if="owes_money_to.length > 0">
      <div class="text-h6 q-pb-md">People who paid for you</div>
      <q-list class="rounded-borders bg-white" bordered separator>

        <DashboardItem
          v-for="(creditor_arr, index) in owes_money_to"
          :key="index"
          :user-arr="creditor_arr"
          type="debit"
          @addedAmounts="displayAmount"></DashboardItem>

      </q-list>
    </div>
    <div
      v-if="(owes_money_to.length <= 0) && (lent_money_to.length <= 0)"
      class="no-tasks absolute-center">
      <q-icon
      name="hourglass_empty"
      size="100px"
      color="primary"
      style="margin-top: -8vh;" />
      <div class="text-h5 text-center absolute-center text-primary" style="margin-top: 8vh;">
        No Payment Records
      </div>
    </div>

    <DashboardStatusCard
      :card="card"
      :finance_state="finance_state"
      @cardClosed="handleClose"></DashboardStatusCard>
  </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { axiosInstance } from 'boot/axios'
import { mapGetters, mapActions } from 'vuex'
import DashboardStatusCard from 'components/DashboardStatusCard'
import DashboardItem from 'components/DashboardItem'

export default {
  created() {
    if (this.$route.query.u) {
      this.setProfileImg(this.$route.query.url);
      this.loadData(this.$route.query.u);
    }
    else if (this.uname) {
      this.loadData(this.uname);
    }
    else {
      this.$router.push('/');
      this.$q.notify({
        color: 'neutral',
        position: 'bottom',
        message: 'Please log in with your registered ID',
        icon: 'report_problem'
      });
    }
  },

  data() {
    return {
      finance_state: {
        creditor_name: '',
        debtor_name: ''
      },
      card: false,
      expanded: false,
    }
  },

  computed: {
    ...mapGetters('user_info', [
      'uname', 'lent_money_to', 'owes_money_to'
    ])
  },

  components: {
    DashboardStatusCard,
    DashboardItem
  },

  methods: {
    ...mapActions('user_info', [
      'setUserData', 'setProfileImg', 'updateLentArr', 'updateOwesArr'
    ]),

    displayAmount(finance_from_item) {
      // triggered after child component has calculated amounts
      this.finance_state = finance_from_item;
      this.card = true;
    },

    handleClose(newval) {
      this.card = newval;
    },

    loadData(username) {
      if (!username) {
        // if the user is not logged in, store will give us empty string
        console.log('User not logged in');
        this.$q.notify({
          color: 'neutral',
          position: 'top',
          message: `Please log in to see this page.`,
          icon: 'report_problem'
        });
        this.$router.push('/');
      }
      axiosInstance.post(`/${username}/getUser`, {
        "passw_hash": "hello"
      })
      .then(response => {
        this.setUserData({
          username: username,
          name: response.data.data.name
        });
        this.updateLentArr(response.data.data.lent_money_to);
        this.updateOwesArr(response.data.data.owes_money_to);
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${response.data.message}`,
          icon: 'info',
          actions: [{ icon: 'close', color: 'white' }]
        });
      })
      .catch(err => {
        console.log(err.response);
        if (err.response.status == 401) {
          this.$q.notify({
            color: 'neutral',
            position: 'top',
            message: `Please log in to see this page.`,
            icon: 'report_problem'
          });
          this.$router.push('/');
        } else {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: `[${err.response.status}] ${err.response.data.error}`,
            icon: 'report_problem'
          });
        }
      })
    },
    reload(done) {
      this.loadData(this.uname);
      done();
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
