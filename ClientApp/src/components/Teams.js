import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { TeamSelector } from './TeamSelector'

// Expecting array of players
export const Teams = (params) => {
    const [showHide, setShowHide] = useState(false)
    const [players, setPlayers] = useState(params.settings)
    const [seats, setSeats] = useState([0,0,0,0])   // Store which players sit in which seats

    function handleModalShowHide(isSaving) {
        setShowHide(!showHide)
        if (isSaving) {
            // Rearrange players by seat
            let arranger = []
            for (let i = 0; i < 4; i++) {
                let foundPlayer = players.find((player) => {
                    return player.seat === i
                })
                arranger.push({ ...foundPlayer, playerId: i + 1, teammateIndex: (i + 2) % 4 })
            }
            params.updater(arranger)
        }
        else
            setPlayers(params.settings)
    }

    function findByPlayerId(player, id) {
        return player.playerId == id
    }

    function findBySeatId(player, id) {
        return Number(player.seat) == id
    }

    function manageSeats(playerId, seatId) {
        const seat = Number(seatId)
        let updatePlayers = [...players]
        if (playerId > -1) {
            updatePlayers.find((player) => findByPlayerId(player, playerId)).seat = seat
        }
        else {  // removed player from seat
            updatePlayers.find((player) => findBySeatId(player, seat)).seat = -1
        }
        setPlayers(updatePlayers)
    }

    useEffect(() => {
        console.log(players)
    }, [players])

    return (
        <div>
            <Button variant="primary" onClick={() => handleModalShowHide()}>
                Set Teams
            </Button>

            <Modal show={showHide}>
                <Modal.Header closeButton onClick={() => handleModalShowHide()}>
                    <Modal.Title>Set Teams</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id='Team1' >
                        <h3>Team 1:</h3>
                        <TeamSelector players={players} filter={unassignedPlayers} seat='0' updater={manageSeats} />
                        <TeamSelector players={players} filter={unassignedPlayers} seat='2' updater={manageSeats} />
                    </div><br/>
                    <div id='Team2' >
                        <h3>Team 2:</h3>
                        <TeamSelector players={players} filter={unassignedPlayers} seat='1' updater={manageSeats} />
                        <TeamSelector players={players} filter={unassignedPlayers} seat='3' updater={manageSeats} />
                    </div>
                    <Button disabled='true' >Random</Button>
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

    function unassignedPlayers(player) {
        return player.seat == -1
    }
}