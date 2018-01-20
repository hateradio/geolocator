import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Map extends Component {        
    componentDidUpdate(prevProps, prevState) {
        const { location } = prevProps
        const { target } = this.props
        
        if (!location.lat || !location.lng) {
            this.loadMap()
            this.watchLocation()
        } else {
            this.recenterMap(target.lat, target.lng)
        }
    }

    loadMap() {
        if (this.props && this.props.google) {
            
            const { google, location } = this.props
            const maps = google.maps

            const mapRef = this.refs.map
            const node = ReactDOM.findDOMNode(mapRef)
            let zoom = 18
            let lat = location.lat
            let lng = location.lng
            const center = new maps.LatLng(lat, lng)
            const mapConfig = Object.assign({}, { center, zoom })
            this.map = new maps.Map(node, mapConfig)

            this.showCurrentLocation(lat, lng)
        }
    }

    showCurrentLocation(lat, lng) {
        const { google } = this.props
        const maps = google.maps

        const pref = {
            map: this.map,
            position: new maps.LatLng(lat, lng)
        }

        if (this.currentLocation) {
            this.currentLocation.setMap(null);
        }

        this.currentLocation = new google.maps.Marker(pref)
    }

    watchLocation() {
        const success = (pos) => {
            const crd = pos.coords

            if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
                console.log('Congratulations, you reached the target');
                navigator.geolocation.clearWatch(id);
            } else {
                console.log(crd)
                this.recenterMap(crd.latitude, crd.longitude)
                this.showCurrentLocation(crd.latitude, crd.longitude)
            }
        }

        const error = (err) => {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        const target = {
            latitude: 0,
            longitude: 0
        };

        const id = navigator.geolocation.watchPosition(success, error);
    }

    recenterMap(lat, lng) {
        const map = this.map
        const maps = this.props.google.maps

        map.panTo(new maps.LatLng(lat, lng))
    }

    renderChildren() {
        const { children } = this.props

        if (!children) return

        return React.Children.map(children, c => {
            return React.cloneElement(c, {
                map: this.map,
                google: this.props.google,
                mapCenter: this.props.location
            });
        })

    }

    render() {
        return (
            <div>
                <div ref='map' style={{ width: '100vw', height: '50vh' }}>
                    Loading map...
                </div>
                {this.renderChildren()}
            </div>
        )
    }
    
}