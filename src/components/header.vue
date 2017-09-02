<template>
  <div class="header">
    <md-dialog-alert :md-content="error.content" :md-ok-text="error.ok" ref="error">
      <md-content>Error</md-content>
    </md-dialog-alert>
    <h1>Attendance manager</h1>
    <md-button v-if="logout" @click="signOut">Sign Out</md-button>
    <div class="navbar" v-if="logout">
      <ul>
        <li @click="addSub">Add Subjects</li>
        <li @click="updateProfile">Update Profile</li>
        <li @click="timetable">Timetable</li>
        <li @click="attendanceManager">Today's Attendance</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Firebase from 'firebase'
  export default{
    props: {
      logout: {
        type: Boolean
      },
      user: {
        type: Object
      }
    },
    data() {
      return {
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
      signOut: function() {
        var self = this;
        Firebase.auth().signOut().then(function() {
          self.$emit('updateComponent', {
            logout: false,
            component: 'login'
          });
          sessionStorage.removeItem("user.email");
        }).catch(function(error){
          self.error.content = error.message;
          self.openDialog('error');
        })
      },
      attendanceManager: function() {
        this.$emit('updateComponent', {
          logout: true,
          component: 'attendance'
        })
      },
      addSub: function(){
        this.$emit('updateComponent', {
          logout: true,
          component: 'add-sub'
        });
      },
      updateProfile: function() {
        this.$emit('updateComponent', {
          logout: true,
          component: 'update-profile'
        })
      },
      timetable: function() {
        this.$emit('updateComponent', {
          logout: true,
          component: 'timetable'
        })
      }
    }
  }
</script>

<style lang="sass">
@import "../sass/header"
</style>
