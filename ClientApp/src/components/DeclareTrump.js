import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'

// Expecting array of players
export const DeclareTrump = (params) => {
    const [showHide, setShowHide] = useState(true)
    const [suit, setSuit] = useState('Undeclared')

    console.log(params.bidderPosition)
    function handleModalShowHide() {
        setShowHide(!showHide)
        params.updater(suit)
    }

    return (
        <div>
            <Modal show={showHide}>
                <Modal.Header closeButton onClick={() => handleModalShowHide()}>
                    <Modal.Title>{params.bidder}, declare trump</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select
                        onChange={(event) => setSuit(event.target.value)}
                        style={{ textAlign: 'center', width: '50%', display: 'inline-block' }}>
                        <option value='Undeclared' label='No selection' selected />
                        <option value='D' label='Diamonds' />
                        <option value='C' label='Clubs' />
                        <option value='H' label='Hearts' />
                        <option value='S' label='Spades' />
                        <option value='N' label='No Trump' />
                    </select>
                </Modal.Body>

                <Modal.Footer>
                    <Button disabled={suit === 'Undeclared'} variant="primary" onClick={() => handleModalShowHide()}>
                        Declare
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}