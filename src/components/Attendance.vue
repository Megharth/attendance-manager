<template>
  <div class="container-fluid">
    <h2>{{ timetable.day }}</h2>
    <md-dialog-confirm
      :md-title="confirm.title"
      :md-content-html="confirm.contentHtml"
      :md-ok-text="confirm.ok"
      :md-cancel-text="confirm.cancel"
      ref="confirm"
      @close="onClose"
    >
    </md-dialog-confirm>
    <div v-if="!attendanceDone">
      <div class="card" v-for="subject in timetable.subjects" :id="subject">
        <div class="card-header">{{ subject }}</div>
        <div class="card-actions">
          <md-button class="md-fab md-primary md-mini" :id="subject + '-attend'" @click="attended(subject)">
            <md-icon>done</md-icon>
            <md-tooltip md-direction="left">Attend</md-tooltip>
          </md-button>
          <md-button class="md-fab md-warn md-mini" :id="subject + '-bunk'" @click="bunked(subject)">
            <md-icon>clear</md-icon>
            <md-tooltip md-direction="right">Bunk</md-tooltip>
          </md-button>
          <md-button class="md-fab md-mini" :id="subject + '-undo'" @click="undo(subject)" disabled>
            <md-icon>undo</md-icon>
            <md-tooltip>Undo</md-tooltip>
          </md-button>
        </div>
      </div>
    </div>
    <div v-if="attendanceDone" class="submitted">
      <h1>You have submitted today's attendance!</h1>
    </div>
    <div v-if="holiday" class="no-work">
      <img src="../assets/relax.jpg">
      <h4>It's your day off! Enjoy!</h4>
    </div>
    <div class="actions" v-if="!holiday && !attendanceDone">
      <md-button class="md-fab md-primary" @click="openDialog('confirm')">
        <md-icon>done</md-icon>
        <md-tooltip md-direction="top">Submit Attendance</md-tooltip>
      </md-button>
    </div>
  </div>
</template>

<script>
  import Firebase from 'firebase'
  import MdCardHeader from "../../node_modules/vue-material/src/components/mdCard/mdCardHeader.vue"
  import MdCardActions from "../../node_modules/vue-material/src/components/mdCard/mdCardActions.vue"
  import MdButton from "../../node_modules/vue-material/src/components/mdButton/mdButton.vue"
  import MdIcon from "../../node_modules/vue-material/src/components/mdIcon/mdIcon.vue"
  import MdTooltip from "../../node_modules/vue-material/src/components/mdTooltip/mdTooltip.vue"

  export default {
    components: {
      MdTooltip,
      MdIcon,
      MdButton,
      MdCardActions,
      MdCardHeader},
    props: {
      user: {
        type: Object
      }
    },
    data() {
      return {
        day: '',
        timetable: '',
        subjects: '',
        holiday: false,
        attendanceDone: false,
        confirm: {
          title: 'Send data?',
          contentHtml: 'Once you have submitted the attendance it cannot be edited again. Do you want to proceed?',
          ok: 'yes',
          cancel: 'no'
        }
      }
    },
    methods: {
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onClose: function(type) {
        if(type === "ok")
          this.sendAttendance();
      },
      attended: function(subject){
        var i=0;
        while(this.subjects[i].name !== subject)
          i++;
        this.subjects[i].attended++;
        this.subjects[i].total++;
        console.log(subject + "attended:" + this.subjects[i].attended);
        console.log(subject + "total:" + this.subjects[i].total);
        document.getElementById(subject + '-attend').setAttribute("disabled", "true");
        document.getElementById(subject + '-attend').setAttribute("attended", "true");
        document.getElementById(subject + '-bunk').setAttribute("disabled", "true");
        document.getElementById(subject + '-undo').removeAttribute("disabled");
      },
      bunked: function(subject){
        var i=0;
        while(this.subjects[i].name !== subject)
          i++;
        this.subjects[i].total++;
        console.log(subject + "total:" + this.subjects[i].total);
        document.getElementById(subject + '-attend').setAttribute("disabled", "true");
        document.getElementById(subject + '-bunk').setAttribute("disabled", "true");
        document.getElementById(subject + '-bunk').setAttribute("disabled", "true");
        document.getElementById(subject + '-undo').removeAttribute("disabled");
      },
      undo: function(subject){
        var i=0;
        while(this.subjects[i].name !== subject)
          i++;
        this.subjects[i].total--;
        if(document.getElementById(subject + '-attend').getAttribute("attended")){
          this.subjects[i].attended--;
          document.getElementById(subject + '-attend').removeAttribute("attended");
        }
        console.log(subject +"attended:" + this.subjects[i].attended);
        console.log(subject + "total:" + this.subjects[i].total);
        document.getElementById(subject + '-attend').removeAttribute("disabled");
        document.getElementById(subject + '-bunk').removeAttribute("disabled");
        document.getElementById(subject + '-undo').setAttribute("disabled", "true");
      },
      sendAttendance: function() {
        var day = new Date();
        var date = day.getDate();
        var month = day.getMonth();
        var year = day.getFullYear();
        var fullDate = year + '/' + month + '/' + date;

        var self = this;
        var updates = {};
        var path = '/users/' + self.user.uid + '/attendanceLogs/' + fullDate;
        updates['/users/' + self.user.uid + '/subjects'] = this.subjects;
        updates[path + '/'] = self.subjects;
        console.log(updates);
        return Firebase.database().ref().update(updates).then(function() {
          Firebase.database().ref(path + '/attendanceDone').set(true);
          self.attendanceDone = true;
        });
      }
    },
    created() {
      var self = this;
      var day = new Date();
      this.day = day.getDay();
      return Firebase.database().ref('users/' + self.user.uid).once('value').then(function(snap) {
        var date = day.getDate();
        var month = day.getMonth();
        var year = day.getFullYear();

        self.timetable = snap.val().timetable[self.day];
        self.subjects = snap.val().subjects;
        if(!self.timetable.subjects){
          self.holiday = true;
        }
        var attendanceDone = snap.val().attendanceLogs[year][month][date].attendanceDone;
        if(attendanceDone)
          self.attendanceDone = attendanceDone;
      });

    }
  }
</script>

<style lang="sass">
  @import '../sass/Attendance'
</style>
