import express, {Request, Response} from 'express';
import {getGoogleRecommendations, getLocationFromIp} from "../controller/recommendController";

const router = express.Router();

/**
 * Body Params:
 * - position: {lat: string, lng: string}
 */
router.get('/nearby', [], async (req: Request, res: Response) => {
    // Find IP for request, (generate if not applicable).
    const ip = extractIpFromRequest(req);

    try {
        // Obtain the users coordinates from the provided ip address.
        const location = await getLocationFromIp(ip);
        if (!location) throw 'failed to obtain location from ip address. Server error.';

        // Parse the Google response into `GooglePlaceLocation` interface for easy client-side parsing.
        const recommendations = await getGoogleRecommendations(location);
        if (!recommendations) throw 'failed to generate list of recommended locations for given location';

        // Success!
        return res
            .status(200)
            .json({recommendations})
            .send();
    } catch (e) {
        // Error fetching or parsing response.
        return res
            .status(400)
            .json({errors: [e]})
            .send();
    }
});

/**
 * Attempts to find an IP address for the provided request. If the request is from localhost (`::1`) or
 * there is no IP information associated with the request itself, then we resort to an arbitrary IP
 * address from Wellington.
 *
 * @param req - the request to extract IP address from.
 */
const extractIpFromRequest = (req: Request): string => {
    // Extract IP address from express request.
    let ip: string | string[] | undefined = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Request may be a string csv, if so split and extract first IP.
    if (typeof ip === 'string') ip = ip.split(',')[0].trim();

    // If localhost or not found, use Random Wellington IP address for debugging.
    if (typeof ip !== 'string' || ip === '::1') ip = '202.20.2.204';

    return ip;
}

export {router as recommendationsServerRouter};
