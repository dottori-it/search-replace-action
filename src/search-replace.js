const core = require('@actions/core');
const fs = require('fs');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function truncate(str, limit) {
  return `${str.slice(0, limit)} ...`;
}

function run() {
  try {
    core.debug('Executing search and replace action with:');

    const searchValue = core.getInput('search-value', { required: true });
    core.debug(`search value [${searchValue}]`);
    const newValue = core.getInput('new-value', { required: true });
    core.debug(`new value [${newValue}]`);

    const subjectPath = core.getInput('subject-path');
    core.debug(`subject path [${subjectPath}]`);
    const subject = core.getInput('subject');
    core.debug(`subject [${subject}]`);

    const searchRegEx = new RegExp(escapeRegExp(searchValue), 'g');
    core.debug(`search RegEx [${searchRegEx}]`);

    let result;

    if (subject) {
      core.debug('replacing from string subject');
      result = subject.replace(searchRegEx, newValue);
      core.debug('replaced from string subject');
    } else if (subjectPath) {
      core.debug('replacing from file subject');
      if (!fs.existsSync(subjectPath)) {
        throw new Error(`No file found at path ${subjectPath}`);
      }
      const content = fs.readFileSync(subjectPath, 'utf8').replace(searchRegEx, newValue);

      core.debug(`found file with content [ ${truncate(content, 50)} ]`);

      fs.writeFileSync(subjectPath, content, 'utf8');
      result = subjectPath;
      core.debug('replaced from file subject');
    } else {
      throw new Error('You must define one of subject or subject-path input parameter');
    }

    core.setOutput('new-subject', result);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
