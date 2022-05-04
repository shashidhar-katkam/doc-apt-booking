import React, { Component } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';

export default class LoadingComponent extends Component {
    render() {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    zIndex: 10000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ProgressSpinner className='ui-progress-spinner-color' />
            </div>
        )
    }
}
