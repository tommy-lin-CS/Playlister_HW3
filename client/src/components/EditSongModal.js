import { useContext } from "react";
import { GlobalStoreContext } from "../store";

/** 
 * This modal is used to edit the contents of a song
 * 
 * @author Tommy Lin
**/

export default function EditSongModal () {
    const { store } = useContext(GlobalStoreContext);

    function editSongConfirm(event) {
        let title = document.getElementById("form-song-title").value;
        let artist = document.getElementById("form-song-artist").value;
        let ytid = document.getElementById("form-song-ytid").value;
        store.editSongTransaction(title, artist, ytid);
        store.hideEditSongModal();
    }

    function cancelButton(event) {
        store.hideEditSongModal();
    }
    
    return (
        <div className="modal" id="edit-song-modal" data-animation="slideInOutLeft">
            <div className="modal-root" id="edit-song-content">
                <div className="modal-north">
                    Edit song
                </div>
                <div className="modal-center">
                    <div className="modal-edit-song">
                        <div>
                            <span>Title: </span>
                            <input id="form-song-title" type="text" className="modal-song-content-input" />
                        </div>
                        <div>
                            <span>Artist: </span>
                            <input id="form-song-artist" type="text" className="modal-song-content-input" />
                        </div>
                        <div>
                            <span>YouTube Id: </span>
                            <input id="form-song-ytid" type="text" className="modal-song-content-input" />
                        </div>
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" 
                        id="edit-song-confirm-button" 
                        onClick={editSongConfirm}
                        className="song-modal-button" 
                        value='Confirm' />
                    <input type="button" 
                        id="edit-song-cancel-button" 
                        onClick={cancelButton}
                        className="song-modal-button" 
                        value='Cancel' />
                </div>
            </div>
        </div>
    );
}

