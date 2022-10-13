import { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";

/* This modal is used to confirm that the user deleting a list

    @author Tommy Lin
*/

export default function DeleteListModal () {
    const { store } = useContext(GlobalStoreContext);
    let nameOfList = store.deleteListName
    
    function deleteList(event) {
        document.getElementById("delete-list-modal").classList.remove("is-visible");
        /* DOES DELETION */
    }

    function cancelButton(event) {
        store.hideDeleteListModal();
    }
    
    return (
        <div 
            class="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
            <div class="modal-dialog">
                <div class="dialog-header">
                    Delete the <span>{nameOfList}</span> playlist?
                </div>
                <div class="modal-center">
                    <div class="modal-center-content">
                        Are you sure you wish to permanently delete the <span>{nameOfList}</span> playlist?
                    </div>
                </div>
                <div class="modal-south">
                    <input type="button" 
                        id="delete-list-confirm-button" 
                        class="modal-button" 
                        onClick={deleteList}
                        value='Confirm' />
                    <input type="button" 
                        id="delete-list-cancel-button" 
                        class="modal-button" 
                        onClick={cancelButton}
                        value='Cancel' />
                </div>
            </div>
        </div>
    );
}

