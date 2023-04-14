import React, { useEffect, useState} from 'react';
import './home.css';
import Map from '../../components/map';
import axios from "axios";


const Home = () => {
    const [markers, setMarkers] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/location');
                if (response && response.data && response.data.features) {
                    setMarkers(response.data.features)
                    console.log(response.data.features)
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData().then(r => console.log(r));
    }, []);
    return (
        <div className="P-home">
            <div className={"map"}>
                <Map markers={() => markers}/>
            </div>
        </div>
    )
}

export default Home