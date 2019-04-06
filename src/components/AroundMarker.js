import React from 'react';

import { Marker, InfoWindow } from 'react-google-maps';

export class AroundMarker extends React.Component {
    state = {
        isOpen: false,
    }

    toggleOpen = () => {
        this.setState((prevState) => {
            return {
                isOpen: !prevState.isOpen
            }
        })
    }
    render() {
        const { location: { lat, lon: lng }, user, message, url } = this.props.post;
        return (
            <Marker
                position={{ lat, lng }}
                onMouseOver={this.toggleOpen}
                onMouseOut={this.toggleOpen}
                // onClick = {this.toggleOpen}
            >
                {this.state.isOpen ?
                    (<InfoWindow onCloseClick = {this.toggleOpen}>
                        <div>
                            <img
                                className="around-marker-image"
                                src={url}
                                alt={message}
                            />
                            <p>{`${user}: ${message}`}</p>
                        </div>
                    </InfoWindow>) : null}
            </Marker>
        )
    }
}