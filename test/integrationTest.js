const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const server = 'localhost:8080';

/*
 * Test Suite for make DB connection
 */
describe('Test Suite', function () {
    before(function (done) {
        mongoose.connect('mongodb://localhost/transport_apis', function (error) {
            if (error) console.error('Mongo connection error:\n%\n', error);
            console.log('connected');
            done(error);
        });
    });
});

/*
 * Add order
 */
describe('/POST orders', () => {
    it('should return error for invalid format due to incomplete request data', (done) => {
        chai.request(server)
            .post('/orders')
            .send({
                origin: ["28", "70"],
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return 400 with invalid format', (done) => {
        chai.request(server)
            .post('/orders')
            .send({
                origin: ["28", "70"],
                destination: ["29.754", 70]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should create order with valid request', (done) => {
        chai.request(server)
            .post('/orders')
            .send({
                "origin": ["23.685", "72"],
                "destination": ["28", "79.786"]
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('distance');
                expect(res.body.distance).to.be.a('number');
                expect(res.body.status).to.be.equal('UNASSIGNED');
                done();
            });
    });

    it('should return error because of invalid coordinates', (done) => {
        chai.request(server)
            .post('/orders')
            .send({
                origin: ["2", "70.786"],
                destination: ["28.6756", "7"]
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
});

/*
 * 404
 */
describe('GET /', () => {
    it('404 for invalid urls', (done) => {
        chai.request(server)
            .get('/')
            .end(function (err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });
});

/*
 * 405
 */
describe('DELETE orders/9476837', () => {
    it('405 for invalid method and path', (done) => {
        chai.request(server)
            .post('/order')
            .send({
                origin: ["2", "70.786"],
                destination: ["28.6756", "7"]
            })
            .end((err, res) => {
                expect(res).to.have.status(405);
                done();
            });
    });
});

/*
 * Patch order
 */
describe('/PATCH /orders/:id', () => {
    it('returns error due to invalid mongo id', (done) => {
        chai.request(server)
            .patch('/orders/5beb29b8e7c73b234a1fe6dc')
            .send({
                status: "TAKEN"
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return error due to wrong param passed', (done) => {
        chai.request(server)
            .get('/orders?page=1&limit=1')
            .end((err, res) => {
                chai.request(server)
                    .patch('/orders/' + res.body[0].id)
                    .send({
                        statuses: "TAKEN"
                    }).end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    })
            });
    });

    it('should return success for patched order', (done) => {
        chai.request(server)
            .get('/orders?page=1&limit=1')
            .end((err, res) => {
                chai.request(server)
                    .patch('/orders/' + res.body[0].id)
                    .send({
                        status: "TAKEN"
                    }).end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    })
            });
    });

    it('should return failure for updating status to TAKEN of already taken order', (done) => {
        chai.request(server)
            .get('/orders?page=1&limit=1')
            .end((err, res) => {
                let order = res;
                chai.request(server)
                    .patch('/orders/' + res.body[0].id)
                    .send({
                        status: "TAKEN"
                    }).end((err, res) => {
                        expect(res).to.have.status(404);
                        chai.request(server)
                            .patch('/orders/' + order.body[0].id)
                            .send({
                                status: "UNASSIGNED"
                            }).end((err, res) => {
                                done();
                            });
                    })
            });
    });
});

/*
 * List orders
 */
describe('GET /', () => {

    it('should return error for not imcomplete params', (done) => {
        chai.request(server)
            .get('/orders?page=1')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return error due to invalid value of params', (done) => {
        chai.request(server)
            .get('/orders?page=1&limit=kjj6')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return only 1 order, with correct format', (done) => {
        chai.request(server)
            .get('/orders?page=1&limit=1')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body[0]).to.have.property('distance');
                expect(res.body[0].distance).to.be.a('number');
                expect(res.body[1]).to.be.undefined;
                done();
            });
    });

    it('should return error due to page num = 0', (done) => {
        chai.request(server)
            .get('/orders?page=0&limit=1')
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
});
