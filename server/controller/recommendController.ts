// @ts-ignore - Although ES Module definitions are present, won't work with TypeScript (even if they say so!).
import IPinfoWrapper from "node-ipinfo";
import dotenv from "dotenv";
import {URLSearchParams} from "url";
import fetch from "node-fetch";

dotenv.config();

// Supposedly required as a wrapper for TypeScript.
const ipinfoWrapper = new IPinfoWrapper(`${process.env.IPINFO_API_KEY}`);

/**
 * Gets the location coordinates from a provided IP address via
 * the https://ipinfo.io service. The coordinates will be in the
 * from `lat,lng`.
 *
 * @param ip - the ip to find location for.
 */
export const getLocationFromIp = async (ip: string) => {
    // Contains 'hostname, city, loc, region, ...'
    // See attributes here: https://github.com/ipinfo/node
    return await ipinfoWrapper.lookupIp(ip).loc;
}

/**
 * Interface describing a parsed item from the nearby Google Places response.
 */
export interface GooglePlaceLocation {
    name: string, // Name of place.
    vicinity: string, // Common location.
    types: { [index: string]: string } // Dict of different categories.
    userRatingsTotal: number, // Number of ratings.
    open?: boolean, // (opt) Whether store is open.
}

/**
 * Requests and parses a list of recommendations based off the provided coordinates.
 * Will return a list of `GooglePlaceLocation` objects if successful, null otherwise.
 *
 * @param location - location in the form `lat,lng` to perform recommendations.
 */
export const getGoogleRecommendations = async (location: string): Promise<GooglePlaceLocation[] | null> => {
    // Base Google Places API path.
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    const params = new URLSearchParams([
        // See params here: https://developers.google.com/places/web-service/search
        ['input', 'computer'],
        ['location', location],

        ['radius', '50000'],
        ['type', 'electronics_store'],
        ['keyword', 'computer'],
        ['rankby', 'prominence'],
        ['key', `${process.env.GOOGLE_PLACES_API_KEY}`],
    ]);

    try {
        // Construct query from parameters.
        const query = `${url}?${params.toString()}`;

        // Query Google Places API for nearby tech shops.
        const resp: any = await (await fetch(query)).json();

        // Parse the Google response into `GooglePlaceLocation` interface for easy client-side parsing.
        return resp.results.map((rec: any): GooglePlaceLocation => {
            const {name, vicinity, types, user_ratings_total, opening_hours} = rec;

            return {
                name, vicinity, types,
                userRatingsTotal: user_ratings_total,
                open: opening_hours?.open_now
            };
        });
    } catch (e) {
        return null;
    }
}
