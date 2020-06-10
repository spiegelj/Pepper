import React, { useState, useEffect, useContext } from 'react'

import { PepperContext } from './PepperContext'
import { Card } from './Card'

// player, updatePlay - playing surface updater, updatePlayers
export const PlayerHand = (params) => {
	const [player, setPlayer] = useState(params.player)
	const [pepperState, setPepperState] = useContext(PepperContext)

	function playCard(cardAbbreviation) {
		const active = (
			(pepperState.pepperGameState.gamePhase == 4 // trading cards
				&& (pepperState.pepperBidState.winningBidder == params.playersIndex	// bidder or partner
					|| pepperState.pepperBidState.winningBidder == pepperState.pepperPlayers[params.playersIndex].teammateIndex)
				&& player.cards.length == 6	// hasn't already picked a card to trade
			)
			||
			(pepperState.pepperGameState.gamePhase == 5 // playing
				&& pepperState.pepperGameState.currentPlayerIndex == params.playersIndex)	// this player is up
		)

		if (!active)
			return

		let hand = { ...player }
		const cardIndex = hand.cards.findIndex((card) => findCard(card, cardAbbreviation))

		const validPlay = params.updatePlay(hand.cards[cardIndex], params.playersIndex)
			

		function findCard(card, cardAbbreviation) {
			return card === cardAbbreviation
		}

		// remove card from player's hand
		if (validPlay)
			hand.cards.splice(cardIndex, 1)
		// need callback to update player
	}

	// Active
	// Bidding
	// Selecting Card
	// Inactive	
	function GetPlayerState() {
		let stateColor = 'white'
		switch (pepperState.pepperGameState.gamePhase) {
			case 0:	// preplay
				stateColor = 'white'
				break
			case 1:	// bidding
				if (pepperState.pepperBidState.bidder === Number(params.playersIndex))
					stateColor = '#ccff66'
				break
			case 2: // declaring trump
				if (pepperState.pepperBidState.winningBidder === Number(params.playersIndex))
					stateColor = '#ccff66'
				else
					stateColor = 'gray'
				break
			case 3: // staying or not
				if (Number(params.playersIndex) !== pepperState.pepperBidState.winningBidder
					&& pepperState.pepperPlayers[params.playersIndex].teammateIndex !== pepperState.pepperBidState.winningBidder
				)
					stateColor = '#ccff66'
				else
					stateColor = 'gray'
				break
			case 4: // swapping cards
				if (Number(params.playersIndex) === pepperState.pepperBidState.winningBidder
					|| pepperState.pepperPlayers[params.playersIndex].teammateIndex === pepperState.pepperBidState.winningBidder
				)
					stateColor = '#ccff66'
				else
					stateColor = 'gray'
				break
			case 5:	// playing
				if (Number(params.playersIndex) === Number(pepperState.pepperGameState.currentPlayerIndex))
					stateColor = '#ffff80'
				else if (pepperState.pepperBidState.winningBidder === pepperState.pepperPlayers[params.playersIndex].teammateIndex)
					stateColor = 'gray'
				break
		}
		return stateColor
	}

	return <div style={{ minHeight: '100%', backgroundColor: GetPlayerState() }}>
		<b>{pepperState.pepperPlayers[params.playersIndex].name}</b>
		(Index: {params.playersIndex}
		PlayerId: {pepperState.pepperPlayers[params.playersIndex].playerId}
		Teammate: {pepperState.pepperPlayers[params.playersIndex].teammateIndex})
		<br />
		{player.cards.map((card) => {
			return <Card card={card} action={playCard} />
		}
		)}
	</div>
}