<template>
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
        <q-list bordered separator>
          <q-item>
            <q-item-section>Amount</q-item-section>
            <q-item-section>Description</q-item-section><q-space></q-space>
            <q-item-section side>Action</q-item-section>
          </q-item>
          <q-item
            v-for="(pmt, pid) in payments"
            :key="pid"
          >
            <q-item-section>{{pmt.amount}}</q-item-section>
            <q-item-section>{{pmt.description}}</q-item-section>
            <q-item-section side><q-btn color="secondary" icon-right="check_circle" label="Approve" /></q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </div>




    <!--<div class="q-pa-md" 
    v-if="dummy_response.data.lent_money_to.length > 0">
      <h5 class ="row justify-center">
        Unapproved Payments
      </h5>
      <q-list bordered class="rounded-borders bg-white">
        <q-expansion-item
        v-for="debtor_arr in dummy_response.data.lent_money_to"
          :key="debtor_arr[0]"
          clickable v-ripple>
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar icon="face" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              {{ debtor_arr[0] }}
            </q-item-section>

          </template>

          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
              commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />
      </q-list>
    </div> -->
  </q-page>
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

      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
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
