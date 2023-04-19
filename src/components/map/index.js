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
                center: [
                    105.54358038269157,
                    35.46678314428422
                ],
                zoom: 3,
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

                    // // Add click event to markers
                    map.on('click', 'markers', (e) => {
                        axios.get(`/api/pdfname?name=${e.features[0].properties.name}`
                        ).then(res => {
                            console.log(res.data);
                            const pdfname = res.data
                            onOpen(pdfname).then(r => {
                                console.log(r);
                            });
                        });

                    });

                    map.on('mouseenter', 'markers', (e) => {
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

                        map.on('mouseleave', 'markers', () => {
                            popup.remove();
                        });
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
        },
        [markers]);

    function updateMarker(newMarkers) {
        setMarkers(newMarkers);
        console.log("newMarkers", newMarkers)
    }


    return (
        <div id="map" style={{width: '100%', height: '100%'}}>
            <Header/>
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

