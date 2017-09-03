<template>
  <div>
    <h2>Time Table</h2>
    <md-tabs v-if="exist" md-centered>
      <md-tab v-for="object in timetable" :md-label="object.day">
        <div class="existing">
          <div class="card" v-for="subject in object.subjects">
            <div class="card-header">{{ subject }}</div>
          </div>
          <div v-if="object.subjects == null || object.subjects.length == 0" class="no-work">
            <img src="../assets/relax.jpg">
            <h4>It's your day off! Enjoy!</h4>
          </div>
        </div>
      </md-tab>
    </md-tabs>
    <md-tabs md-centered v-if="!exist">
      <md-tab  v-for="day in days" :md-label="day">
        <div class="non-existing">
          <div class="card" v-for="subject in subjects">
            <div class="card-header">{{ subject.name }}</div>
            <div class="card-actions">
              <md-button @click="setTimetable(day, subject)" :id="day + subject.id" >Add</md-button>
            </div>
          </div>
        </div>
      </md-tab>
    </md-tabs>
    <div class="actions">
      <md-button v-if="!exist" class="md-fab md-primary" @click="sendTimetable">
        <md-icon>done</md-icon>
        <md-tooltip md-direction="top">Submit Timetable</md-tooltip>
      </md-button>
      <md-button v-if="!exist" class="md-fab md-primary" @click="resetTimetable">
        <md-icon>delete sweep</md-icon>
        <md-tooltip md-direction="top">Reset Timetable</md-tooltip>
      </md-button>
      <md-button v-if="exist" class="md-fab md-primary" @click="exist = false">
        <md-icon>create</md-icon>
        <md-tooltip md-directoin="left">Edit Timetable</md-tooltip>
      </md-button>
    </div>
  </div>
</template>

<script>
import Firebase from 'firebase'
import MdCardActions from "../../node_modules/vue-material/src/components/mdCard/mdCardActions.vue";
import MdCard from "../../node_modules/vue-material/src/components/mdCard/mdCard.vue";
import MdCardHeader from "../../node_modules/vue-material/src/components/mdCard/mdCardHeader.vue";
import MdTooltip from "../../node_modules/vue-material/src/components/mdTooltip/mdTooltip.vue";
import MdButton from "../../node_modules/vue-material/src/components/mdButton/mdButton.vue";

export default {
  components: {
    MdButton,
    MdTooltip,
    MdCardHeader,
    MdCard,
    MdCardActions},
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      subjects: [],
      exist: false,
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timetable: [
        {
          day: 'Sunday',
          subjects: []
        },
        {
          day: 'Monday',
          subjects: []
        },
        {
          day: 'Tuesday',
          subjects: []
        },
        {
          day: 'Wednesday',
          subjects: []
        },
        {
          day: 'Thursday',
          subjects: []
        },
        {
          day: 'Friday',
          subjects: []
        },
        {
          day: 'Saturday',
          subjects: []
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    setTimetable: function(day, subject) {
      var i=0;
      if(this.timetable[i].day !== day)
        while(this.timetable[i].day !== day)
          i++;
      if(!this.timetable[i].subjects){
        var subjects = [];
        this.timetable[i].subjects = subjects;
      }
      this.timetable[i].subjects.push(subject.name);
      document.getElementById(day + subject.id).setAttribute("disabled", "true");
      document.getElementById(day + subject.id).setAttribute("style", "background-color: #80CBC4");
    },
    sendTimetable: function() {
      var self = this;
      var updates = {};
      updates['/users/' + self.user.uid + '/timetable'] = self.timetable;
      return Firebase.database().ref().update(updates).then(function() {
        self.exist = true;
      })
    },
    resetTimetable: function () {
      var i=0;
      while(i<this.timetable.length){
        if(this.timetable[i].subjects != null)
          this.timetable[i].subjects.length = 0;
        i++;
      }
    }
},
  created() {
    console.log(this.user.uid);
    var self = this;
    return Firebase.database().ref('/users/' + self.user.uid).once('value').then(function(snap) {
      self.subjects = snap.val().subjects;
      var timetable = snap.val().timetable;
      if(timetable){
        self.timetable = timetable;
        self.exist = true;
      }
    })
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/timetable'
</style>
