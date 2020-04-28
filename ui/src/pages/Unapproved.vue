<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class="q-pa-lg bg-grey-3">
    <div class="q-pa-md"
    v-if="Object.keys(responseObj).length > 0"
    >
    <q-list class="rounded-borders bg-white" bordered separator>
      <q-expansion-item expand-separator
      v-for="(creditor_data, index) in responseObj"
      :key="index">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{ creditor_data.name.toUpperCase() }}</q-item-label>
          </q-item-section>

          <q-item-section class="desktop-only">{{ index }}</q-item-section>
        </template>
        <div class="q-pa-md scroll-y" @touchstart="preventPull" style="height: 25vh">
        <div class="row mobile-only" style="margin-top: -2.5vh">
          <div class="col"></div>
          <div class="col"><q-item-section style="color: grey" >{{ index }}</q-item-section></div>
        </div>
        <q-markup-table virtual-scroll flat class="q-mt-md">
          <!-- <thead>
            <th class="text-left"><span class="text-subtitle1">Amount</span></th>
            <th class="text-left"><span class="text-subtitle1">Description</span></th>
            <th><span class="text-subtitle1">Approve</span></th>
          </thead> -->
          <tbody>
            <tr
              v-for="(pmt, pid) in creditor_data.payments"
              :key="pid"
            >
              <td class="text-left">
                <span class="text-body1">&#x20B9; {{ pmt.amount }}/-</span>
                <!-- <q-tooltip>&#164; is the universal symbol for currency.</q-tooltip> -->
              </td>
              <td class="text-left"><span class="text-body1">{{ pmt.description }}</span></td>
              <td class="text-center">
                <q-btn class="mobile-only q-my-xs" round dense color="secondary" 
                  :loading="loading_status"
                  icon="check_circle"
                  @click="approvePayment(index, responseObj[index].payments[pid].pmtId)"
                >
                  <template v-slot:loading><q-spinner-gears /></template>
                </q-btn>
                <!-- When platform is not mobile -->
                <q-btn class="desktop-only q-my-sm" color="secondary"
                  size="1.8vh"
                  :loading="loading_status"
                  icon="check_circle"
                  @click="approvePayment(index, responseObj[index].payments[pid].pmtId)"
                >
                  <template v-slot:loading><q-spinner-gears /></template>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table></div>
      </q-expansion-item>
    </q-list>
    </div>
    <div
      v-else
      class="no-tasks absolute-center">
      <q-icon
      name="check"
      size="100px"
      color="primary" />
      <div class="text-h5 text-center absolute-center text-primary" style="margin-top: 10vh">
        No Payments!
      </div>
    </div>
  </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { axiosInstance } from 'boot/axios'
export default {
  data() {
    return {
      user: "user1@protonmail.com",
      responseObj: {},
      loading_status: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    approvePayment(creditor, pmtid) {
      // set the status for button to true
      this.loading_status = true;
      // API is too fast, simulate working state
      setTimeout(() => {
        this.loading_status = false;
      }, 1500)
      axiosInstance.post(`/${this.user}/approvePayment`, {
        debtor: this.user,
        creditor: creditor,
        pmtId: pmtid
      })
      .then(apprvResponse => {
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${apprvResponse.data.message}`,
          icon: 'info',
          actions: [{ icon: 'close', color: 'white' }]
        });
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
      .finally(
        setTimeout(() => {
          // reload to show updates (remove approved payment)
          this.loadData();
        }, 3000)
      )
    },
    reload(done) {
      this.loadData();
      done();
    },
    loadData() {
      axiosInstance.post(`/${this.user}/getUnapprovedPayments`, {
        debtor: this.user
      })
      .then(allResponse => {
        this.responseObj = allResponse.data.data;
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${allResponse.data.message}`,
          icon: 'info',
          actions: [{ icon: 'close', color: 'white' }]
        });
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
    },
    preventPull (e) {
      let parent = e.target

      while (parent !== void 0 && !parent.classList.contains('scroll-y')) {
        parent = parent.parentNode
      }

      if (parent !== void 0 && parent.scrollTop > 0) {
        e.stopPropagation()
      }
    }
  }
}
</script>
