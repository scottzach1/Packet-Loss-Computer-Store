import '../server/db';
import app from '../server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import mongoose from "mongoose";

chai.use(chaiHttp);

const api = '/api/v1';

describe('API Tests', function () {

        before((done) => {
            require('../server/db');
            done();
        });

        describe('Get all items request', () => {
            it('Should return a list of items on call', () => {
                return chai.request(app).get(`${api}/shop/items/all`)
                    .then((res) => {
                        chai.expect(res.text).to.contain('[');
                    });
            });
        });

        describe('Get all items request', () => {
            it('Should return a list of items on call', () => {
                return chai.request(app).get(`${api}/shop/items/all`)
                    .then((res) => {
                        chai.expect(res.text).to.contain('[');
                    });
            });
        });

        after((done) => {
            mongoose.disconnect(done);
        });
    }
)
