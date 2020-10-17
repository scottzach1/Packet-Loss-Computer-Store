import app from '../server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import mongoose from "mongoose";
import {ShopListing} from "../server/models/shopListingModel";
import {assertTypeT} from "./assertType";
import {assertEquals} from "./assertEquals";

chai.use(chaiHttp);

const api = '/api/v1';

/**
 * Dear developers, arrow functions should not be used with Mocha testing as
 * they lexically bind `this` and cannot access the Mocha context. Instead we
 * use standard functions.
 */

/**
 * Describes the test suite to test the API routes of the server.
 */
describe('API Tests', function () {

        before(function (done) {
            // Remove all items within the shop listing collection.
            ShopListing.deleteMany({/* Select everything */})
                .then(() => done());
        });

        afterEach(function (done) {
            // Remove all items within the shop listing collection.
            ShopListing.deleteMany({/* Select everything */})
                .then(() => done());
        });

        describe('Get all items request 1', function () {
            const targResp = {
                item: [{
                    title: 'Item A title',
                    description: 'Item A description',
                    category: 'TestItem',
                    brand: 'N/A',
                    cost: 50,
                    available: true,
                }, {
                    title: 'Item B title',
                    description: 'Item B description',
                    category: 'TestItem',
                    brand: 'N/A',
                    cost: 10,
                    available: true,
                }],
            }

            before(function () {
                targResp.item.forEach((i) => {
                    new ShopListing(i).save();
                });
            });

            it('Should return a list of items on call', function () {
                return chai.request(app).get(`${api}/shop/items/all`)
                    .then((res: any) => {
                        chai.expect(() => assertEquals(res.body, targResp)).to.not.throw();
                    });
            });
        });

        after(function (done) {
            // Remove all items within the shop listing collection.
            ShopListing.deleteMany({/* Select everything */})
                .then(() => mongoose.disconnect(done));
        });
    }
);
