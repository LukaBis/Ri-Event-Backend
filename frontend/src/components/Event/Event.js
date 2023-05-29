import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import getSingleEvent from '../../requests/get/getSingleEvent';
import './event.css';
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

function Event() {

    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [center, setCenter] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    });

    useEffect(() => {
        getSingleEvent(eventId).then(event => {
            setEvent(event);

            setCenter({lat: event.latitude, lng: event.longitude})
        })
    }, []);

    function Map() {
        return <GoogleMap 
            zoom={13} 
            center={center} 
            mapContainerClassName='map-container'>
                <MarkerF position={center}/>
        </GoogleMap>
    }
    return (
        <>
            <Box className='event-container'>
                <Box marginBottom={2} marginTop={4} className='event-title-container'>
                    <Typography variant="h3">{event?.title}</Typography>
                </Box>

                <Box marginBottom={2} className='evet-image-container'>
                    <img
                        src="https://media.istockphoto.com/id/868935172/photo/heres-to-tonight.jpg?s=612x612&w=0&k=20&c=v1ceJ9aZwI43rPaQeceEx5L6ODyWFVwqxqpadC2ljG0="
                        alt="Event"
                        className='event-image'
                    />
                </Box>

                <Box marginBottom={2} className='event-desc-container'>
                    <Typography variant="body1">
                        {event?.description}
                    </Typography>
                </Box>

                <Box marginBottom={2}>
                    <Typography variant="body1">
                        <b>Host: </b> {event?.host}
                    </Typography>
                </Box>

                <Box marginBottom={2}>
                    <Typography variant="body1">
                        <b>Event date: </b> {event?.date}
                    </Typography>
                </Box>

                <Box marginBottom={2}>
                    <Typography variant="body1">
                        <b>Event start time: </b> {event?.start_time}
                    </Typography>
                </Box>

                <Box marginBottom={2}>
                <Typography variant="body1">
                    <b>Event location: </b>
                        {!isLoaded ? <>Loading...</> : <Map/>}
                </Typography>
                </Box>

            </Box>
        </> 
    )
}

export default Event