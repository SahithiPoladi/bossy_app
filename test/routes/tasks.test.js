import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import config from '../../config/env';
import app from '../../server';
import { clearDatabase } from '../helpers/ClearDB';
import Task from '../../models/Task';
import User from '../../models/User';

require('sinon-mongoose');
require('sinon-as-promised');

describe('## Tasks API Tests', () => {
  let sandbox;

  beforeEach(done => {
    clearDatabase(() => {
      sandbox = sinon.sandbox.create();
      done();
    });
  });

  afterEach(done => {
    sandbox.restore();
    done();
  });

  describe('### GET /task/me', () => {});

  describe('### GET /task', () => {});

  describe('### POST /task', () => {
    it('should return the created task successfully', done => {
      request(app)
        .post('/api/task')
        .send({
          user: user._id,
          description: 'this is a test task'
        })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.user).to.equal(user._id.toString());
          expect(res.body.description).to.equal('this is a test task');
          expect(res.body._id).to.exist;
          done();
        });
    });
  });

  describe('### GET /task/user/:user_id', () => {});

  describe('### PUT /task/events', () => {});

  describe('### DELETE /task/events/:eve_id', () => {});
});

let sandbox, user;

before(done => {
  User.create({
    name: 'testuser',
    email: 'testuser',
    password: 'testuser'
  }).then(u => {
    user = u;
    done();
  });
});

beforeEach(done => {});

afterEach(done => {});
