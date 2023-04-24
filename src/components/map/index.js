import React, {useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import './map.css';
import Header from '../header';
import PDFShower from '../PDFShower';
import {Button, Drawer, Popover} from "antd";
import axios from "axios";
import {FiFilter} from "react-icons/fi";
import Filter from "../filter";
import UserPop from "../userpop";

mapboxgl.accessToken = 'pk.eyJ1IjoibWVpbmE5NzU4IiwiYSI6ImNsZWZvZndjYjA1bmk0NW1yNTNoemV0MDcifQ.-BIoKfejC5g2bCEVCZMtOg';


const Map = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState([105.54358038269157, 35.46678314428422]);
    const [zoom, setZoom] = useState(3);

    const content = <Filter updateMarker={updateMarker}/>;
    const text = <span>过滤列表</span>;


    const onClose = () => {
        setOpen(false);
    };

    const onOpen = async (value) => {
        console.log('download_file:', value)
        setOpen(true);
        const response = await axios.get(`/api/pdf/${value}`, {responseType: 'blob'});
        const file = new Blob([response.data], {type: 'application/pdf'});
        const fileUrl = URL.createObjectURL(file);
        setValue(fileUrl);
    };
    useEffect(() => {
        setMarkers(props.markers);
    }, [props.markers]);

    useEffect(() => {
            const map = new mapboxgl.Map({
                container: 'map',
                projection: 'globe',
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: center,
                zoom: zoom,
            });
            map.on('style.load', () => {
                map.setFog({
                    color: 'rgb(186, 210, 235)', // Lower atmosphere
                    'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                    'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                    'space-color': 'rgb(11, 11, 25)', // Background color
                    'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
                });
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
                                properties: {name: marker.properties.name, id: marker.properties.id},
                                geometry: {
                                    type: 'Point',
                                    coordinates: marker.geometry.coordinates,
                                },
                            })),
                        },
                        cluster: true,
                        clusterMaxZoom: 14,
                        clusterRadius: 50
                    });
                    map.addLayer({
                        id: 'clusters',
                        type: 'circle',
                        source: 'markers',
                        filter: ['has', 'point_count'],
                        paint: {
                            'circle-color': [
                                'step',
                                ['get', 'point_count'],
                                '#d6c451',
                                100,
                                '#f17596',
                                750,
                                '#ff0000'
                            ],
                            'circle-radius': [
                                'step',
                                ['get', 'point_count'],
                                20,
                                100,
                                30,
                                750,
                                40
                            ]
                        }
                    });
                    map.addLayer({
                        id: 'cluster-count',
                        type: 'symbol',
                        source: 'markers',
                        filter: ['has', 'point_count'],
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12
                        }
                    });
                    map.addLayer({
                        id: 'unclustered-point',
                        type: 'circle',
                        source: 'markers',
                        filter: ['!', ['has', 'point_count']],
                        paint: {
                            'circle-color': '#da1111',
                            'circle-radius': 5,
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#fff'
                        }
                    });
                    map.on('click', 'clusters', (e) => {
                        const features = map.queryRenderedFeatures(e.point, {
                            layers: ['clusters']
                        });
                        const clusterId = features[0].properties.cluster_id;
                        map.getSource('markers').getClusterExpansionZoom(
                            clusterId,
                            (err, zoom) => {
                                if (err) return;

                                map.easeTo({
                                    center: features[0].geometry.coordinates,
                                    zoom: zoom
                                });
                            }
                        );
                    });


                    // // Add click event to markers
                    map.on('click', 'unclustered-point', (e) => {
                        axios.get(`/api/pdfname?name=${e.features[0].properties.name}`
                        ).then(res => {
                            console.log(res.data);
                            const pdfname = res.data
                            onOpen(pdfname).then(r => {
                                console.log(r);
                            });
                        });

                    });

                    map.on('mouseenter', 'unclustered-point', (e) => {
                        const coordinates = e.features[0].geometry.coordinates.slice();
                        const name = e.features[0].properties.name;
                        const description = `<strong>${name}</strong>`;

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        const popup = new mapboxgl.Popup({closeButton: false})
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map);

                        map.on('mouseleave', 'unclustered-point', () => {
                            popup.remove();
                        });
                    });

                    // Change the cursor to a pointer when the mouse is over the places layer.
                    map.on('mouseenter', 'unclustered-point', () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Change it back to a pointer when it leaves.
                    map.on('mouseleave', 'unclustered-point', () => {
                        map.getCanvas().style.cursor = '';
                    });
                }
            });

            return () => {
                map.remove();
            };
        },
        [markers,center,zoom]);

    function updateMarker(newMarkers) {
        setMarkers(newMarkers);
        setCenter([105.54358038269157, 35.46678314428422])
        setZoom(3)
        console.log("newMarkers", newMarkers)
    }
    function updateMarker1(newMarkers) {
        setMarkers(newMarkers);
        console.log("newMarkers", newMarkers)
    }
    function updateCenter(newCenter) {
        setCenter(newCenter);
        console.log("newCenter", newCenter)
    }
    function updateZoom(newZoom) {
        setZoom(newZoom);
        console.log("newZoom", newZoom)
    }


    return (
        <div id="map" style={{width: '100%', height: '100%'}}>
            <Header updateCenter={updateCenter} updateMarker={updateMarker1} updateZoom={updateZoom}/>
            <Drawer
                title="详细信息"
                placement="left"
                closable={false}
                onClose={onClose}
                open={open}
                width={650}
            >
                <div>
                    <PDFShower pdfUrl={value}/>
                </div>
            </Drawer>
            <Popover
                placement="topLeft"
                title={text}
                content={content}
            >
                <Button style={{
                    background: "#a8a8a8",
                    border: "none",
                    height: "50px",
                    width: "50px",
                    borderRadius: "50px",
                    position: "absolute",
                    top: "90%",
                    left: "3%",
                    zIndex: "1000"
                }}>
                    <FiFilter/>
                </Button>
            </Popover>
            <UserPop/>
        </div>
    )
};

export default Map;

