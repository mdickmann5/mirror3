import React, { Component } from "react";
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube';
import axios from 'axios';
import fs from 'fs';
import sun from './sun.jpg';
import youtube from './youtube';
import properties from './propconfig.js';

const monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
const relatedVidId = "RL8-fCEtFTM";

export default class Home extends Component {
	constructor(props) {
		super(props);
        this.state = {youtubeId : "",
			tempSet : false,
			wImage : sun,
			wTemp : 'idk',
			wDesc : 'Something went wrong send help'};
    }

    componentDidMount() {
        if (this.state.youtubeId === "") {
            this.getYoutubeId();
        }
        if (!this.state.tempSet) {
              	this.getTemp();
        }
    }


    getTemp() : String {
        var that = this;
        if (this.state.tempSet == false) {
                    let uri = 'https://api.openweathermap.org/data/2.5/weather?q=Lansing,US&appid=' + properties.weatherAppId;
                    axios.get(uri)
          .then(function (response) {
            var kelvin = parseFloat(response.data.main.temp);
            var fahren = (kelvin * (9.0/5.0)) -459.67;
            var degreeOut = Math.floor(fahren);
            var degreeStr = degreeOut.toString() + ' °F';

            var desc = response.data.weather[0].description;
            that.setState({wTemp:degreeStr, wDesc:desc, tempSet:true});

            var weather = response.data.weather[0].main;
            document.getElementById('weatherSymbol').src = "http://openweathermap.org/img/w/" +response.data.weather[0].icon + ".png";
          })
          .catch(function (error) {
            console.log(error);
            that.setState({wTemp:"70", wDesc:"sunny", tempSet:true})
          });
        }

        return 'idk';
    }

    getDate() : String {
        this.getYoutubeId();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        }
        var today = monthNames[today.getMonth()] + ' ' + dd + ', ' + yyyy;
        return today;
    }

    getYoutubeId = async () => {
        //fetch a videoId from googleapi related to a video id (i think its a news vid)
        if (this.state.youtubeId == "") {
            const response = await youtube.get('./search', {
                params: {
                    //relatedToVideoId: relatedVidId,
                    chart:'mostPopular',
                    regionCode:'US',
                    type: 'video'
                }
            })
            console.log(response);
            if (response !== undefined) {
                this.setState({youtubeId: response.data.items[0].id.videoId })
            } else {
                console.log('response was undefined');
            }
        }

    };

    render () {
    	    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        origin :'http://localhost:3000'
      }
    };



    	return (
              <div id="HomeWrapper">
                  <div id="top">
		                  <div id="weather">
                       <p>{this.getDate()}</p>
                       <p>
                          <img id="weatherSymbol" src={this.state.wImage}/>
		 	                     <div id="temp">
                            <p id="tempVal">{this.state.wTemp}</p>
                            <p id="desc">{this.state.wDesc}</p>
                           </div>
                       </p>
		                  </div>
      		            <div id="reminders">
              		      <h1>Reminders</h1>
                        <ul id="reminderList">
                          <li>Pay rent</li>
                          <li>Turn in book</li>
                        </ul>
      		           </div>
                  </div>
                <div id="middle">
                </div>
                <div id ="bottom">
                    <YouTube
                      videoId={this.state.youtubeId}
                      opts={opts}
                      onReady={this._onReady}
                    />
                </div>
              </div>
    	)
    }

}
