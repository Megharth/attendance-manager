<template>
  <div>

    <md-tabs>
      <md-tab md-label="Login">
        <login @login="login($event)" class="login"></login>
      </md-tab>
      <md-tab md-label="Signup">
        <sign-up class="signup"></sign-up>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>

import signUp from './signup'
import login from './login'


export default {
  components: {
    'login': login,
    'sign-up': signUp
  },
  methods: {
    login: function(data){
      this.$emit('login', data);
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/variables'
.md-tab-header-container
  font-family: $bowlby
.login
  margin-top: 150px
.signup
  margin-top: 100px
</style>
