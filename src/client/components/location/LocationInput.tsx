import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGeoLocation } from '@/contexts/GeoLocationProvider'
import { getGeoLocationFromBrowser, getCitySuggestions } from '@/components/location/locationUtils'
import { LocationIQResults, LocationIQPlace } from '../../../shared/types/LocationIQPlace'

export default function LocationInput() {
    const { geoLocation, setGeoLocation } = useGeoLocation()
    const [city, setCity] = useState('')
    const [error, setError] = useState('')
    const [results, setResults] = useState<LocationIQResults>([])

    async function handleSubmitCity(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setResults([])
        setError('')
        const cityMatches = await getCitySuggestions(city)
        if (cityMatches) {
            // Handle successful results
            console.log('City matches found:', cityMatches)
            setResults(cityMatches)
            // e.g., update state to display the results, navigate, etc.
        } else {
            // Handle no results or an error during the fetch
            console.log('Could not find city matches or an error occurred.')
            setError('Could not find city matches or an error occurred.')
            // e.g., display an error message to the user, set an error state, etc.
        }
    }

    function handleChooseCity(city: LocationIQPlace) {
        const geoLocationData = {
            longitude: city.lon,
            latitude: city.lat,
            city: city.address.city,
            state: city.address.state,
            country: city.address.country,
        }
        setGeoLocation(geoLocationData)
    }

    return (
        <Card className='p-4'>
            <Button onClick={getGeoLocationFromBrowser}>Get Location</Button>

            {geoLocation && (
                <>
                    <div>
                        Latitude: {geoLocation.latitude}, Longitude: {geoLocation.longitude}
                    </div>
                    <div>
                        City:
                        {geoLocation.city}
                    </div>
                </>
            )}

            <form onSubmit={handleSubmitCity} className='space-y-2'>
                <Input
                    type='text'
                    placeholder='City'
                    name='city'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <Button type='submit'>Submit</Button>
            </form>
            {results && results.length > 0 && (
                results.map((place) => (
                    <Button
                        key={place.place_id}
                        onClick={() => handleChooseCity(place)}>
                        {place.display_name}
                    </Button>
                ))
            )
            }
            {error && <div className='text-red-500'>Error: {error}</div>}
        </Card>
    )
}
