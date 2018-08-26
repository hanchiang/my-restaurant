const expect = require('chai').expect;
const request = require('supertest');

const db = require('../../db');
const makeServer = require('../factory');
const { stores, users } = require('../data');

let server;

describe('Store controller test', () => {
  beforeEach((done) => {
    makeServer()
      .then(s => {
        server = s;
        done();
      })
  });

  beforeEach((done) => {
    db.get().collection('stores').deleteMany({})
      .then(result => db.get().collection('stores').insertMany(stores))
      .then(result => db.get().collection('users').deleteMany({}))
      .then(result => db.get().collection('users').insertMany(users))
      .then(result => { done() })
      .catch(err => done(err));
  });

  afterEach((done) => {
    server.close(() => {
      done();
    })
  });

  const store = {
    name: 'My first store',
    description: 'This is my first store',
    tags: ['Vegetarian'],
    location: {
      address: 'Brisbane Road, Labrador QLD, Australia',
      coordinates: ['153.39388640000004', '-27.9354513']
    }
  };

  // TODO: Upload photo
  it('Should create store successfully', (done) => {
    request(server).post('/stores')
      .send(store)
      .expect(302)
      .expect('location', `/stores/My-first-store`)
      .end((err, res) => {
        if (err) return done(err);
        db.get().collection('stores').findOne({ name: store.name })
          .then(result => {
            expect(result).to.exist;
            expect(result.name).to.equal('My first store');
            done();
          })
          .catch(err => done(err));
      });
  });

  it('Should create store with same name without duplicating slug', (done) => {
    request(server).post('/stores')
      .send({ ...store, name: 'Great beer' })
      .expect(302)
      .expect('location', `/stores/Great-beer-2`)
      .end((err, res) => {
        if (err) return done(err);
        db.get().collection('stores').findOne({ slug: 'Great-beer-2' })
          .then(result => {
            expect(result).to.exist;
            expect(result.name).to.equal('Great beer');
            done();
          })
          .catch(err => done(err));
      });
  })

  describe('Invalid store creation', () => {
    it('Should not create store without name', (done) => {
      request(server).post('/stores')
        .send({ ...store, name: '' })
        .expect(302)
        .expect('location', '/add')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('stores').findOne({ description: store.description })
            .then(result => {
              expect(result).to.be.null;
              done();
            })
            .catch(err => done(err));
        })
    });

    it('Should not create store without description', (done) => {
      request(server).post('/stores')
        .send({ ...store, description: '' })
        .expect(302)
        .expect('location', '/add')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('stores').findOne({ name: store.name })
            .then(result => {
              expect(result).to.be.null;
              done();
            })
            .catch(err => done(err));
        })
    });

    it('Should not create store without location object', (done) => {
      request(server).post('/stores')
        .send({ ...store, location: '' })
        .expect(302)
        .expect('location', '/add')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('stores').findOne({ name: store.name })
            .then(result => {
              expect(result).to.be.null;
              done();
            })
            .catch(err => done(err));
        })
    });

    it('Should not create store without location address', (done) => {
      request(server).post('/stores')
        .send({ ...store, location: { ...store.location, address: '' } })
        .expect(302)
        .expect('location', '/add')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('stores').findOne({ name: store.name })
            .then(result => {
              expect(result).to.be.null;
              done();
            })
            .catch(err => done(err));
        })
    });

    it('Should not create store without location coordinates', (done) => {
      request(server).post('/stores')
        .send({ ...store, location: { ...store.location, coordinates: '' } })
        .expect(302)
        .expect('location', '/add')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('stores').findOne({ name: store.name })
            .then(result => {
              expect(result).to.be.null;
              done();
            })
            .catch(err => done(err));
        })
    });

    it('Should not create store without location coordinates(lng and lat)', (done) => {
      request(server).post('/stores')
        .send({ ...store, location: { ...store.location, coordinates: [1] } })
        .expect(302)
        .expect('location', '/add')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('stores').findOne({ name: store.name })
            .then(result => {
              expect(result).to.be.null;
              done();
            })
            .catch(err => done(err));
        })
    });
  });
});