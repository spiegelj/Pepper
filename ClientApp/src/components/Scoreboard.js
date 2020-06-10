import React, { useContext } from 'react'
import { PepperContext } from './PepperContext'

export const Scoreboard = () => {
	const [pepperState, setPepperState] = useContext(PepperContext)

	function GetScoringColor(score) {
		return score > 0 ? '#006600'
			: score < 0 ? '#e60000'
				: 'black'
	}

	return <div id='scoreboard' width='100%'>
		<h4>Scores:</h4>
		<b>Team 1:</b> <label style={{ color: GetScoringColor(pepperState.pepperScoring.teams[0].gameScore) }}>{pepperState.pepperScoring.teams[0].gameScore}</label><br/>
		<b>Team 2:</b> <label style={{ color: GetScoringColor(pepperState.pepperScoring.teams[1].gameScore) }}>{pepperState.pepperScoring.teams[1].gameScore}</label><br />
	</div>
}
