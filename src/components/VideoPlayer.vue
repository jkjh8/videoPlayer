<template>
  <div>
    <div>
      <q-media-player
        type="video"
        ref="mediaplayer"
        background-color="black"
        :autoplay="autoplay"
        :show-big-play-button="false"
        :sources="sources"
        :bottom-controls="false"
        :hide-settings-btn="true"
        :show-spinner="false"
        preload="auto"
        track-language="Korean"
        @error="errorEvent"
        @showControls="showControl"
        @ended="onEnded"
      >
      </q-media-player>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
const mainWindow = require('electron').remote.getCurrentWindow()
// import path from 'path'

export default {
  data () {
    return {
      sources: [
        {
          src: 'http://localhost:8082/test?file=C:\\Users\\jkjh8\\Videos\\1.mp4'
        }
      ],
      deviceInfo: [],
      autoplay: false
    }
  },
  async mounted () {
    ipcRenderer.on('file', async (event, file, autoplay) => {
      // this.$refs.mediaplayer = null
      // const file = await new File([data], filePath.base)
      console.log(file)
      // this.sources = [{ src: URL.createObjectURL(file), type: file.type }]
      this.sources = [{ src: `http://localhost:8082/test?file=${file}` }]
      this.autoplay = autoplay
    })
    this.$refs.mediaplayer.setFullscreen()
  },
  methods: {
    openFile (file) {
      console.log(file)
      this.video.sources = [{ src: URL.createObjectURL(file), type: 'video/mp4' }]
    },
    onEnded () {
      console.log('end')
    },
    errorEvent (e) {
      console.log(e)
    },
    showControl () {
      if (mainWindow.isFullScreen()) {
        this.$refs.mediaplayer.hideControls()
      }
    }
  }
}
</script>
