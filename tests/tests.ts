import app from '../server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import {assertEquals} from "./assertEquals";
import {User} from "../server/models/userModel";
import {ShopListing} from "../server/models/shopListingModel";
import {assertType} from "./assertType";
import mongoose from "mongoose";

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

        describe('Shop Items', function () {

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
                    return saveAllItems(targResp.items);
                });

                it('Should return an identical list of items from response', function () {
                    return chai.request(app)
                        .get(`${api}/shop/items/all`)
                        .then((res: any) => {
                            chai.expect(res.status).to.eql(200);
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
                            chai.expect(res.status).to.eql(200);
                            chai.expect(() => assertEquals(res.body, targResp)).to.not.throw();
                        });
                });

                it('Should not contain any item', function () {
                    return chai.request(app)
                        .get(`${api}/shop/items/INVALID`)
                        .then((res) => {
                            chai.expect(res.status).to.eql(400);
                            chai.expect(() => assertType(res.body, {errors: ['']})).to.not.throw();
                        });
                });
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
                    return saveAllItems([...others, desired]);
                });

                it('Should only contain the single item.', function () {
                    return chai.request(app)
                        .get(`${api}/shop/items/search?q=earchabl`)
                        .then((res) => {
                            chai.expect(res.status).to.eql(200);
                            chai.expect(() => assertEquals(res.body, {items: [desired]})).to.not.throw();
                        });
                });

                it('Should not match any items.', function () {
                    return chai.request(app)
                        .get(`${api}/shop/items/search?q=HOWMUCHWOODWOULDAWOODCHUCKCHUCKIFAWOODCHUCKCOULDCHUCKWOOD`)
                        .then((res) => {
                            chai.expect(res.status).to.eql(200);
                            chai.expect(() => assertEquals(res.body, {items: []})).to.not.throw();
                        });
                });
            });
        });

        describe('Authentication', function () {

            before(function () {
                // Remove all items within the shop listing collection.
                return User.deleteMany({/* Select everything */});
            });

            afterEach(function () {
                // Remove all items within the shop listing collection.
                return User.deleteMany({/* Select everything */});
            });

            describe('1. Signup', function () {
                const account = {
                    email: 'testing.account1@gmail.com',
                    password: 'R&nd0mP@$$w0rd',
                    displayName: 'Testing Account',
                };

                const optional = new Set([
                    'password',
                ]);

                it('Should successfully signup the user', function (done) {
                    chai.request(app)
                        .post(`${api}/auth/signup`)
                        .set('Content-Type', 'application/json')
                        .send(account)
                        .end(function (err, res) {
                            chai.expect(err).to.be.null;
                            chai.expect(res).to.have.status(201);
                            chai.expect(() => assertEquals(res.body, account, optional)).to.not.throw();
                            chai.expect(res.body.token).to.be.a('string', 'Token was expected in response.');
                            done();
                        });
                });

                it('Should fail to signup as account exists', function (done) {
                    chai.request(app)
                        .post(`${api}/auth/login`)
                        .set('Content-Type', 'application/json')
                        .send(account)
                        .end(function (err, res) {
                            chai.expect(err).to.be.null;
                            chai.expect(res).to.have.status(400);
                            chai.expect(() => assertType(res.body, {errors: ['']})).to.not.throw();
                            done();
                        });
                });
            })

            describe('2. User Login', function () {
                const account = {
                    email: 'testing.account2@gmail.com',
                    password: 'R&nd0mP@$$w0rd',
                    displayName: 'Testing Account',
                };

                const optional = new Set(['password']);

                before(function () {
                    return new User(account).save()
                });

                it('Should successfully authenticate user', function (done) {
                    chai.request(app)
                        .post(`${api}/auth/login`)
                        .set('Content-Type', 'application/json')
                        .send(account)
                        .end(function (err, res) {
                            chai.expect(err).to.be.null;
                            chai.expect(res).to.have.status(200);
                            chai.expect(() => assertEquals(res.body, account, optional)).to.not.throw();
                            chai.expect(res.body.token).to.be.a('string', 'Token was expected in response.');
                            done();
                        });
                });

                it('Should fail to authenticate user (bad pass)', function (done) {
                    chai.request(app)
                        .post(`${api}/auth/login`)
                        .set('Content-Type', 'application/json')
                        .send({...account, password: 'meep'})
                        .end(function (err, res) {
                            chai.expect(err).to.be.null;
                            chai.expect(res).to.have.status(400);
                            chai.expect(() => assertType(res.body, {errors: ['']})).to.not.throw();
                            done();
                        });
                })
            });
        });

        after(function (done) {
            mongoose.disconnect(done);
        });
    }
);
