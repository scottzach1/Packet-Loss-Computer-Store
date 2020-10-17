import app from '../server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import mongoose from "mongoose";
import {ShopListing} from "../server/models/shopListingModel";

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

            before(function () {
                new ShopListing({
                    title: 'Item A title',
                    description: 'Item A description',
                    category: 'TestItem',
                    brand: 'N/A',
                    cost: 50,
                    available: true,
                }).save();
            });

            it('Should return a list of items on call', function () {
                return chai.request(app).get(`${api}/shop/items/all`)
                    .then((res) => {
                        console.log(res.text);
                        chai.expect(res.text).to.contain('[');
                    });
            });
        });

        describe('Get all items request 2', () => {
            it('Should return a list of items on call', () => {
                return chai.request(app).get(`${api}/shop/items/all`)
                    .then((res) => {
                        chai.expect(res.text).to.contain('[');
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
