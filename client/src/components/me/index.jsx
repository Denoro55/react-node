import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withApiService} from '../hoc'
import './style.css'

const Me = (props) => {
    return (
        <div>
            <h2>Me</h2>
            <div className="me pt-4">
                <div className="me__block">
                    <div className="me__avatar">
                        <img src="https://img2.freepng.ru/20180626/fhs/kisspng-avatar-user-computer-icons-software-developer-5b327cc98b5780.5684824215300354015708.jpg" alt=""/>
                        <div className="me__avatar-edit">
                            <div className="avatar-loader">
                                <div className="avatar-loader__left">
                                    <input className="form-control" placeholder="Image URL" type="text"/>
                                </div>
                                <div className="avatar-loader__right">
                                    <button className="btn btn-primary">Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="me__info">
                        <div className="me__name">
                            Name: Den
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {

    }
};

export default withApiService(connect(mapStateToProps)(Me))
