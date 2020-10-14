import express, {Request, Response} from 'express';
// @ts-ignore - Although ES Module definitions are present, won't work with TypeScript (even if they say so!).
import IPinfoWrapper from "node-ipinfo";
import dotenv from "dotenv";
import {URLSearchParams} from "url";
import fetch from 'node-fetch';

dotenv.config();

// Supposedly required as a wrapper for TypeScript.
const ipinfoWrapper = new IPinfoWrapper(`${process.env.IPINFO_API_KEY}`);

/**
 * Interface describing a parsed item from the nearby Google Places response.
 */
interface GooglePlaceLocation {
    name: string, // Name of place.
    vicinity: string, // Common location.
    types: { [index: string]: string } // Dict of different categories.
    userRatingsTotal: number, // Number of ratings.
    open?: boolean, // (opt) Whether store is open.
}

const router = express.Router();

/**
 * Body Params:
 * - position: {lat: string, lng: string}
 */
router.get('/nearby', [], async (req: Request, res: Response) => {
    // Extract IP address from express request.
    let ip: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Request may be a string csv, if so split and extract first IP.
    if (typeof ip === 'string') ip = ip.split(',')[0].trim();

    // If localhost or not found, use Random Wellington IP address for debugging.
    if (!ip || ip === '::1') ip = '202.20.2.204';

    // Contains 'hostname, city, loc, region, ...'
    // See attributes here: https://github.com/ipinfo/node
    const {loc} = await ipinfoWrapper.lookupIp(ip);

    // Base Google Places API path.
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    const params = new URLSearchParams([
        // See params here: https://developers.google.com/places/web-service/search
        ['input', 'computer'],
        ['location', loc],

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
        const recommendations = resp.results.map((rec: any): GooglePlaceLocation => {
            const {name, vicinity, types, user_ratings_total, opening_hours} = rec;

            return {
                name, vicinity, types,
                userRatingsTotal: user_ratings_total,
                open: opening_hours?.open_now
            };
        });
        // Success!
        return res
            .status(200)
            .json({recommendations})
            .send();
    } catch (e) {
        // Error fetching or parsing response.
        return res
            .status(400)
            .json({errors: [`Failed to get recommendations from places API: ${e.toString()}`]})
            .send();
    }
});

export {router as recommendationsServerRouter};
