import { useContext } from "react";
import { GlobalStoreContext } from "../store";

/* This modal is used to confirm that the user deleting a song

    @author Tommy Lin
*/

export default function DeleteSongModal () {
    const { store } = useContext(GlobalStoreContext);
    let songName = "";
    if(store.currentList != null && store.deleteSongIndex != null) {
        songName = store.currentList.songs[store.deleteSongIndex].title
    }
    function deleteSong(event) {
        store.deleteSongTransaction();
        store.hideDeleteSongModal();
    }

    function cancelButton(event) {
        store.hideDeleteSongModal();
    }
    
    return (
        <div 
            className="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <div className="dialog-header">
                    Delete the song <span>{songName}</span>?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete the song <span>{songName}</span>?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" 
                        id="delete-list-confirm-button" 
                        className="modal-button" 
                        onClick={deleteSong}
                        value='Confirm' />
                    <input type="button" 
                        id="delete-list-cancel-button" 
                        className="modal-button" 
                        onClick={cancelButton}
                        value='Cancel' />
                </div>
            </div>
        </div>
    );
}
