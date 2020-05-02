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
        placeholder="ada.lovelace@ashoka.edu.in"
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
        <q-icon name="mdi-currency-inr" />
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

      <div>
        <q-btn :loading="loading_status" label="Submit" type="submit" color="primary" class="q-ml-lg">
          <template v-slot:loading><q-spinner-gears /></template>
        </q-btn>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-lg" />
      </div>
    </q-form>
    <br/>

  </div>
</template>

<script>
import { axiosInstance } from 'boot/axios'
import { mapGetters } from 'vuex'

export default {
  name: 'Pay',

  created() {
    if (!this.uname) {
      this.$router.push('/');
      this.$q.notify({
        color: 'neutral',
        position: 'bottom',
        message: 'Please log in with your registered ID',
        icon: 'report_problem'
      });
    }
  },

  computed: {
    ...mapGetters('user_info', [
      'uname'
    ])
  },

  data () {
    return {
      request: {
        creditor: "",
        debtor: "",
        amount: null,
        description: "",
        timestamp: ""
      },
      loading_status: false
    }
  },
  methods: {
    makePayment() {
      if (!this.uname) {
        // if user isn't logged in, don't bother sending request
        console.log('User not logged in');
        this.$q.notify({
          color: 'neutral',
          position: 'top',
          message: `Please log in with your registered ID.`,
          icon: 'report_problem'
        });
        this.$router.push('/');
      }
      this.loading_status = true;
      // simulate working for UX
      setTimeout(() => {
        this.loading_status = false;
      }, 2500)

      this.request.creditor=this.uname;
      this.request.timestamp=Math.round(+new Date()/1000).toString();

      axiosInstance.post(`/${this.uname}/makePayment`, this.request)
      .then(paidReponse => {
        this.$q.notify({
          color: 'neutral',
          position: 'bottom',
          timeout: 500,
          message: `${paidReponse.data.message}`,
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
        if (err.response.status == 401) {
          this.$router.push('/');
        }
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