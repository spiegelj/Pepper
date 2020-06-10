import React, { useState } from 'react';

const PepperContext = React.createContext([{}, () => { }]);

const PepperContextProvider = (props) => {
    const [state, setState] = useState({name: 'not yet'})
    return (
        <PepperContext.Provider value={[state, setState]}>
            {props.children}
        </PepperContext.Provider>
    );
}

export { PepperContext, PepperContextProvider };