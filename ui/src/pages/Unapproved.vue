<template>
  <q-page class= "bg-grey-3">
    <div class="q-pa-md" 
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
    </div>
  </q-page>
</template>

<script>
import { face } from '@quasar/extras/material-icons'

export default {
  created(){
    this.supervisor_account=supervisor_account
  },
  data() {
    return {
      request_login: {
        user: "",
        passw_hash: ""
      },
      response: {},
      dummy_response: {
        // will include lent_money_to[], owes_money_to[]
        data: {
          "name": "Fettered Einstein",
          "lent_money_to": [["debtor_uid1","Festered Darwin",2], ["debtor_uid54","Excited Kafka",1], ["debtor_uid7","Triumphant Curie",5]],
          "owes_money_to": [["creditor_uid4","Goofy Euclid"],["creditor_uid1","Reverent Snyder"], ["creditor_uid30","Pensive Rosalind"]]
        },
        message: "User data read successfully."
      }
    }
  }
}
</script>
