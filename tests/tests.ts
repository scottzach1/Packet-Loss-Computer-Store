import app from '../server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import mongoose from "mongoose";
import {ShopListing} from "../server/models/shopListingModel";
import {assertEquals} from "./assertEquals";
import {assertType} from "./assertType";

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

        const saveAllItems = (items: any[]) => {
            const promises = items.map((i) => new ShopListing(i).save());
            return Promise.all(promises);
        }

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

        describe('1. Get all items', function () {
            const targResp = {
                items: [{
                    title: '1 Item A title',
                    description: 'Item A description',
                    category: 'TestItem',
                    brand: 'N/A',
                    cost: 50,
                    available: true,
                }, {
                    title: '1. Item B title',
                    description: 'Item B description',
                    category: 'TestItem',
                    brand: 'N/A',
                    cost: 10,
                    available: true,
                }],
            }

            before(function () {
                saveAllItems(targResp.items);
            });

            it('Should return an identical list of items from response', function () {
                return chai.request(app)
                    .get(`${api}/shop/items/all`)
                    .then((res: any) => {
                        chai.expect(() => assertEquals(res.body, targResp)).to.not.throw();
                    });
            });
        });

        describe('2. Get item by id', function () {
            const targResp = {
                item: {
                    title: '2. Item A title',
                    description: 'Item A description',
                    category: 'TestItem',
                    brand: 'N/A',
                    cost: 50,
                    available: true,
                },
            }

            let id: string | undefined;

            before(function () {
                return (new ShopListing(targResp.item).save()).then((item) => id = item.id);
            });

            it('Should contain an identical value', function () {
                return chai.request(app)
                    .get(`${api}/shop/items/${id}`)
                    .then((res) => {
                        chai.expect(() => assertEquals(res.body, targResp)).to.not.throw();
                    });
            });

            it ('Should not contain any item', function() {
                return chai.request(app)
                    .get(`${api}/shop/items/INVALID`)
                    .then((res) => {
                        chai.expect(() => assertType(res.body, {errors: ['']})).to.not.throw();
                    });
            });
        });

        after(function (done) {
            mongoose.disconnect(done);
        });

        describe('3. Get item by query', function () {
            const desired = {
                title: '3. Item C title',
                description: 'Item C description',
                category: 'TestItem',
                brand: 'Searchable',
                cost: 50,
                available: true,
            }

            const others = [{
                title: '3. Item A title',
                description: 'Item A description',
                category: 'TestItem',
                brand: 'N/A',
                cost: 50,
                available: true,
            }, {
                title: '3. Item B title',
                description: 'Item B description',
                category: 'TestItem',
                brand: 'N/A',
                cost: 10,
                available: true,
            }];

            before(function () {
                saveAllItems([...others, desired]);
            });

            it('Should only contain the single item.', function () {
                return chai.request(app)
                    .get(`${api}/shop/items/search?q=earchabl`)
                    .then((res) => {
                        chai.expect(() => assertEquals(res.body, {items: [desired]})).to.not.throw();
                    });
            });

            it('Should not match any items.', function () {
                return chai.request(app)
                    .get(`${api}/shop/items/search?q=HOWMUCHWOODWOULDAWOODCHUCKCHUCKIFAWOODCHUCKCOULDCHUCKWOOD`)
                    .then((res) => {
                        chai.expect(() => assertEquals(res.body, {items: []})).to.not.throw();
                    });
            });
        });
    }
);
