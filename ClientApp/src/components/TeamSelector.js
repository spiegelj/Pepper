import React from 'react'

export const TeamSelector = (params) => {
    //onChange={() => params.updater(true)} 
    function changed(e) {
        params.updater(e.target.value, params.seat)
        console.log(['TeamSelector.changed() -- may not have waited', params.players])
    }
    return <div>
        <b>Seat {Number(params.seat) + 1}:</b>
        <select 
            onChange={(event) => changed(event,true)}
            style={{ textAlign: 'center', width: '50%', display: 'inline-block' }}>
            <option value='-1' label='No selection' selected />
            {params.players     //.filter(params.filter)
                .map((player) => { return <option value={Number(player.playerId)} label={player.name} disabled={player.seat > -1 }/> })}
        </select>
        </div>
}
