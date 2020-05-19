import React, {useEffect, useState} from 'react'
import {connect, useSelector} from 'react-redux'

const Store = (props) => {
    const {dispatch} = props;

    const [counter, setCounter] = useState(1);
    const reduxCounter = useSelector(state => state.counter); // counters
    const [cc, setCC] = useState(reduxCounter) // initial

    useEffect(() => {
       setInterval(() => {
           console.log(counter, reduxCounter, cc);
           counterAdd();
       }, 3000)
    }, []);

    useEffect(() => {
        setCC(reduxCounter)
    }, [reduxCounter]);

    const counterAdd = () => {
        console.log(cc);
        dispatch({type: 'COUNTER_ADD'})
    };

    return (
        <div className="container">
            <h3>Store page</h3>
            <div>
                <span>Redux counter: {reduxCounter} {cc}</span>
            </div>
            { counter }
            <button onClick={() => setCounter(counter + 1)}>click</button>
            <button onClick={() => dispatch({type: 'COUNTER_ADD'})}>redux click</button>
        </div>
    )
};

export default connect()(Store);
