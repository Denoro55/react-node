import React, {useCallback, useEffect, useState} from 'react'
import {connect} from 'react-redux'

const Home = ({user}) => {
    const greeting = user.auth ? <p>Hello, <b>{user.name}</b></p> : <p>Hello, Guest!</p>;

    return (
        <div>
            <h3 className="mb-3">Home page 2</h3>
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
