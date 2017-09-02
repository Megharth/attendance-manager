<template>
  <div>
    <h1>Add subjects</h1>
    <md-dialog md-open-from="#add" md-close-to="#add" ref="addSub">
      <md-dialog-title>Add a new subject</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <label>Subject</label>
          <md-input v-model="subjects.name"></md-input>
        </md-input-container>
        <md-dialog-title>Attended Lectures</md-dialog-title>
        <md-input-container>
          <md-input type="number" v-model="subjects.attended"></md-input>
        </md-input-container>
        <span>of</span>
        <md-input-container>
          <md-input type="number" v-model="subjects.total"></md-input>
        </md-input-container>
        <md-dialog-actions>
          <md-button @click="addSub">Add</md-button>
          <md-button @click="closeDialog('addSub')">Close</md-button>
        </md-dialog-actions>
      </md-dialog-content>
    </md-dialog>
    <div class="subject">
      <md-card v-for="subject in subjects" :key="id">
        <md-card-header>{{ subject.name }}</md-card-header>
        <md-card-content>
          <span class="left">Attended: {{subject.attended}}</span>
          <span class="right">Total: {{subject.total}}</span>
        </md-card-content>
      </md-card>
    </div>
    <div class="actions">
      <md-button class="md-fab md-primary" id="add" @click="openDialog('addSub')">
        <md-icon>add</md-icon>
        <md-tooltip md-direction="left">Add a subject</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary" id="done" v-if="done" @click="sendSub">
        <md-icon>done</md-icon>
        <md-tooltip md-direction="left">Submit</md-tooltip>
      </md-button>
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
      subjects: [],
      done: false,
      id: 0
    }
  },
  methods: {
    openDialog: function(ref) {
      this.$refs[ref].open();
    },
    closeDialog: function(ref) {
      this.$refs[ref].close();
    },
    addSub: function() {
      this.id++;
      this.subjects.push({
        id: this.id,
        name: this.subjects.name,
        attended: this.subjects.attended,
        total: this.subjects.total
      });
      this.subjects.name = '';
      this.subjects.attended = '';
      this.subjects.total = '';
      this.done = true;
    },
    sendSub: function() {
      var self = this;
      var updates = {};
      updates['users/' + self.user.uid + '/subjects/'] = self.subjects;
      return Firebase.database().ref().update(updates).then(function() {
        console.log(self.user.displayName + ': subjects added');
        self.$emit('addSub', 'timetable');
      })
    },
  },
  created() {
    var self = this;
    return Firebase.database().ref('users/' + self.user.uid).once('value').then(function(snap) {
      if(snap.val().subjects)
        self.subjects = snap.val().subjects;
      console.log(self.subjects);
    })
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/addSub'
</style>
