import React, {useCallback, useEffect, useState} from 'react'
import {connect} from 'react-redux'

const Home = ({user}) => {
    const greeting = user.auth ? <p>Hello, <b>{user.name}</b></p> : <p>Hello, Guest!</p>;

    return (
        <div>
            <h3 className="mb-3">Home page</h3>
            <Example />
            {greeting}
        </div>
    )
};

const mapStateToProps = (state) => {
      return {
          user: state.user
      }
};

export default connect(mapStateToProps)(Home)

const UseMyEffect = () => {
    const [c, setC] = useState(0);

    const setCount = useCallback((c) => {
        setC(c)
    }, []);

    return {
        count: c,
        setCount
    }
};

function Example() {
    // Declare a new state variable, which we'll call "count"
    const {count, setCount} = UseMyEffect();

    useEffect(() => {
        console.log('useEffect function changed');
    }, [setCount]);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
