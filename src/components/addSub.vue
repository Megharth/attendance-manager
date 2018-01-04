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
    <md-dialog-confirm
      :md-title="confirm.title"
      :md-content-html="confirm.contentHtml"
      :md-ok-text="confirm.ok"
      :md-cancel-text="confirm.cancel"
      ref="delSub"
      @close="onClose"
    ></md-dialog-confirm>
    <div class="container-fluid">
      <div class="subjects">
        <div v-for="subject in subjects" :key="id" class="card">
          <div class="card-header">{{ subject.name }}</div>
          <div class="card-content">
            <span class="left">Attended: {{subject.attended}}</span>
            <span class="right">Total: {{subject.total}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <md-button class="md-fab md-primary" id="add" @click="openDialog('addSub')">
        <md-icon>add</md-icon>
        <md-tooltip md-direction="left">Add a subject</md-tooltip>
      </md-button>
      <md-button class="md-fab md-warn" id="delete" @click="openDialog('delSub')">
        <md-icon>delete</md-icon>
        <md-tooltip md-direction="top">Reset Subjects</md-tooltip>
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
import MdDialog from "../../node_modules/vue-material/src/components/mdDialog/mdDialog.vue";

export default {
  components: {MdDialog},
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      subjects: [],
      done: false,
      id: 0,
      confirm: {
        title: 'Delete Subjects?',
        contentHtml: 'Doing this will reset all the data including attendance!',
        ok: 'yes',
        cancel: 'no'
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
    onClose: function(type) {
      if(type === "ok")
        this.removeData();
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
    removeData: function() {
      var self = this;
      var updates = {};
      updates['users/' + self.user.uid + '/attendanceLogs'] = null;
      updates['users/' + self.user.uid + '/subjects'] = null;
      updates['users/' + self.user.uid + '/timetable'] = null;
      return Firebase.database().ref().update(updates).then(function() {
        location.reload();
      });
    }
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
