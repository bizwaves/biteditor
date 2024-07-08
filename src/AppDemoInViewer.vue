<template>
  <div class="container">
    <vue-infinite-viewer class="viewer">
      <div class="viewport">AA</div>
    </vue-infinite-viewer>
</div>
</template>

<script>
import { VueInfiniteViewer } from "vue3-infinite-viewer";

export default {
  components: {
    VueInfiniteViewer
  },
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 1px solid rgb(149, 0, 255);
  background-color: rgb(93, 176, 230);

}
.viewer {
  position: relative;
  margin-left: 64px;
  margin-top: 64px;
  width: 1200px;
  height: 1000px;
  border: 1px solid blue;
  background-color: rgba(13, 54, 160, 0.951);
}
.viewport {
  position: relative;
  margin-left: 32px;
  margin-top: 32px;
  width: 1800px;
  height: 1800px;
  background: rgba(228, 100, 100, 0.502);
}
</style>