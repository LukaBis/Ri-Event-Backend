import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './home.css';
import getAuthenticatedUser from '../../requests/get/getAuthenticatedUser';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import EventItem from '../EventItem';
import getAllEvents from '../../requests/get/getAllEvents';
import TextField from '@mui/material/TextField';
import { GoogleMap, InfoWindowF, Marker, MarkerF, useLoadScript } from '@react-google-maps/api';

const Home = () => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const navigate = useNavigate('');
    // remove this later
    const randomImages = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDmF-fhAYNe-fF9ecwqRWJ2DFm5_RRUM_aez1qo7ZHOeM42AcBwSjlDLmEmcZe_xkuEK0&usqp=CAU',
        'https://www.thesu.org.uk/pageassets/events/events.jpg',
        'https://billetto.co.uk/blog/wp-content/uploads/2019/11/hanny-naibaho-aWXVxy8BSzc-unsplash-1024x683.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrH6UmvKbkjxQhHqut5ZHvdl7C4gf1ILW4VQ&usqp=CAU',
    ];

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    });

    useEffect(() => {
        if (!Cookies.get('XSRF-TOKEN')) {
            navigate('/login');
        }

        // get authenticated user
        getAuthenticatedUser().then(user => setUser(user));
        getAllEvents().then(events => {
            setEvents(events);
            const eventMarkers = events.map(event => ({
                lat: event.latitude,
                lng: event.longitude,
            }));
            setMarkers(eventMarkers);
        });
    }, []);

    const handleMarkerClick = marker => {
        setSelectedMarker(marker);
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    };

    const getEventInfo = (marker) => {
        const event = events.find(event => event.latitude === marker.lat && event.longitude === marker.lng);
        console.log('event:', event)
        return event ? {title: event.title, description: event.description} : '';
    };

    const Map = () => {
        return <GoogleMap
            zoom={12}
            center={{ lat: 45.338231, lng: 14.420597 }}
            mapContainerClassName="map-container"
            mapContainerStyle={{ width: 500, height: 300 }}
            options={{
                disableDefaultUI: true
            }}
        >
            {markers.map((marker, index) => (
                <MarkerF key={index} position={marker} onClick={() => {
                    console.log('marker')
                    handleMarkerClick(marker)
                }
                } />
            ))}

            {selectedMarker && (
                <InfoWindowF
                    position={selectedMarker}
                    onCloseClick={handleInfoWindowClose}
                >
                    <div>
                        <h3>{getEventInfo(selectedMarker).title}</h3>
                        <p>{getEventInfo(selectedMarker).description}</p>
                    </div>
                </InfoWindowF>
            )}

        </GoogleMap>
    }

    return (
        <div className='Home'>
            <Box marginBottom={2} sx={{ m: 8 }}>
                <Typography variant="body1">
                    {!isLoaded ? <>Loading...</> : <Map />}
                </Typography>
            </Box>

            <Box className='heading' sx={{ m: 8 }}>
                <Typography variant='h3'>Hello {user?.name}, Discover Local Events</Typography>
                <Typography variant='paragraph' color={'GrayText'}>Stay up-to-date on the latest happenings and join the city's vibrant community</Typography>
            </Box>
            <Box sx={{ backgroundColor: 'white' }} id="global-search">
                <TextField fullWidth label="Search events" variant="outlined" />
            </Box>
            <Box
                className='event-list'
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    mt: 8,
                    borderRadius: 1,
                    flexWrap: 'wrap',
                }}>
                {events?.map((event, index) => (
                    <EventItem
                        id={event.id}
                        title={event.title}
                        description={event.description}
                        image={randomImages[Math.floor(Math.random() * randomImages.length)]} />
                ))}
            </Box>
        </div>
    );
};

export default Home;
