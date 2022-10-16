import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;

    let cardClass = "list-card unselected-list-card";

    const handleDragStart = (event) => {
        event.dataTransfer.setData("song", event.target.id.split('-')[1]);
    }
    const handleDragOver = (event) => {
        event.preventDefault();
    }
    const handleDragEnter = (event) => {
        event.preventDefault();
    }
    const handleDragLeave = (event) => {
        event.preventDefault();
    }
    const handleDrop = (event) => {
        event.preventDefault();
        let target = event.target.id;
        let targetId = target.split('-')[1];
        if (targetId !== "") {
            let sourceId = event.dataTransfer.getData("song");
            // ASK THE MODEL TO MOVE THE DATA
            store.moveSongTransaction(sourceId, targetId);
        }
    }

    const handleEditSongModal = (event) => {
        const id = event.target.id.split("-")[1];
        store.showEditSongModal(id);
    }

    const handleDeleteSong = (event) => {
        const id = event.target.id.split("-")[2];
        store.showDeleteSongModal(id)
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSongModal}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;