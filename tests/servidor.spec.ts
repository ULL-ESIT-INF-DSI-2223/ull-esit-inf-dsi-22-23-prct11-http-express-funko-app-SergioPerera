
import 'mocha';
import { expect } from 'chai';
import request from 'request';
import express from 'express';

const app = express();

describe('Test server app', () => {
  describe('GET /execmd', () => {

    it('should return output of command', (done) => {
      const cmd = 'echo';
      const args = 'hello world';
      const expectedOutput = 'hello world\n';

      request.get(`http://localhost:3000/execmd?cmd=${cmd}&args=${args}`, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(body)).to.deep.equal({ output: expectedOutput });
        done();
      });
    });

    it('should return an error if missing cmd parameter', (done) => {
      request.get('http://localhost:3000/execmd', (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(JSON.parse(body)).to.deep.equal({ error: 'Missing cmd parameter' });
        done();
      });
    });

    it('should return an error if command does not exist', (done) => {
      const cmd = 'nonexistentcommand';

      request.get(`http://localhost:3000/execmd?cmd=${cmd}`, (err, res, body) => {
        expect(res.statusCode).to.equal(500);
        expect(JSON.parse(body)).to.deep.equal({ error: `Command failed: ${cmd} \n/bin/sh: 1: ${cmd}: not found\n` });
        done();
      });
    });

    it('should return an error if command emits an error', (done) => {
      const cmd = 'ls';
      const args = 'pepo';
    
      request.get(`http://localhost:3000/execmd?cmd=${cmd}&args=${args}`, (err, res, body) => {
        expect(res.statusCode).to.equal(500);
        expect(JSON.parse(body)).to.have.property('error');
        done();
      });
    });

  });
});
