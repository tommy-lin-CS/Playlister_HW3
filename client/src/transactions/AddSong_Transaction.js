import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with adding
 * a song. It will be managed by the transaction stack.
 * 
 * @author Tommy Lin
 */

export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore) {
        super();
        this.store = initStore;
    }

    doTransaction() {
        this.store.addNewSongToList();
    }

    undoTransaction() {
        this.store.deleteLastSong();
    }
}