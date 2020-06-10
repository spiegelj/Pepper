import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'

// Only player (or admin?) should be allowed to alter a player
export const Join = (params) => {
    const [showHide, setShowHide] = useState(false)
    const [player, setPlayer] = useState(params.settings)

    function handleModalShowHide(isSaving) {
        setShowHide(!showHide)
        if (isSaving) {
            params.updater(player)
        }
        else
            setPlayer(params.settings)
    }

    function handleSettingChange(e) {
        switch (e.target.name) {
            case 'Name':
                setPlayer({ ...player, name: e.target.value })
                break
            case 'Image':
                setPlayer({ ...player, image: e.target.value })
                break;
            case 'Channel':
                setPlayer({ ...player, channel: e.target.value })
                break;
        }
    }

    useEffect(() => {
    }, [player])

    return (
        <div>
            <Button variant="primary" onClick={() => handleModalShowHide()}>
                Launch user join
            </Button>

            <Modal show={showHide}>
                <Modal.Header closeButton onClick={() => handleModalShowHide()}>
                    <Modal.Title>Join game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Name:  <input id='Name' name='Name' type='text' defaultValue='' onChange={handleSettingChange} /><br />
                    Image:  <input id='Image' name='Image' type='text' defaultValue='' onChange={handleSettingChange} /><br />
                    <input type='file' /><br />
                    Channel:  <input id='Channel' name='Channel' type='text' defaultValue='' onChange={handleSettingChange} /><br />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalShowHide(false)}>
                        Cancel
                </Button>
                    <Button variant="primary" onClick={() => handleModalShowHide(true)}>
                        Join
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )

}