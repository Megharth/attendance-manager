<template>
  <div class="container">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Update your profile</h3>
      </div>
      <div class="panel-body">
        <md-input-container>
          <label>Username</label>
          <md-input v-model="name"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Attendance Criteria(%)</label>
          <md-input v-model="attendanceCriteria" type="number"></md-input>
        </md-input-container>
        <md-button @click="submit">Submit</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      attendanceCriteria: '',
      name: ''
    }
  },
  methods: {
    submit: function() {
      var self = this
      var db = Firebase.database();
      var updates= {};
      updates['/users/' + self.user.uid + '/attendancecriteria'] = self.attendanceCriteria;
      updates['/users/' + self.user.uid + '/name'] = self.name;
      return db.ref().update(updates).then(function() {
        self.$emit('updateProfile', {component: 'add-sub', displayName: self.name});
      }).catch(function(error) {
        console.log(error.message)
      });
    }
  },
  created() {
    var self = this;
    Firebase.database().ref('users/' + self.user.uid).once('value').then(function(snap) {
      if(snap.val().attendancecriteria){
        self.name = snap.val().name;
        self.attendanceCriteria = snap.val().attendancecriteria;
      }
    })
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/updateProfile'
</style>
