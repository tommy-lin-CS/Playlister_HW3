/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

router.post('/playlist', PlaylistController.createPlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)
router.delete('/playlist/:id', PlaylistController.deletePlaylist)
router.put('/playlistUpdate/:id', PlaylistController.updatePlaylistById)
router.post('/playlistSongs', PlaylistController.addNewSong)
router.put('/playlistSongDelete/:id', PlaylistController.deleteLastSong)
router.put('/playlistSongEdit', PlaylistController.editSongContent)

module.exports = router