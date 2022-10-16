import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works with deleting
 * a song. It will be managed by the transaction stack.
 * 
 * @author Tommy Lin
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initSongIndex, initSongTitle, initSongArtist, initSongYoutubeId) {
        super();
        this.store = initStore;
        this.songIndex = initSongIndex;
        this.title = initSongTitle;
        this.artist = initSongArtist;
        this.youtubeId = initSongYoutubeId;
    }

    doTransaction() {
        this.store.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.store.addSongGivenAllComponentsOnIndex(this.songIndex, this.title, this.artist, this.youtubeId);
    }
}