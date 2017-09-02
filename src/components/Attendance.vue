<template>
  <div>
    <h2>{{ timetable.day }}</h2>
    <md-card v-for="subject in timetable.subjects" :id="subject">
      <md-card-header>{{ subject }}</md-card-header>
      <md-card-actions>
        <md-button class="md-fab md-primary md-small">
          <md-icon>done</md-icon>
          <md-tooltip md-direction="left" @click="attended(subject)">Attend</md-tooltip>
        </md-button>
        <md-button class="md-fab md-warn md-small">
          <md-icon>clear</md-icon>
          <md-tooltip md-direction="right">Bunk</md-tooltip>
        </md-button>
        <md-button class="md-fab" v-if="attend || bunk">
          <md-icon>undo</md-icon>
          <md-tooltip>Undo</md-tooltip>
        </md-button>
      </md-card-actions>
    </md-card>
    <div v-if="holiday" class="no-work">
      <img src="../assets/relax.jpg">
      <h4>It's your day off! Enjoy!</h4>
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
        attend: false,
        bunk: false,
        holiday: false
      }
    },
    methods: {

    },
    computed: {
      attended: function(subject){
        var i=0;
        while(subjects[i].name != subject)
          i++;
        console.log(subjects[i].name);
        subjects[i].attended++;
        subjects[i].total++;
      }
    },
    created() {
      var self = this;
      var day = new Date().getDay();
      this.day = day;
      console.log(day);
      return Firebase.database().ref('users/' + self.user.uid).once('value').then(function(snap) {
        self.timetable = snap.val().timetable[self.day];
        self.subjects = snap.val().subjects;
        if(!self.timetable.subjects){
          self.holiday = true;
        }
      });

    }
  }
</script>

<style lang="sass">
  @import '../sass/Attendance'
</style>
