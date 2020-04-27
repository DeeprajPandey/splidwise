<template>
  <q-pull-to-refresh @refresh="reload">
  <q-page class= "bg-grey-3">
    <div class="q-pa-md"
    v-if="responseObj"
    >
    <q-list bordered class="rounded-borders bg-white"
      v-for="(payments, index) in responseObj"
      :key="index"
    >
      <q-expansion-item
        expand-separator
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            {{ index }}
          </q-item-section>
        </template>
        <div id="virtual-scroll-target" class="q-pa-md scroll" style="height: 300px"><q-markup-table virtual-scroll flat>
          <thead>
            <th class="text-left">Amount</th>
            <th class="text-left">Description</th>
            <th>Approve</th>
          </thead>
          <tbody>
            <tr
              v-for="(pmt, pid) in payments"
              :key="pid"
            >
              <td class="text-left">
                &#164; {{pmt.amount}}/-
                <q-tooltip>&#164; is the universal symbol for currency.</q-tooltip>
              </td>
              <td class="text-left">{{responseObj[index][pid]}}</td>
              <td class="text-center">
                <q-btn v-if="$q.platform.is.mobile" round dense color="secondary" 
                  :loading="approve_status"
                  icon="check_circle"
                  @click="approvePayment(index, pid)"
                />
                <q-btn v-else color="secondary" 
                  :loading="approve_status"
                  icon="check_circle"
                  @click="approvePayment(index, pid)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table></div>
      </q-expansion-item>
    </q-list>
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
      requestObj: {
        debtor: "",
      },
      responseObj: {
      },
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    approvePayment(creditor, pmtid) {
      axiosInstance.post(`/${this.user}/approvePayment`,{
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
    },
    reload(done) {
      this.loadData();
      done();
    },
    loadData() {
      this.requestObj.debtor = this.user;
      axiosInstance.post(`/${this.user}/getUnapprovedPayments`, this.requestObj)
      .then(response => {
        this.responseObj = response.data.data;
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
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `[${err.response.status}] ${err.response.data.error}`,
          icon: 'report_problem'
        });
      })
    }
  }
}
</script>
