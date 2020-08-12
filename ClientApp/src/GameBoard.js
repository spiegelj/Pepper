import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap'

import { PepperContext } from './components/PepperContext'
import { createDeck, cardValues, cardSuits, deal, shuffle, ping } from './Api'
import { GameSetup } from './components/GameSetup'
import { Join } from './components/Join'
import { Teams } from './components/Teams'
import { PlayerHand } from './components/PlayerHand'
import { Card } from './components/Card'
import { BiddingControl } from './components/BiddingControl'
import { BidType, findBid } from './models/BidType'
import { DeclareTrump } from './components/DeclareTrump'
import { ButtonsOnlyDecision } from './components/ButtonsOnlyDecision'
import { Scoreboard } from './components/Scoreboard'
// Thanks to Adrian Kennard for card images!  https://www.me.uk/cards/

export const GameBoard = () => {
	const [pepperState, setPepperState] = useContext(PepperContext)		// Pretty much the master context

	const [players, setPlayers] = useState()
	const [loading, setLoading] = useState(true)
	const [gameSettings, setGameSettings] = useState({
		playerCount: 4,
		scoreTricks: true,
		biddingHints: true,
		dirtyClubs: true,
		dumpDealer: true,
		noTrump: true
	})
	const [player, setPlayer] = useState({	// Placeholder for generating rough functionality.  Link into specific elements of players?
		name: '',
		image: '',
		channel: ''
	})
	const [cardsInPlay, setCardsInPlay] = useState([])
	const [scoring, setScoring] = useState(ResetScores())

	const [playersLoaded, setPlayersLoaded] = useState(false)
	const [gameState, setGameState] = useState(initializeBoard())

	const [bidderPosition, setBidderPosition] = useState({ position: 'fixed', top: '33%', left: '33%', opacity: '1' })
	const [bidState, setBidState] = useState({
		isBidding: false,
		highestBid: 'pass',
		highestPoints: 0,
		winningBidder: 0,
		bidder: 0,
		dealer: 0,
		opponentStayed: true
	})


	let finalizedPlayers = []
	let deckVar = []	//shuffle(loadDeck(4))
	let playersVar = []	//initializePlayers()

	async function loadGame() {
		
		playersVar = await initializePlayers()
		deckVar = await loadDeck(4)
		setPlayers(playersVar)
		setLoading(false)
	}

	useEffect(() => {
		loadGame()
	}, [playersLoaded])

	// Maintain the shared state as game is set up and played.
	useEffect(() => {
		setPepperState({ ...pepperState, pepperPlayers: players, pepperGameState: gameState, pepperBidState: bidState, pepperScoring: scoring })

	}, [players, gameState, bidState, scoring])

	function loadDeck(playerCount) {
		let cardsInDeck = ''
		const valueCount = (playerCount === 3 ? 5 : 6)

		for (let v = 0; v < valueCount; v++)
			for (let s = 0; s < cardSuits.length; s++) {
				cardsInDeck = cardsInDeck.concat(cardsInDeck.length > 0 ? ',' : '').concat(cardValues[v].abbreviation).concat(cardSuits[s].abbreviation)
			}

		const requestedDeck = /*await*/ createDeck(cardsInDeck)
		return requestedDeck
	}

	function initializePlayers() {
		return [
			{
				playerId: 1,
				name: 'Erick',	//'#Open# 1',
				image: './cards/AD.svg',
				teammateIndex: 2,
				team: 0,
				seat: 0,
				cards: []
			},
			{
				playerId: 2,
				name: 'Jana',	//'#Open# 2',
				image: './cards/AC.svg',
				teammateIndex: 3,
				team: 1,
				seat: 1,
				cards: []
			},
			{
				playerId: 3,
				name: 'Lee',	//'#Open# 3',
				image: './cards/AH.svg',
				teammateIndex: 0,
				team: 0,
				seat: 2,
				cards: []
			},
			{
				playerId: 4,
				name: 'John',	//'#Open# 4',
				image: './cards/AS.svg',
				teammateIndex: 1,
				team: 1,
				seat: 3,
				cards: []
			}
		]
	}

	function initializeBoard() {
		return {
			gamePhase: 0,	// Setup, Bidding, Declaring, Playing, cleanup, scoring?
			dealer: 0,
			bidder: 0,
			player: 0,
			currentBid: 0,
			currentPlayerIndex: 0,
			trump: null,		// Hearts, Diamonds, Spades, Clubs, no -- have a trump indicator
			currentTrick: 1,	// could be inferred from cards in hands>
			suitLed: null,
			scores:  [0, 0, 0]
		}
	}

	function ResetScores() {
		return {
			teams: [
				{
					gameScore: 0,
					currentTricks: 0
				},
				{
					gameScore: 0,
					currentTricks: 0
				}
			]
		}
	}

	// Callback functions
	// to be used when admin values have been updated (probably by GameSetup)
	const adminSet = (settings) => {
		setGameSettings(settings)
	}

	// Refresh player info.  Could be both in player setup and updating their cards
	const playersUpdate = (playerSelections) => {
		setPlayers(playerSelections)
	}


	const playCard = (card, sourcePlayer) => {
		let inPlay = [...cardsInPlay]
		inPlay.push({ card: card, source: sourcePlayer })

		let gameUpdate = { ...gameState }
		if (inPlay.length == 1) {
			gameUpdate.suitLed = card.substring(card.length - 1)	// most likely
			// check if it was the left
			if (card.substring(0, 1) == 'J'
				&& MatchedColorSuit(gameUpdate.trump.substring(0, 1)) == card.substring(card.length - 1))
				gameUpdate.suitLed = gameUpdate.trump.substring(0, 1)
		}

		const ledSuitCards = CardsInSuit(gameUpdate.suitLed, gameState.trump.substring(0,1))
		// Check if is a valid play
		if (gameUpdate.gamePhase == 5 && inPlay.length > 1) {
			if (ledSuitCards.search(card) == -1) {
				// Didn't follow suit.  Check if player could...
				const couldveFollowedSuit = players[sourcePlayer].cards.reduce(HasSuit, false)
				if (couldveFollowedSuit) {
					alert('You must follow suit!')
					inPlay.pop()
					return
				}
			}
		}

		// Play was valid--update that.
		setCardsInPlay(inPlay)

		if (inPlay.length == 3) {	// last card played
			const winner = ScoreTrick(inPlay)
			alert(`${players[winner].name} won the trick.`)

			// reset for next trick
			setCardsInPlay([])
			gameUpdate.currentTrick++
			gameUpdate.currentPlayerIndex = Number(winner)
			if (gameUpdate.currentTrick > 6) {
				// score hand and check game score
				const gameOver = ScoreHand(false)

				if (gameOver == -1) {	//still playing
					gameUpdate = PrepareNextHand({...gameUpdate})
					DealCards()
				}
				else {
					alert(`Team ${gameOver + 1} has won!`)
				}
			}
		}
		else {
			gameUpdate.currentPlayerIndex = (gameUpdate.currentPlayerIndex + 1) % 4
			if (gameUpdate.currentPlayerIndex == players[bidState.winningBidder].teammateIndex) {
				gameUpdate.currentPlayerIndex = (gameUpdate.currentPlayerIndex + 1) % 4
			}
		}
		setGameState(gameUpdate)

		return true	// getting this far, we assume it was a valid play
		function HasSuit(exists, checkCard) {
			const sought = ledSuitCards.search(checkCard) > -1
			return exists || sought
		}

	}

	function PrepareNextHand(game) {
		game.gamePhase = 1
		game.dealer = (game.dealer + 1) % 4
		game.currentTrick = 0
		game.bidder = (game.dealer + 1) % 4
		game.currentPlayerIndex = game.bidder
		game.trump = null

		let scoringUpdate = { ...scoring }
		scoringUpdate.teams[0].currentTricks = 0
		scoringUpdate.teams[1].currentTricks = 0
		setScoring(scoringUpdate)

		setBidState({
			...bidState,
			isBidding: true,
			highestBid: 'pass',
			highestPoints: 0,
			winningBidder: 0,
			bidder: game.bidder,
			dealer: game.dealer
		})

		return game
	}

	function GetLeftBower(suit) {
		switch (suit) {
			case 'D':
				return 'JH'
				break
			case 'H':
				return 'JD'
				break
			case 'C':
				return 'JS'
				break
			case 'S':
				return 'JC'
				break
		}
	}

	function MatchedColorSuit(suit) {
		switch (suit) {
			case 'D':
				return 'H'
				break
			case 'H':
				return 'D'
				break
			case 'C':
				return 'S'
				break
			case 'S':
				return 'C'
				break
		}
	}

	// using some no-harm-no-foul.  If no-trump then the trump ranking will be non-existent cards (JN, QN), so never found.  Similarly, if the Jack of the 
	// led suit is the left bower, it will be found in its earlier position.
	function RankCard(card, trump, led) {
		let leftBower = GetLeftBower(trump.substring(trump.length-1))
		
		const rank = ('J%leftA%K%Q%10%9%'.replace(/%/g, trump).replace('left', leftBower) + 'A%K%Q%J%10%9%'.replace(/%/g, led)).search(card)
		return rank > -1 ? rank : 100
		
	}

	function CardsInSuit(suit, trump) {
		let possibilities = ''
		if (suit === trump)
			possibilities = ('J%' + GetLeftBower(suit) + 'A%K%Q%10%9%').replace(/%/g, suit)
		else if (suit === MatchedColorSuit(suit))	// suit's Jack belongs to the same-color suit as the left bower
			possibilities = ('A%K%Q%10%9%').replace(/%/g, suit)
		else
			possibilities = 'A%K%Q%J%10%9%'.replace(/%/g, suit)

		return possibilities
	}

	function ScoreTrick(inPlay) {
		const led = inPlay[0].card.substring(inPlay[0].card.length - 1)
		const trump = gameState.trump.substring(0, 1)
		let winner = -1

		if (RankCard(inPlay[0].card, trump, led) < RankCard(inPlay[1].card, trump, led))
			if (RankCard(inPlay[0].card, trump, led) < RankCard(inPlay[2].card, trump, led))
				winner = inPlay[0].source
			else
				winner = inPlay[2].source
		else if (RankCard(inPlay[1].card, trump, led) < RankCard(inPlay[2].card, trump, led))
			winner = inPlay[1].source
		else
			winner = inPlay[2].source

		winner = Number(winner)
		// update current trick total
		let scoringTemp = {...scoring}
		scoringTemp.teams[players[winner].team].currentTricks++
		setScoring(scoringTemp)

		return winner
	}

	function ScoreHand(conceded) {
		const bidDetail = findBid(bidState.highestBid)
		const biddingTeam = players[bidState.winningBidder].team
		const opponent = (biddingTeam + 1) % 2
		let scorer = { ...scoring }

		if (!conceded) {
			// bid-winners
			if (bidDetail.tricks <= scoring.teams[biddingTeam].currentTricks)
				// success -- if it's get what you bid or the opponents conceded, give only the bid point value, otherwise count tricks
				scorer.teams[biddingTeam].gameScore += !gameSettings.scoreTricks || !bidState.opponentStayed ? bidDetail.points :
					Math.max(scoring.teams[biddingTeam].currentTricks, bidDetail.points)
			else
				scorer.teams[biddingTeam].gameScore -= bidDetail.points

			// opponents
			if (bidState.opponentStayed)
				if (scoring.teams[opponent].currentTricks > 0)
					scorer.teams[opponent].gameScore += scoring.teams[opponent].currentTricks
				else
					scorer.teams[opponent].gameScore -= bidDetail.points
		}
		else {
			scorer.teams[biddingTeam].gameScore += bidState.highestPoints
		}

		setScoring(scorer)
		if (scorer.teams[biddingTeam].gameScore >= 31 || scorer.teams[opponent].gameScore <= -31)
			return biddingTeam
		else if (scorer.teams[opponent].gameScore >= 31 || scorer.teams[biddingTeam].gameScore <= -31)
			return opponent
		else
			return -1
	}

	function findBidByName(checkBid, currentBid) {
		return checkBid.bid === currentBid
	}

	const updateBid = (bid) => {
		const stillBidding = bid !== 'PepperUn' && bidState.bidder != bidState.dealer
		const nextBidder = (bidState.bidder + 1) % gameSettings.playerCount
		if (bid !== 'pass') {
			const bidDetail = BidType().find((bidName) => findBidByName(bidName, bid))
			const leadingBidder = bidState.bidder
			setBidState({
				...bidState,
				isBidding: stillBidding,
				highestBid: bid,
				highestPoints: bidDetail.points,
				winningBidder: leadingBidder,
				bidder: nextBidder
			})
		}
		else {
			setBidState({
				...bidState,
				isBidding: stillBidding,
				bidder: nextBidder
			})
		}

		if (!stillBidding) {
			setGameState({...gameState, gamePhase: 2})
		}
	}

	function SuitFromAbreviation(suitAbbrev) {
		let suit = ''
		switch (suitAbbrev) {
			case 'D':
				suit = 'Diamonds'
				break
			case 'C':
				suit = 'Clubs'
				break
			case 'H':
				suit = 'Hearts'
				break
			case 'S':
				suit = 'Spades'
				break
			default:	// No trump
				suit = 'No Trump'
				break
		}

		return suit
	}

	// Phase 2 decision
	function declareSuit(suitAbbrev) {
		const suit = SuitFromAbreviation(suitAbbrev)

		// If dirty clubs or dealer was dumped and bid 3, non-winning players must stay in
		setGameState({
			...gameState,
			trump: suit,
			gamePhase: ((bidState.bidder === bidState.deal && bidState.winningBid === 3)
				|| suit === 'Clubs' ? 4 : 3)
	})
	} 

	// Phase 3 decision (declaring trump)
	function playDecision(selection) {
		const nextPhase = (selection === 'Stay') ? ((bidState.highestPoints === 14) ? 5 :  4) : 6	// 4 - trade, 6? - score

		if (nextPhase == 6) {
			let gameUpdate = { ...gameState }
			const gameOver = ScoreHand(true)

			if (gameOver == -1) {	//still playing
				gameUpdate = PrepareNextHand({ ...gameUpdate })
				DealCards()
			}
			else {
				alert(`Team ${gameOver + 1} has won!`)
			}

			setGameState(gameUpdate)
		}
		else
			setGameState({
				...gameState, gamePhase: ((bidState.highestPoints === 14) ? 5 : nextPhase),
				opponentStayed: (selection === 'Stay')
			})	// if pepper-unassisted was bid, move to play
	}

	// Phase 4 completion (trading cards)
	function completeTrade() {
		let tempPlayers = {...players}
		while (cardsInPlay.length > 0) {
			let nextCard = cardsInPlay.pop()
			console.log(['players, nextCard, tempPlayers', players, nextCard, tempPlayers])
			tempPlayers[players[Number(nextCard.source)].teammateIndex].cards.push(nextCard.card)
		}
		setPlayers(tempPlayers)
		setGameState({
			...gameState,
			gamePhase: 5,
			currentTrick: 1,
			currentPlayerIndex: (gameState.trump !== 'No Trump' ? bidState.winningBidder : (bidState.winningBidder + 1) % 4)
		})

	}

	useEffect(() => {
	}, [cardsInPlay])

	const playerSet = (playerInfo) => {
		let updatePlayers = [...players]
		const nextSeat = updatePlayers.findIndex(findOpen)
		updatePlayers[nextSeat].name = playerInfo.name
		updatePlayers[nextSeat].image = playerInfo.image

		setPlayers(updatePlayers)

		function findOpen(player) {
			return player.name.indexOf('#Open#') > -1
		}
	}
	async function DealCards() {
		const deckVar = await loadDeck(4)
		return await deal(players, deckVar)	// Populates a cards array in each player element
	}

	const startGame = async () => {
		const firstDealer = Math.trunc(Math.random() * gameSettings.playerCount)

		const deckVar = await loadDeck(4)
		const dealtPlayers = await deal(players, deckVar)	// Populates a cards array in each player element
		setPlayers(dealtPlayers)

		setBidState({
			...bidState,
			isBidding: true,
			highestBid: 'pass',
			highestPoints: 0,
			winningBidder: 0,
			bidder: (firstDealer + 1) % 4,
			dealer: firstDealer
		})

		setGameState({
			...gameState,
			gamePhase: 1,	// Setup, Dealing, 1 - Bidding, Declaring, Playing, cleanup, scoring?
			dealer: firstDealer,
			bidder: (firstDealer + 1) % 4,	// remove from game state???
			currentBid: 0,
			player: 0,
			currentTrick: 1,
			trump: null,		// Hearts, Diamonds, Spades, Clubs, no -- have a trump indicator
			scores: [0, 0, 0]
		})

		setScoring(ResetScores())
		// position and show the bidding control by the first bidder
	}

	function GetBidderPositioning() {
		return { position: 'fixed', top: '33%', left: '33%' }
	}

	const layoutDiv = { padding: '10px', width: '33%', display: 'inline-block', minHeight: '33%', position: 'fixed' }

	return (
		<div>
			{ !loading ?
				<div>
					<div id='Status' style={{ ...layoutDiv, top: '0', left: '0' }} >
						<Scoreboard />
					</div>
					<div id='Player2' style={{
						...layoutDiv, position: 'fixed', top: '0', left: '33%' }} >
						<PlayerHand player={players[2]} updatePlay={playCard} playersIndex='2' />
					</div>
					<div id='Team1' style={{ ...layoutDiv, position: 'fixed', top: '0', left: '66%' }} >
						<div id='temporaryBid'
							style={{ padding: '2px', height: 'auto', width: '33%', display: 'inline-block' }}>
							<b>bidStatus</b><br />
							isBidding: {bidState.isBidding}<br />
							highestBid: {bidState.highestBid}<br />
							highestPoints: {bidState.highestPoints}<br />
							winningBidder: {bidState.winningBidder}<br />
							bidder: {bidState.bidder}<br />
							dealer: {bidState.dealer}<br />
						</div>
						<div id='temporaryGame'
							style={{ padding: '2px', height: 'auto', width: '33%', display: 'inline-block' }}>
							<b>gameState</b><br />
							gamePhase: {gameState.gamePhase}<br />
							dealer: {gameState.dealer}<br />
							bidder: {gameState.bidder}<br />
							player: {gameState.player}<br />
							currentBid: {gameState.currentBid}<br />
							currentTrick: {gameState.currentTrick}<br />
							currentPlayerIndex: {gameState.currentPlayerIndex}<br />
							trump: {gameState.trump}<br />
						</div>
						<div id='temporaryScore'
							style={{ padding: '2px', height: 'auto', width: '33%', display: 'inline-block' }}>
							<b>scoring</b><br />
							<u>team 1:</u><br />
							score: {scoring.teams[0].gameScore}<br />
							current tricks: {scoring.teams[0].currentTricks}<br />
							<u>team 2:</u><br />
							score: {scoring.teams[1].gameScore}<br />
							current tricks: {scoring.teams[1].currentTricks}<br />
						</div>
					</div>
					<div id='Player1'
						style={{
							...layoutDiv,
							position: 'fixed',
							top: '33%',
							left: '0'
						}} >
							<PlayerHand player={players[1]} updatePlay={playCard} playersIndex='1' />
					</div>
					<div id='PlayingSurface' style={{
						...layoutDiv, position: 'fixed', top: '33%', bottom: '66%', left: '33%', right: '66%', backgroundColor: 'green'
					}} >
						{cardsInPlay.map((card) => { return <Card card={card.card} />})}
					</div>
					<div id='Player3' style={{
						...layoutDiv, position: 'fixed', top: '33%', right: '0' }}  >
						<PlayerHand player={players[3]} updatePlay={playCard} playersIndex='3' />
					</div>
					<div id='Team2' style={layoutDiv} ></div>
					<div id='Player0' style={{
						...layoutDiv, position: 'fixed', bottom: '0', left: '33%' }}  >
						<PlayerHand player={players[0]} updatePlay={playCard} playersIndex='0' playersIndex='0' />
					</div>
					<div id='Controls' style={{ ...layoutDiv, position: 'fixed', bottom: '0', left: '66%' }}  >
						<GameSetup settings={gameSettings} updater={adminSet} />
						<Join settings={player} updater={playerSet} />
						<Teams settings={players} updater={playersUpdate} />
						<Button id='StartGame' width='150px' onClick={startGame} >Start game</Button>
					</div>
					
					<div>
						{gameState.gamePhase == 1 ? <BiddingControl bidderPosition={bidderPosition}
							isDealer={bidState.bidder === gameState.dealer}
							highestBid={bidState.highestBid}
							highestPoints={bidState.highestPoints}
							updater={updateBid}
							bidder={players[bidState.bidder].name}/> : null}
						{gameState.gamePhase == 2 ? <DeclareTrump bidder={players[bidState.winningBidder].name} updater={declareSuit} /> : null}
						{gameState.gamePhase == 3 ?
							<ButtonsOnlyDecision
								updater={playDecision}
								title='Stay In or Bravely Run Away'
								buttons={['Stay', 'Run Away']} /> : null}
						{gameState.gamePhase == 4 && cardsInPlay.length == 2 ?
							<ButtonsOnlyDecision
								updater={completeTrade}
								title='Complete Trade'
								buttons={['Yes']} /> : null}

					</div>
				</div>
				:
				<div><p>Loading...</p></div>
			}
		</div>
	)
}