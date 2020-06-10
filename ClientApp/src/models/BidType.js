import React from 'react'

export const BidType = () => { 
return [
	{
		bid: 'pass',
		points: 0,
		tricks: 0
	},
	{
		bid: '3',
		points: 3,
		tricks: 3
	},
	{
		bid: 'try 3',
		points: 3,
		tricks: 3
	},
	{
		bid: 'bid 3',
		points: 3,
		tricks: 3
	},
	{
		bid: '4',
		points: 4,
		tricks: 4
	},
	{
		bid: '5',
		points: 5,
		tricks: 5
	},
	{
		bid: '6',
		points: 6,
		tricks: 6
	},
	{
		bid: 'pepper',
		points: 7,
		tricks: 6
	},
	{
		bid: 'pepperUn',
		points: 14,
		tricks: 6
	}
	]
}

function LookForIt(bid, bidName) {
	return bid == bidName
}

export const findBid = (bidName) => {
	return BidType().find((bid) => {
		console.log(['finding bid', bid, bidName])
		return bid.bid == bidName
	})
}