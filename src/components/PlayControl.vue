<template>
  <dev>
    <q-card style="width: 350px">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div
              v-if="currentFile && currentFile.media.track[0].Title"
              class="text-weight-bold"
            >
              {{ currentFile.media.track[0].Title }}
            </div>
            <div
              v-else-if="currentFile && currentFile.path"
              class="text-weight-bold"
            >
              {{ currentFile.path.name }}
            </div>
            <div v-else class="text-weight-bold">
              None
            </div>
            <div
              v-if="currentMediaInfo && currentMediaInfo.Director"
              class="text-grey"
            >
              {{ currentMediaInfo.Director }}
            </div>
          </div>

          <q-space />

          <q-btn flat round icon="play_arrow" @click="play" />
          <q-btn flat round icon="pause" />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
      </q-card>
  </dev>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'PlayControl',
  data () {
    return {
      currentFile: null
    }
  },
  mounted () {
    ipcRenderer.on('info', (event, file) => {
      this.currentFile = file
    })
    ipcRenderer.send('info')
  },
  methods: {
    play () {
      ipcRenderer.send('control', 'play')
      console.log(this.currentFile)
    }
  }
}
</script>
