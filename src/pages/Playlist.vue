<template>
  <div class="q-ma-md">
    <q-table
      :data="playlist"
      :columns="columns"
      selection="multiple"
      :selected.sync="selected"
      :rows-per-page-options="[10, 20, 0]"
      :pagination.sync="pagination"
      row-key="index"
    >
      <template v-slot:top>
        <div>Playlist</div>
        <q-space />
        <div>
          <q-btn class="q-mx-sm" round size="sm" icon="add" @click="$refs.file.pickFiles()"></q-btn>
          <q-btn round size="sm" icon="delete" @click="del"></q-btn>
        </div>
      </template>

      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          <div>{{ props.row.index + 1 }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-size="props">
        <q-td :props="props">
          <div>{{ bytes(props.row.size) }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn round size="sm" icon="play_arrow" @click="play(props.row.index)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <q-file v-show="false" multiple ref="file" accept='.mp4, video/*, audio/*' @input="plus"></q-file>
  </div>
</template>

<script>
import { format } from 'quasar'
import { ipcRenderer } from 'electron'
const db = require('electron').remote.getGlobal('db')

export default {
  data () {
    return {
      selected: [],
      pagination: {
        sortBy: 'index',
        descending: false
      },
      columns: [
        { name: 'index', align: 'center', label: 'No', field: 'index', sortable: true },
        { name: 'name', align: 'center', label: 'name', field: 'name' },
        { name: 'path', align: 'center', label: 'Path', field: 'path' },
        { name: 'size', align: 'center', label: 'Size', field: 'size' },
        { name: 'type', align: 'center', label: 'Type', field: 'type' },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
      ],
      playlist: []
    }
  },
  mounted () {
    this.loadDb()
  },
  methods: {
    async plus (files) {
      files.forEach(async (file) => {
        this.playlist.push(file)
      })
      await this.fileIdx()
      this.deleteDb()
      this.insertDb(this.playlist)
    },
    async del () {
      this.selected.forEach(async (file) => {
        const idx = this.playlist.indexOf(file)
        this.playlist.splice(idx, 1)
      })
      await this.fileIdx()
      await this.deleteDb()
      this.insertDb(this.playlist)
      this.selected = []
    },
    bytes (size) {
      return format.humanStorageSize(size)
    },
    play (id) {
      const idx = this.playlist[id].index
      ipcRenderer.send('play', idx)
    },
    fileIdx () {
      this.playlist.forEach((file, idx) => {
        file.index = idx
      })
    },
    async loadDb () {
      const result = await db.find({})
      this.playlist = result
    },
    async insertDb (data) {
      const result = await db.insert(data)
      console.log(result)
    },
    async deleteDb () {
      const result = await db.remove({}, { multi: true })
      console.log(result)
    }
  }
}
</script>
