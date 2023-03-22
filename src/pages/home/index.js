import React, {Component} from 'react'
import './home.css'
import Header from '../../components/header/index.js.bak'
import Map from '../../components/map'


class Home extends Component {
    render() {
        return (
            <div className="P-home">
                <div className={"map"}>
                    <Map/>
                </div>
            </div>
        )
    }
}

export default Home