const expect = require('chai').expect;
const request = require('supertest');

const db = require('../../db');
const makeServer = require('../factory');
const { stores, users } = require('../data');

let server;

describe('Auth controller test', () => {
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

  describe('Register user test', () => {
    const user = {
      name: 'han the great',
      email: 'hanthegreat@example.com',
      password: '123456',
      'password-confirm': '123456'
    };

    it('Should register user successfully', (done) => {
      request(server).post('/register')
        .send(user)
        .expect(302)
        .expect('location', '/')
        .end((err, res) => {
          if (err) return done(err);
          db.get().collection('users').findOne({ name: user.name })
            .then(result => {
              expect(result).to.exist;
              expect(result.email).to.eql('hanthegreat@example.com');
              done();
            })
            .catch(err => done(err));
        });
    });

    describe('Invalid user creation', () => {
      it('Should not register user without name', (done) => {
        request(server).post('/register')
          .send({ ...user, name: '' })
          .expect(302)
          .expect('location', '/register')
          .end((err, res) => {
            if (err) return done(err);
            db.get().collection('users').findOne({ email: user.email })
              .then(result => {
                expect(result).to.be.null;
                done();
              })
              .catch(err => done(err));
          });
      });

      it('Should not register user without email', (done) => {
        request(server).post('/register')
          .send({ ...user, email: '' })
          .expect(302)
          .expect('location', '/register')
          .end((err, res) => {
            if (err) return done(err);
            db.get().collection('users').findOne({ name: user.name })
              .then(result => {
                expect(result).to.be.null;
                done();
              })
              .catch(err => done(err));
          });
      });

      it('Should not register user with email that already exists', (done) => {
        request(server).post('/register')
          .send({ ...user, email: 'han@han.com' })
          .expect(302)
          .expect('location', '/register')
          .end((err, res) => {
            if (err) return done(err);
            db.get().collection('users').findOne({ name: user.name })
              .then(result => {
                expect(result).to.be.null;
                done();
              })
              .catch(err => done(err));
          });
      });

      it('Should not register user without password', (done) => {
        request(server).post('/register')
          .send({ ...user, password: '' })
          .expect(302)
          .expect('location', '/register')
          .end((err, res) => {
            if (err) return done(err);
            db.get().collection('users').findOne({ name: user.name })
              .then(result => {
                expect(result).to.be.null;
                done();
              })
              .catch(err => done(err));
          });
      });

      it('Should not register user without confirm password', (done) => {
        request(server).post('/register')
          .send({ ...user, 'password-confirm': '' })
          .expect(302)
          .expect('location', '/register')
          .end((err, res) => {
            if (err) return done(err);
            db.get().collection('users').findOne({ name: user.name })
              .then(result => {
                expect(result).to.be.null;
                done();
              })
              .catch(err => done(err));
          });
      });

      it('Should not register user if passwords do not match', (done) => {
        request(server).post('/register')
          .send({ ...user, password: '123456', 'password-confirm': '1234567' })
          .expect(302)
          .expect('location', '/register')
          .end((err, res) => {
            if (err) return done(err);
            db.get().collection('users').findOne({ name: user.name })
              .then(result => {
                expect(result).to.be.null;
                done();
              })
              .catch(err => done(err));
          });
      });
    });
  });

  describe('Login user test', () => {
    const user = {
      email: 'han@han.com',
      password: '123456'
    };

    it('Should login user successfully', (done) => {
      request(server).post('/login')
        .send(user)
        .expect(302)
        .expect('location', '/', done);
    });

    describe('Invalid user login', () => {
      it('Should not login user without email', (done) => {
        request(server).post('/login')
          .send({...user, email: ''})
          .expect(302)
          .expect('location', '/login', done);
      });

      it('Should not login user without password', (done) => {
        request(server).post('/login')
          .send({ ...user, password: '' })
          .expect(302)
          .expect('location', '/login', done);
      });

      it('Should not login user that does not exist', (done) => {
        request(server).post('/login')
          .send({ ...user, email: 'random@random.com' })
          .expect(302)
          .expect('location', '/login', done);
      });

      it('Should not login user with wrong credentials', (done) => {
        request(server).post('/login')
          .send({ ...user, password: 'random' })
          .expect(302)
          .expect('location', '/login', done);
      });
    })
  });
  
});