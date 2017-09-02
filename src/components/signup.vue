<template>
  <div>
    <md-dialog-alert :md-content="alert.content" :md-ok-text="alert.ok" ref="alert"></md-dialog-alert>
    <md-dialog-alert :md-content="login.content" :md-ok-text="login.ok" ref="login"></md-dialog-alert>
    <md-dialog-alert :md-content="error.content" :md-ok-text="error.ok" ref="error"></md-dialog-alert>
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
          <div class="col-sm-offset-5">
            <md-button class="md-primary signup" @click="signUp">Sign Up</md-button>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <div class="col-sm-offset-4">
          <md-button @click="signUpProvider" class="google-btn"><img src="../assets/google.png" class="btn-icon">Google Login</md-button>
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
      alert: {
        content: 'A password reset email has been sent to your Email address',
        ok: 'Close'
      },
      login: {
        content: 'Account created. Verify your email and login with your credentials',
        ok: 'close'
      },
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
    signUp: function() {
      var self = this;
      Firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(function() {
        var user = Firebase.auth().currentUser;
        user.attendanceCriteria = null;
        user.subjects = null;
        console.log('user created: ' + user);
        Firebase.database().ref('/users/' + user.uid).set({
          email: user.email,
          attendanceCriteria: null,
          subjects: null
        }).then(function() {
          user.sendEmailVerification();
        });
        self.openDialog('login');
      }).catch(function(error) {
        self.error.content = error.message;
        self.openDialog('error');
      })
    },
    signUpProvider: function() {
      var self = this;
      var provider = new Firebase.auth.GoogleAuthProvider();
      var db = Firebase.database();
      Firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = Firebase.auth().currentUser;
        var email = user.email;
        var password = 'aA1234';
        user.updatePassword(password).then(function() {
          Firebase.auth().sendPasswordResetEmail(email).then(function() {
            self.openDialog('alert');
            db.ref('/users/' + user.uid).set({
              name: user.displayName,
              email: user.email,
              attendanceCriteria: null,
              subjects: null
            }).then(function() {
              console.log('data enetered');
            });
          })
        });
      }).catch(function(error) {
        self.error.content = error.message;
        self.openDialog('error');
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.panel
  max-width: 500px
  margin: 0 auto
.btn-icon
  height: 25px
  width: 25px
  margin-right: 5px
  margin-bottom: 1px
</style>
