<template>
  <dev>
    <q-card style="width: 350px">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div
              v-if="currentMediaInfo && currentMediaInfo.Title"
              class="text-weight-bold"
            >
              {{ currentMediaInfo.Title }}
            </div>
            <div v-else class="text-weight-bold">
              {{ currentFile }}
            </div>
            <div
              v-if="currentMediaInfo && currentMediaInfo.Director"
              class="text-grey"
            >
              {{ currentMediaInfo.Director }}
            </div>
          </div>

          <q-space />

          <q-btn flat round icon="play_arrow" />
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
      currentMediaInfo: null,
      currentFile: {
        name: 'None'
      }
    }
  },
  mounted () {
    ipcRenderer.on('info', (event, mediainfo) => {
      console.log(mediainfo)
      // this.currentMediaInfo = mediainfo
      // this.currentFile = filePath
    })
  }
}
</script>
