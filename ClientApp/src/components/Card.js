import React from 'react'

// params
//	card - abbreviation of the card
//	action - callback function to act on card's selection
//	return <img src={'./cards/' + params.card + '.svg'}

export const Card = (params) => {
	console.log(`process.env.PUBLIC_URL: ${process.env.PUBLIC_URL}`)
	console.log(process.env.PUBLIC_URL)

	return <img src={params.card + '.svg'}
		style={{ maxHeight: '128px', padding: '2px', height: 'auto', width: 'auto', display: 'inline-block' }}
		onDoubleClick={() => { params.action( params.card ) }}
	/>
}