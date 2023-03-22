// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import mapboxgl from 'mapbox-gl';
//
// mapboxgl.accessToken = 'pk.eyJ1IjoibWVpbmE5NzU4IiwiYSI6ImNsZWZvZndjYjA1bmk0NW1yNTNoemV0MDcifQ.-BIoKfejC5g2bCEVCZMtOg';
//
// const Map = () => {
//     const [markers, setMarkers] = useState([]);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/location');
//                 if (response && response.data && response.data.features) {
//                     setMarkers(response.data.features);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     useEffect(() => {
//         const map = new mapboxgl.Map({
//             container: 'map',
//             style: 'mapbox://styles/mapbox/satellite-v9',
//             center: [0, 0],
//             zoom: 2,
//         });
//
//         map.on('load', () => {
//             if (markers.length > 0) {
//                 map.addSource('markers', {
//                     type: 'geojson',
//                     data: {
//                         type: 'FeatureCollection',
//                         features: markers.map((marker) => ({
//                             type: 'Feature',
//                             properties: { name: marker.properties.name },
//                             geometry: {
//                                 type: 'Point',
//                                 coordinates: marker.geometry.coordinates,
//                             },
//                         })),
//                     },
//                 });
//
//                 map.addLayer({
//                     id: 'markers',
//                     source: 'markers',
//                     type: 'circle',
//                     paint: {
//                         'circle-radius': 8,
//                         'circle-color': '#B42222',
//                     },
//                 });
//             }
//         });
//
//         return () => {
//             map.remove();
//         };
//     }, [markers]);
//
//     return <div id="map" style={{ width: '100%', height: '500px' }} />;
// };
//
// export default Map;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import 'supercluster';
import Header from '../header';

mapboxgl.accessToken = 'pk.eyJ1IjoibWVpbmE5NzU4IiwiYSI6ImNsZWZvZndjYjA1bmk0NW1yNTNoemV0MDcifQ.-BIoKfejC5g2bCEVCZMtOg';





const Map = () => {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/location');
                if (response && response.data && response.data.features) {
                    setMarkers(response.data.features);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [0, 0],
            zoom: 2,
        });

        map.on('load', () => {
            console.log("markers", markers);
            if (markers.length > 0) {
                map.addSource('markers', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: markers.map((marker) => ({
                            type: 'Feature',
                            properties: { name: marker.properties.name },
                            geometry: {
                                type: 'Point',
                                coordinates: marker.geometry.coordinates,
                            },
                        })),
                    },
                });

                map.addLayer({
                    id: 'markers',
                    source: 'markers',
                    type: 'circle',
                    paint: {
                        'circle-radius': 8,
                        'circle-color': '#225cb4',
                    },
                });
                // Add a unique id to each marker
                markers.forEach((marker, index) => {
                    marker.properties.id = index;
                });






                // // Add click event to markers
                map.on('click', 'markers', (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const name = e.features[0].properties.name;
                    const description = `<strong>${name}</strong>`;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(map);
                });






                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'markers', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'markers', () => {
                    map.getCanvas().style.cursor = '';
                });
            }
        });

        return () => {
            map.remove();
        };
    }, [markers]);

    return <div id="map" style={{ width: '100%', height: '100%' }} ><Header/></div>;
};

export default Map;

