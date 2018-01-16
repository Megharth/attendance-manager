<template>
  <div class="container">
    <div class="dashboard">
      <div class="row">
        <div class="col-sm-4" v-for="subject in subjects" :key="subject.name" :id="subject.name">
          <div class="panel panel-default">
            <div class="panel-heading">
              {{ subject.name }}
            </div>
            <div class="panel-body">
              <span class="percent">{{ subject.percentage }} %</span>
              <md-spinner
                :md-progress = subject.percentage
                :md-size = spinner.size
                :md-stroke = spinner.stroke></md-spinner>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Firebase from 'firebase'
import MdSpinner from "../../node_modules/vue-material/src/components/mdSpinner/mdSpinner.vue";
import MdTheme from "../../node_modules/vue-material/src/core/components/mdTheme/mdTheme.vue";

export default {
  components: {
    MdTheme,
    MdSpinner},
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      subjects: '',
      spinner: {
        size: 150,
        stroke: 5
      }
    }
  },
  methods: {

  },
  created() {
    var self = this;
    return Firebase.database().ref('users/' + self.user.uid).once('value').then(function(snap) {
      self.subjects = snap.val().subjects;
      var attendanceCriteria = snap.val().attendancecriteria;
      console.log(self.subjects);
      var subjects = self.subjects;
      for(var i=0;i<subjects.length;i++){
        subjects[i].percentage = Math.round((subjects[i].attended*100)/subjects[i].total);
        if(subjects[i].percentage < attendanceCriteria){
          console.log(subjects[i].name);
        }
      }
    });

  }
}
</script>

<style lang="sass">
    @import '../sass/dashboard'
</style>
