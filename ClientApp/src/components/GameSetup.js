import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'


export const GameSetup = (params) => {
    const [showHide, setShowHide] = useState(false)
    const [loading, setLoading] = useState(true)
    const [gameSettings, setGameSettings] = useState(params.settings)

    function handleModalShowHide(isSaving) {
        setShowHide(!showHide)
        if (isSaving) {
            console.log('updating')
            params.updater(gameSettings)
        }
        else
            setGameSettings(params.settings)
    }

    useEffect(() => {
        setLoading(false)
    }, [gameSettings])

    function handleSettingChange(e) {
        switch (e.target.name) {
            case 'playerCount':
                setGameSettings({ ...gameSettings, playerCount: e.target.value })
                break
            case 'Scoring':
                setGameSettings({ ...gameSettings, scoreTricks: e.target.checked })
                break;
            case 'BiddingHints':
                setGameSettings({ ...gameSettings, biddingHints: e.target.checked })
                break;
            case 'DirtyClubs':
                setGameSettings({ ...gameSettings, dirtyClubs: e.target.checked })
                break;
            case 'DumpDealer':
                setGameSettings({ ...gameSettings, dumpDealer: e.target.checked })
                break;
            case 'NoTrump':
                setGameSettings({ ...gameSettings, noTrump: e.target.checked })
                break;
            case '':
                break;
        }
    }

    useEffect(() => {
        console.log(gameSettings)
    }, [gameSettings])

    return (
        <div>
            <Button variant="primary" onClick={() => handleModalShowHide()}>
                Launch demo modal
            </Button>

            <Modal show={showHide}>
                <Modal.Header closeButton onClick={() => handleModalShowHide()}>
                    <Modal.Title>Pepper Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>
                        Number of players:
                        <select name='playerCount' value={gameSettings.playerCount} onChange={handleSettingChange}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </label><br />
                    <input id='Scoring' name='Scoring' type='checkbox' checked={gameSettings.scoreTricks} onChange={handleSettingChange} />Get what you bid<br />
                    <input id='BiddingHints' name='BiddingHints' type='checkbox' checked={gameSettings.biddingHints} onChange={handleSettingChange} />Bidding hints<br />
                    <input id='DirtyClubs' name='DirtyClubs' type='checkbox' checked={gameSettings.dirtyClubs} onChange={handleSettingChange} />Dirty clubs<br />
                    <input id='DumpDealer' name='DumpDealer' type='checkbox' checked={gameSettings.dumpDealer} onChange={handleSettingChange} />Dump the dealer<br />
                    <input id='NoTrump' name='NoTrump' type='checkbox' checked={gameSettings.noTrump} onChange={handleSettingChange} />No trump (bidder's left leads)<br />
                    {/*pull from storage and map to controls*/}
                    Invite players:<br/>
                    <ul>
                        <input id='Lee' type='checkbox' value='Lee' />
                        <label for='Lee'>Lee</label> <br />
                    </ul>
                    <ul>
                        <input id='Jana' type='checkbox' value='Jana' />
                        <label for='Jana'>Jana</label> <br />
                    </ul>
                    <ul>
                        <input id='Erick' type='checkbox' value='Erick' />
                        <label for='Erick'>Erick</label> <br />
                    </ul>
                    <ul>
                        <input id='Deb' type='checkbox' value='Deb' />
                        <label for='Deb'>Deb</label> <br />
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalShowHide(false)}>
                        Cancel
                </Button>
                    <Button variant="primary" onClick={() => handleModalShowHide(true)}>
                        Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )

}