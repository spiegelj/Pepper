import React from 'react'

// params
//	card - abbreviation of the card
//	action - callback function to act on card's selection
export const Card = (params) => {

	return <img src={'./cards/' + params.card + '.svg'}
		style={{ maxHeight: '128px', padding: '2px', height: 'auto', width: 'auto', display: 'inline-block' }}
		onDoubleClick={() => { params.action( params.card ) }}
	/>
}