const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}

getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}

getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}

getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found'})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

updatePlaylistById = async (req, res) => {
    const body = req.body;
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        
        else {
            list.name = body.name
            list.songs = body.songs
            list
                .save()
                .then(() => {
                    return res.status(201).json ({
                        success: true,
                        list: list,
                        message: 'Updated Playlist!'
                    })
                })
                .catch(err => {
                    return res.status(400).json ({
                        err,
                        success: false,
                        message: 'Playlist Could Not Be Updated!'
                    }) 
                })
        }

        // return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}

deletePlaylist = async (req, res) => {
    await Playlist.findByIdAndRemove({ _id: req.params.id },(error, list) => {
        if (error) {
            return res.status(500).json({
                success:false, 
                error: error
            })
        }
        return res.status(200).json({
            success:true, 
            playlist: list
        })
    }).catch(error => console.log(error))
}

addNewSong = async (req,res) => {
    const body = req.body;
    let newSong = {
        title: body.title,
        artist: body.artist,
        youTubeId: body.youTubeId,
    }
    Playlist.findOne({ _id: body.id }, (error, songList) => {
        if (error) {
            return res.status(400).json({ success: false, error: err })
        }
        else {
            songList.songs.splice(body.index, 0, newSong);
            songList
                .save()
                .then(() => {
                    return res.status(200).json ({
                        success: true,
                        songList: songList,
                        message: 'New Song Added!'
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'New Song Not Added!'
                    })
                })
        }
    })
}

deleteLastSong = async (req, res) => {
    const body = req.body;
    await Playlist.findOne({ _id: req.params.id }, (error, songList) => {
        if (error) {
            return res.status(400).json({ success: false, error: err })
        }
        else {
            songList.name = body.name
            songList.songs = body.songs
            songList
                .save()
                .then(() => {
                    return res.status(200).json ({
                        success: true,
                        songList: songList,
                        message: 'Last Song Deleted!'
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Last Song Not Deleted!'
                    })
                })
        }
    })
}

editSongContent = async (req, res) => {
    const body = req.body;
    await Playlist.findOne({ _id: body.id }, (error, songList) => {
        if (error) {
            return res.status(400).json({ success: false, error: err })
        }
        else {
            songList.songs[body.index].title = body.title;
            songList.songs[body.index].artist = body.artist;
            songList.songs[body.index].youTubeId = body.ytid;
            songList
                .save()
                .then(() => {
                    return res.status(200).json ({
                        success: true,
                        songList: songList,
                        message: 'Edit Song Been Saved!'
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Edit Song NOT Saved!'
                    })
                })
        }
    })
}

deleteSong = async (req, res) => {
    const body = req.body;
    await Playlist.findOne({ _id: body.id }, (error, songList) => {
        if (error) {
            return res.status(400).json({ success: false, error: err })
        }
        else {
            songList.songs.splice(body.index, 1);
            songList
                .save()
                .then(() => {
                    return res.status(200).json ({
                        success: true,
                        songList: songList,
                        message: 'Edit Song Been Saved!'
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Edit Song NOT Saved!'
                    })
                })
        }
    })
}

moveSongs = async (req, res) => {
    const body = req.body;
    await Playlist.findOne({ _id: body.id }, (error, songList) => {
        if (error) {
            return res.status(400).json({ success: false, error: err })
        }
        else {
            let oldSong = songList.songs[body.start]; 
            let newSong = songList.songs[body.end];
            songList.songs.splice(body.start, 1, newSong); // MOVEMENT A
            songList.songs.splice(body.end, 1, oldSong) // MOVEMENT B
            songList
                .save()
                .then(() => {
                    return res.status(200).json ({
                        success: true,
                        songList: songList,
                        message: 'Song Has Been Moved!'
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Song Has NOT Been Moved!'
                    })
                })
        }
    })
}

module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    deletePlaylist,
    updatePlaylistById,
    addNewSong,
    deleteLastSong,
    editSongContent,
    deleteSong,
    moveSongs
}