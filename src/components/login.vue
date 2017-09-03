<template>
  <div>
    <md-dialog-alert
    :md-content="error.content"
    :md-ok-text="error.ok"
    ref="error">
    </md-dialog-alert>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-8 col-sm-offset-2">
            <md-input-container>
              <label>Email</label>
              <md-input v-model="email"></md-input>
            </md-input-container>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-8 col-sm-offset-2">
            <md-input-container>
              <label>password</label>
              <md-input type="password" v-model="password"></md-input>
            </md-input-container>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-2 col-sm-offset-4">
            <md-button @click="signIn" class="md-primary">Login</md-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: {
        content: 'default',
        ok: 'close'
      }
    }
  },
  methods: {
    openDialog: function(ref) {
      this.$refs[ref].open();
    },
    closeDialog: function(ref) {
      this.$refs[ref].close();
    },
    signIn: function() {
      var self = this;
      Firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function() {
        console.log('Logged in succesfully');
        var user = Firebase.auth().currentUser;
        sessionStorage.email = user.email;
        self.$emit('login', user);
      }).catch(function(error) {
        self.error.content = error.message;
        self.openDialog('error');
      });

    }
  }
}
</script>

<style lang="sass" scoped>
.panel
  max-width: 500px
  margin: 0px auto
</style>
