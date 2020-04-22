<template>
  <q-page
    class="window-height window-width row justify-center items-center bg-grey-3"
    style="background: linear-gradient(#8274C, #5A4A9F);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:450px;height:580px;">
          <q-card-section class="bg-deep-purple-8">
            <h4 class="text-h5 text-white q-px-md q-my-md"><font size='6'><b> SpliDwise</b></font></h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
            </div>
          </q-card-section>
          <q-card-section >
            <q-form class="q-px-sm q-pt-lg q-pa-md">
              <q-input square clearable v-model="email"  type="email" label="Email" class="q-pa-md">
                <template v-slot:prepend>
                  <q-icon name="email" class="q-pa-md"/>
                </template>
              </q-input>
              <q-input square clearable v-model="name"  type="text" label="Name" class="q-pa-md">
                <template v-slot:prepend>
                  <q-icon name="perm_identity" class="q-pa-md"/>
                </template>
              </q-input>
              <q-input square clearable v-model="password" type="password" label="Password" class="q-pa-md">
                <template v-slot:prepend>
                  <q-icon name="lock" class="q-pa-md"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-xl q-pa-sm">
            <q-btn unelevated size="lg" color="purple-4" class="full-width text-white" label="Register" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      username: '',
      password: ''
    }
  }
}
</script>

<style>
</style>
