import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'

// Expecting array of button text
export const ButtonsOnlyDecision = (params) => {
    const [showHide, setShowHide] = useState(true)

    function handleModalShowHide(decision) {
        console.log(decision)
        setShowHide(!showHide)
        params.updater(decision)
    }

    return (
        <div>
            <Modal show={showHide}>
                <Modal.Header>
                    {params.title ? params.title : 'Make a Selection'}
                </Modal.Header>
                <Modal.Body>
                    {
                        params.buttons.map((buttonName) => {
                            return <Button onClick={() => handleModalShowHide(buttonName)}>
                                {buttonName}
                            </Button>
                        })
                    }
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>
            </Modal>

        </div>
    )
}