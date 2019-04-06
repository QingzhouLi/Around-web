import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";

import { AroundMarker } from './AroundMarker';
import { POS_KEY } from '../constants';

class NormalAroundMap extends React.Component {

    reloudMarker = () => {
        const center = this.getCenter();
        const radius = this.getRadius();
        this.props.loadNearByPosts(center, radius);
    }

    getCenter = () => {
        const center = this.map.getCenter();
        return {
            lat: center.lat(),
            lon: center.lng(),
        }
    }

    getRadius = () => {
        const center = this.map.getCenter();
        const bound = this.map.getBounds();
        if (center && bound) {
            const ne = bound.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng())
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    getMapRef = (mapInstance) => {
        this.map = mapInstance;
        const center = this.map.getCenter();
        console.log(center.lat(), center.lng());
    }

    render() {
        const { lat, lon: lng } = JSON.parse(localStorage.getItem(POS_KEY));

        return (
            <GoogleMap
                ref={this.getMapRef}
                defaultZoom={11}
                defaultCenter={{ lat, lng }}
                onDragEnd={this.reloudMarker}
                onZoomChanged={this.reloudMarker}
            >
                {
                    this.props.posts.map(post => <AroundMarker key={post.url} post={post} />)
                }
            </GoogleMap>
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));