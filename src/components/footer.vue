<template>
  <div>
    <footer class="footer">
      <span>Connect with me</span><br>
      <div class="buttons">
        <md-button class="md-fab md-mini" onclick="window.open('https://plus.google.com/+MegharthLakhataria')">
          <md-avatar>
            <img src="https://github.com/Megharth/attendance-manager/blob/master/docs/static/img/google.0dd54f8.png">
          </md-avatar>
        </md-button>
        <md-button class="md-fab md-mini" onclick="window.open('https://www.facebook.com/megharth.lakhataria')">
          <img src="../assets/facebook.png">
        </md-button>
        <md-button class="md-fab md-mini" onclick="window.open('https://www.instagram.com/megharth_lakhataria/')">
          <md-avatar>
            <img src="../assets/instagram.png">
          </md-avatar>
        </md-button>
        <md-button class="md-fab md-mini" onclick="window.open('https://github.com/Megharth')">
          <md-avatar>
            <img src="../assets/github.png">
          </md-avatar>
        </md-button><br>
      </div>
      <span>{{ copyright }}</span>
    </footer>
  </div>
</template>

<script>
import MdAvatar from "../../node_modules/vue-material/src/components/mdAvatar/mdAvatar.vue";

export default {
  components: {MdAvatar},
  data() {
    return {
      copyright: '©Megharth Lakhataria, 2017',
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/footer'
</style>
