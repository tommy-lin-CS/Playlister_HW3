import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
// import MoveSong_Transaction from '../transactions/MoveSong_Transaction';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    DELETE_SELECTED_LIST: "DELETE_SELECTED_LIST",
    EDIT_SONG_CONTENT: "EDIT_SONG_CONTENT",
    DELETE_SELECTED_SONG: "DELETE_SELECTED_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        deleteListId: null,
        deleteListName: null,
        songIndex: null,
        deleteSongIndex: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,

                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload.id,
                    deleteListName: payload.name
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            // DELETE SELECTED LIST
            case GlobalStoreActionType.DELETE_SELECTED_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter-1,
                    listNameActive: store.listNameActive,
                    deleteListId: payload._id,
                    deleteListName: payload.name
                });
            }
            // EDIT SONG CONTENT
            case GlobalStoreActionType.EDIT_SONG_CONTENT: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    songIndex: payload
                });
            }
            // DELETE SONG
            case GlobalStoreActionType.DELETE_SELECTED_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    deleteSongIndex: payload
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                console.log(playlist._id);
                console.log(playlist);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        // tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                if (pairsArray) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }


/* <---------------------------------------------------------------------------> */
    // THESE FUNCTIONS SERVE AS DELETING LIST

    // MODAL
    store.showDeleteListModal = function (idNamePair) {
        storeReducer({
            type:GlobalStoreActionType.DELETE_SELECTED_LIST,
            payload:idNamePair
        });
        document.getElementById("delete-list-modal").classList.add("is-visible");
    }

    // HIDES MODAL
    store.hideDeleteListModal = function () {
        document.getElementById("delete-list-modal").classList.remove("is-visible");
    }

    // PROCESSES DELETE PLAYLIST 
    store.deletePlaylist = function() {
        async function asyncDeletePlaylist() {
            const response = await api.deletePlaylist(store.deleteListId);
            if (response.data.success) {
                store.loadIdNamePairs();
                storeReducer({
                    type: GlobalStoreActionType.DELETE_SELECTED_LIST,
                    payload: store.deleteListId
                });
            }
            else {
                console.log("API FAILED TO DELETE PLAYLIST");
            }
        }
        asyncDeletePlaylist();
    }

/* <---------------------------------------------------------------------------> */
    // THIS FUNCTION CREATES A NEW PLAYLIST
    store.createNewList = function() {
        async function asynCreateNewList() {
            const name = "Untitled" + (store.idNamePairs.length + 1)
            const songs = []
            const payload = { name, songs }

            const response = await api.createPlaylist(payload);
            if (response.data.success) {
                console.log(response);
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                
                // Get playlist pair response from APIBKEND
                const playlistPairResponse = await api.getPlaylistPairs();
                if(playlistPairResponse.data.success) {
                    let pairs = playlistPairResponse.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairs
                    });
                }
                else {
                    console.log("API GET failed");
                }
            }
            else {
                console.log("API POST failed");
            }
        }
        asynCreateNewList();
        const id = store.idNamePairs[store.idNamePairs.length - 1]._id
        store.setCurrentList(id);
    }
/* <---------------------------------------------------------------------------> */
    // THESE FUNCTIONS ADD A NEW SONG TO THE PLAYLIST WITH TPS
    
    // TPS
    store.addNewSongTransaction = function() {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    // ADDS NEW SONG TO THE PLAYLIST
    store.addNewSongToList = function() {
        async function asyncAddNewSongToList() {
            let id = store.currentList._id;
            let newSong = {
                id : store.currentList._id,
                title: "Untitled",
                artist: "Unknown",
                youTubeId: "dQw4w9WgXcQ",
                index: store.currentList.songs.length
            }
            store.currentList.songs.push(newSong);
            let response = await api.addNewSong(newSong);
            if(response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + id)
            }

        }
        asyncAddNewSongToList();
    }
/* <---------------------------------------------------------------------------> */
    // THESE FUNCTIONS DELETE SONGS FROM THE PLAYLIST

    // DELETES THE LAST SONG IN THE CURRENT LIST
    store.deleteLastSong = function() {
        async function asyncDeleteLastSong() {
            let id = store.currentList._id;
            store.currentList.songs.pop()
            let response = await api.deleteLastSong(id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + id);
            }
            else {
                console.log("Cannot Delete Last Song!");
            }

        }
        asyncDeleteLastSong();
    }
/* <---------------------------------------------------------------------------> */
    // THESE FUNCTIONS EDIT THE CONTENT OF A SONG

    // SHOWS THE EDIT MODAL
    store.showEditSongModal = function(id) {
        document.getElementById("form-song-title").value = store.currentList.songs[id].title;
        document.getElementById("form-song-artist").value=store.currentList.songs[id].artist;
        document.getElementById("form-song-ytid").value=store.currentList.songs[id].youTubeId;

        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG_CONTENT,
            payload: id
        })
        document.getElementById("edit-song-modal").classList.add("is-visible");
    }

    store.editSongTransaction = function(newTitle, newArtist, newYtid) {
        let oldSong = store.currentList.songs[store.songIndex];
        let oldTitle = oldSong.title;
        let oldArtist = oldSong.artist;
        let oldYtid = oldSong.youTubeId;

        let transaction = new EditSong_Transaction(store, store.songIndex, oldTitle, oldArtist, oldYtid,
                                                    newTitle, newArtist, newYtid);
        tps.addTransaction(transaction);
    }

    store.addSongGivenAllComponentsOnIndex = function(index, title, artist, youTubeId) {
        async function asyncAddSongGivenAllComponentsOnIndex() {
            let song = {
                id: store.currentList._id,
                index,
                title,
                artist,
                youTubeId
            }
            console.log(song.ytid);
            const response = await api.addNewSong(song);
            if (response.data.success) {
                store.setCurrentList(store.currentList._id);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: response.data.list
                });
            }
            else {
                console.log("Cannot Edit Song Content!");
            }
        }
        asyncAddSongGivenAllComponentsOnIndex();
    }


    store.editSongContent = function(index, title, artist, ytid) {
        async function asyncEditSongContent() {
            let song = {
                id: store.currentList._id,
                index,
                title,
                artist,
                ytid
            }
            const response = await api.editSongContent(song);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: response.data.list
                });
            }
            else {
                console.log("Cannot Edit Song Content!");
            }
        }
        asyncEditSongContent();
    }
/* <---------------------------------------------------------------------------> */
    // THESE FUNCTIONS SERVE TO DELETE A SONG IN A PLAYLIST

    // SHOWS DELETE SONG MODAL
    store.showDeleteSongModal = function(id) {
        storeReducer({
            type: GlobalStoreActionType.DELETE_SELECTED_SONG,
            payload: id
        })
        document.getElementById("delete-song-modal").classList.add("is-visible");
    }

    // TPS
    store.deleteSongTransaction = function() {
        let title = store.currentList.songs[store.deleteSongIndex].title;
        let artist = store.currentList.songs[store.deleteSongIndex].artist;
        let ytid = store.currentList.songs[store.deleteSongIndex].youTubeId;
        let transaction = new DeleteSong_Transaction(store, store.deleteSongIndex, title, artist, ytid);
        tps.addTransaction(transaction);
    }
    
    // PERFORMS DELETE SONG
    store.deleteSong = function(songIndex) {
        async function asyncDeleteSong() {
            let song = {
                id: store.currentList._id, 
                index: songIndex};
            let response = await api.deleteSong(song);
            console.log(response);
            if (response.data.success) {
                store.setCurrentList(store.currentList._id);
                // store.currentList.songs = response.data.songList.songs;
                // storeReducer({
                //     type: GlobalStoreActionType.SET_CURRENT_LIST,
                //     payload: store.currentList
                // });
                
                // store.history.push("/playlist/" + song.id);
            }
            else {
                console.log("Cannot Delete Song!");
            }
            console.log(store.currentList)
        }
        
        asyncDeleteSong(); 
    }   

/* <---------------------------------------------------------------------------> */



    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}