import React, { useState } from 'react'

// params should contain a player and an image
export const SelectablePlayer = (params) => {
	return <div style={{ textAlign: 'center', width:'50%', display: 'inline-block' }}>
		<img src={params.player.image} height='96px' padding='3px'/><br/>
		<b>{params.player.name}</b>
	</div>
}