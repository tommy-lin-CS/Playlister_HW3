import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAddNewSong() {
        store.addNewSongTransaction();
    }
    

    // FOOLPROOF
    store.hasUndo();
    store.hasRedo();
    let undoStatus = false; // UNDO BUTTON
    let redoStatus = false; // REDO BUTTON
    let editStatus = false; // ADD AND DELETE BUTTON
    
    // CHECKS IF THERE IS A CURRENT LIST OPENED
    if(store.currentList == null) {
        undoStatus = true;
        redoStatus = true;
        editStatus = true;
    }

    if(!store.hasUndoTransactions) {
        undoStatus = true;
    }

    if(!store.hasRedoTransactions) {
        redoStatus = true;
    }

    if(store.modalOpen) {
        undoStatus = true;
        redoStatus = true;
        editStatus = true;
    }

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddNewSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={undoStatus}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={redoStatus}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;