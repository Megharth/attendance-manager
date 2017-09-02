<template>
  <div>
    <app-header :logout="logout" :user="user" @updateComponent="updateComponent($event)"></app-header>
    <md-dialog-alert :md-content="error.content" :md-ok-text="error.ok" ref="error">
      <md-content>Error</md-content>
    </md-dialog-alert>
    <div class="content">
      <component :user="user" :is="component"
                 @login="login($event)"
                 @updateProfile="updateProfile($event)"
                 @addSub="addSub($event)">
      </component>
    </div>
    <div class="footer"></div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Login from './components/login-main.vue'
import Header from './components/header.vue'
import footer from './components/footer.vue'
import updateProfile from './components/updateProfile.vue'
import addSub from './components/addSub'
import timetable from './components/timetable.vue'
import Firebase from 'firebase'
import Attendance from './components/Attendance.vue'

var config = {
    apiKey: "AIzaSyB42fPdwrxiHCYGwPmNv9wdnJo6tbJ1ePY",
    authDomain: "attendance-module-ac03e.firebaseapp.com",
    databaseURL: "https://attendance-module-ac03e.firebaseio.com",
    projectId: "attendance-module-ac03e",
    storageBucket: "attendance-module-ac03e.appspot.com",
    messagingSenderId: "394144405920"
  };
var app = Firebase.initializeApp(config);

export default {
  name: 'app',
  data() {
    return {
      component: 'login',
      logout: false,
      user: {
        attendanceCriteria: '',
        subjects: '',
        displayName: '',
        timetable: ''
      },
      error: {
        content: 'default',
        ok: 'close'
      }
    }
  },
  components: {
    'login': Login,
    'app-header': Header,
    'app-footer': footer,
    'update-profile': updateProfile,
    'add-sub': addSub,
    'timetable': timetable,
    'attendance': Attendance
  },
  methods: {
    openDialog: function(ref) {
      this.$refs[ref].open();
    },
    closeDialog: function(ref) {
      this.$refs[ref].close();
    },
    login: function(data) {
      var self = this;
      this.user = data;
      Firebase.database().ref('/users/' + this.user.uid).once('value').then(function(snap) {
        self.user.attendanceCriteria = snap.val().attendancecriteria;
        self.user.subjects = snap.val().subjects;
        self.user.timetable = snap.val().timetable;
        if(self.user.attendanceCriteria && self.user.subjects && self.user.timetable)
          self.component = 'attendance';
        else if(self.user.attendanceCriteria && self.user.subjects)
          self.component = 'timetable';
        else if(self.user.attendanceCriteria)
          self.component = 'add-sub';
        else
          self.component = 'update-profile';
      });
      this.logout = true;
    },
    updateProfile: function(data) {
      this.component = data.component;
      this.user.displayName = data.displayName;
    },
    addSub: function(data) {
      this.component = data;
    },
    updateComponent: function(data) {
      this.logout = data.logout;
      this.component = data.component;
    }
  }
}
</script>

<style lang="sass">
@import './sass/variables'
.footer
  position: absolute
  top: 100%

</style>
