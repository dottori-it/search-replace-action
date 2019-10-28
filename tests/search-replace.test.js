jest.mock('@actions/core');
jest.mock('fs');

const core = require('@actions/core');
const fs = require('fs');
const run = require('../src/search-replace');

/* eslint-disable no-undef */
describe('The search and replace action', () => {
  beforeEach(() => {
    core.setOutput = jest.fn().mockReturnValueOnce(undefined);
  });

  it('shuld replace text from a string', () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('o*r/iginal\\w')
      .mockReturnValueOnce('clean')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce('test o*r/iginal\\w subject');

    run();

    expect(core.setOutput).toHaveBeenCalledWith('new-subject', 'test clean subject');
  });

  it('should replace text from a file', () => {
    const path = '/an/original/fancy/path';
    fs.existsSync = jest.fn().mockReturnValueOnce(true);

    core.getInput = jest
      .fn()
      .mockReturnValueOnce('o*r/iginal\\w')
      .mockReturnValueOnce('clean')
      .mockReturnValueOnce(path)
      .mockReturnValueOnce(undefined);

    fs.readFileSync = jest.fn().mockReturnValueOnce('test content\n with o*r/iginal\\w text');
    fs.writeFileSync = jest.fn().mockReturnValueOnce(undefined);

    run();

    expect(fs.readFileSync).toHaveBeenCalledWith(path, 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(path, 'test content\n with clean text', 'utf8');

    expect(core.setOutput).toHaveBeenCalledWith('new-subject', path);
  });

  it('should prefer string value over file path, if both are provided', () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('o*r/iginal\\w')
      .mockReturnValueOnce('clean')
      .mockReturnValueOnce('/a/different/fancy/path')
      .mockReturnValueOnce('test o*r/iginal\\w subject');

    run();

    expect(core.setOutput).toHaveBeenCalledWith('new-subject', 'test clean subject');
  });

  it('should fail if a required input is missing', () => {
    core.setFailed = jest.fn().mockReturnValueOnce(undefined);

    core.getInput = jest
      .fn()
      .mockReturnValueOnce('search-value')
      .mockReturnValueOnce('new-value')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    run();

    expect(core.setFailed).toHaveBeenCalledWith('You must define one of subject or subject-path input parameter');
  });

  it('should fail if the file does not exists', () => {
    core.setFailed = jest.fn().mockReturnValueOnce(undefined);
    fs.existsSync = jest.fn().mockReturnValueOnce(false);

    const path = '/a/not/existent/path';

    core.getInput = jest
      .fn()
      .mockReturnValueOnce('search-value')
      .mockReturnValueOnce('new-value')
      .mockReturnValueOnce(path)
      .mockReturnValueOnce('');

    run();

    expect(core.setFailed).toHaveBeenCalledWith(`No file found at path ${path}`);
  });
});
