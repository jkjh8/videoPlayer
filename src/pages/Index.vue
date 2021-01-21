<template>
  <q-page class="flex flex-center">
    <VideoPlayer></VideoPlayer>
  </q-page>
</template>

<script>
import { ipcRenderer } from 'electron'
import VideoPlayer from '../components/VideoPlayer'

export default {
  name: 'PageIndex',
  components: { VideoPlayer },
  mounted () {
    ipcRenderer.on('error', (event, msg) => {
      this.$q.notify({
        message: msg,
        timeout: 2000
      })
    })
  }
  //   navigator.mediaDevices.enumerateDevices().then((devices) => {
  //     const audioDevices = devices.filter(device => device.kind === 'audiooutput')
  //     ipcRenderer.send('audioDevices', { audiodevices: audioDevices })
  //   })
  //   const audioDevices = devices.filter(device => device.kind === 'audiooutput')
  //   await this.$refs.mediaplayer.$media.setSinkId(audioDevices[4].deviceId)
  // }
}
</script>
