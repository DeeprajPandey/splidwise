<template>
  <q-page>
    <h5>
    Pay for a user</h5>

  </q-page>
</template>

<script>
import { QSpinnerGears } from 'quasar'
export default {
  data() {
    return {
      // request body for /makePayment
      request: {
        creditor: "",
        debtor: "",
        amount: 0,
        description: "",
        timestamp: "1586554076"
      },
      response: {
        data: {},
        message: ""
      }
    }
  },
  methods: {
    showLoading() {
      this.$q.loading.show({
        delay: 400 // ms
      })
      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
      }, 2000)
    },
    beforeDestroy () {
      if (this.timer !== void 0) {
        clearTimeout(this.timer)
        this.$q.loading.hide()
      }
    }
  }
}
</script>
