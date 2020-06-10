import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BidType } from '../models/BidType'

// Unorthodox, maybe, but since the parent knows who's calling and it's position, pass a positioning style
// bidder, current bid, dealer
export const BiddingControl = (params) => {
	const bids = BidType()

	const [bid, setBid] = useState(!params.isDealer || params.highestPoints > 0 ? "pass" : null);

	console.log(['BiddingControl', params.bidderPosition])

	return (
		<div style={params.bidderPosition}>
			<b>Current bidder: </b> {params.bidder}<br />
			{bids.map(option => (
				<>
					<input
						type="radio"
						name="bid"
						value={option.bid}
						checked={bid === option.bid}
						/*checked={params.isDealer === true && params.highestBid === 'pass' && option.bid === '3' ? true : option.bid === 'pass'}*/
						disabled={
							(params.isDealer === true && (
								(option.bid === 'try 3')
								|| (option.bid === 'bid 3')
								|| (option.points === 0 && params.highestBid === 'pass')	//dump
								)
							)
							|| (option.points > 0 && option.points <= Number(params.highestPoints))
						}
						onChange={e => setBid(e.currentTarget.value)}
					/>{" "}
					{option.bid}<br />
				</>
			))}
			<Button disabled={!bid} onClick={() => params.updater(bid)}>Bid</Button>
		</div>
	);
}