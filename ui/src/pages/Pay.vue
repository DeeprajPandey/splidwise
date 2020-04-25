<template>
  <div class="q-pa-xl" style ="max-width: 600px">

    <q-form
      @submit="makePayment"
      @reset="resetData"
      class="q-gutter-md full-width"
      align="center"
    >
      <q-input
        filled type="email"
        v-model="request.debtor" align="center"
        hint="Debtor username"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type a valid email ID']"
      >
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
      </q-input>

      <q-input
        filled type="number"
        v-model="request.amount" align="center"
        hint="Amount you paid"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type a valid amount',
          val => val > 0 || 'Please type a valid amount'
        ]"
      >
      <template v-slot:prepend>
        <q-icon name="attach_money" />
      </template>
      </q-input>

      <q-input
        filled text-sanitize
        v-model="request.description" align = "center"
        placeholder="Description" hint="What did you pay for?"
        clearable>
      <template v-slot:prepend>
        <q-icon name="description" />
      </template>
      </q-input>

      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

      <div>
        <q-btn label="Submit" type="submit" color="primary" class="q-ml-lg"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-lg" />
      </div>
    </q-form>
    <br/>
    <p>[DebugInfo] Timestamp of request: {{ request.timestamp }}</p>

  </div>
</template>

<script>
import { axiosInstance } from 'boot/axios'
export default {
  data () {
    return {
      user: "user1@protonmail.com",
      request: {
        creditor: "",
        debtor: "",
        amount: null,
        description: "",
        timestamp: ""
      },
      response: {

      }
    }
  },
  methods: {
    makePayment() {
      this.request.creditor=this.user;
      this.request.timestamp=Math.round(+new Date()/1000).toString();
      axiosInstance.post(`/${this.user}/makePayment`, this.request)
      .then(response => {
        this.response = response.data.data;
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
    },
    resetData() {
      this.request.debtor = ""
      this.request.amount = null
      this.request.description = ""
      this.request.timestamp=""
    }
  }
}
</script>