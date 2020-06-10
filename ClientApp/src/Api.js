import axios from 'axios'
import { useState } from 'react'

export const cardValues = [
	{
		abbreviation: "A",
		name: "Ace",
		noTrumpRank: 1,
		trumpRank: 3,
		trumpColorRank: 0
	},
	{
		abbreviation: "K",
		name: "King",
		noTrumpRank: 2,
		trumpRank: 4,
		trumpColorRank: 0
	},
	{
		abbreviation: "Q",
		name: "Queen",
		noTrumpRank: 3,
		trumpRank: 5,
		trumpColorRank: 0
	},
	{
		abbreviation: "J",
		name: "Jack",
		noTrumpRank: 4,
		trumpRank: 1,
		trumpColorRank: 2
	},
	{
		abbreviation: "10",
		name: "10",
		noTrumpRank: 5,
		trumpRank: 6,
		trumpColorRank: 0
	},
	{
		abbreviation: "9",
		name: "9",
		noTrumpRank: 6,
		trumpRank: 7,
		trumpColorRank: 0
	}
]
export const cardSuits = [
	{
		abbreviation: "S",
		name: "Spade",
		sharedColor: "C"
	},
	{
		abbreviation: "C",
		name: "Club",
		sharedColor: "S"
	},
	{
		abbreviation: "H",
		name: "Heart",
		sharedColor: "D"
	},
	{
		abbreviation: "D",
		name: "Diamond",
		sharedColor: "H"
	}
]
export const standardDeck = () => {
	let deck = []
	for (let v = 0; v < 13; v++)
		for (let s = 0; s < 4; s++) {
			deck.push((v < 6 ? cardValues[v].abbreviation : (14 - v) ) + cardSuits[s].abbreviation)
		}

	return deck
}

// Just as I started working with deckofcardsapi.com, the site started to die :(  Not THAT hard to roll my own
const api = axios.create({
	baseURL: 'https://deckofcardsapi.com/api/deck/'
})

export const ping = (logIt) => {
	if (logIt) {
		console.log('ping')
	}
	return "I'm alive!"
}

export const createDeck =  (cards) => {
	//const deck = await api.get(`new/shuffle/?cards=${cards}`, {
	//	params: {
	//		deck_count: 1
	//	}
	//})
	const fullDeck = standardDeck()
	console.log('full deck')
	console.log(fullDeck)
	const requestedCards = cards.split(',')
	let currentDeck = fullDeck.reduce((collector, card) => {
		if (requestedCards.includes(card))
			collector.push(card)
		return collector
	}, []);

	
	return shuffle(currentDeck)

}

export const shuffle = (deck) => {

	let sorter = []
	for (let i = 0; i < deck.length; i++) {
		sorter.push({ index: i, sortVal: Math.random() })
	}
	const shuffledDeck = sorter.sort(compare).reduce((shuffled, element) => {
		shuffled.push(deck[element.index])
		return shuffled
	}, [])

	console.log('Shuffled deck')
	console.log(shuffledDeck)
	return shuffledDeck
	
	function compare(a, b) {
		let comparison = 0;
		if (a.sortVal > b.sortVal) {
			comparison = 1;
		} else if (a.sortVal < b.sortVal) {
			comparison = -1;
		}
		return comparison;
	}
}

// Assumes 4th player is the blind if only 3 actual players
export const deal =  (players, deck) => {
	

	//deck = deck	//.then((result) => { return result })
	console.log(['In deal(), deck:', deck])
	const cards = deck.length
	const playerCount = cards === 24 ? 4 : 3
	
		
	console.log(['Math.round(deck.length / playerCount)', Math.round(deck.length / playerCount)])
	for (let pl = 0; pl < playerCount; pl++) {	// Clear prior hands--winning bidder's partner would have cards
		players[pl].cards = []
	}

	for (let c = 0; c < Math.round(cards / playerCount); c++) {
		for (let p = 0; p < playerCount; p++) {
			players[p].cards.push(deck.pop())
		}
	}

	if (playerCount === 3) {
		console.log(['players in deal()', players])
		// put last two in blind
		players[3].cards.push(deck.pop())
		players[3].cards.push(deck.pop())
	}

	//console.log(players)
	return players

}
// deck
// hand[]
// board
// pile[] (User.pile?)