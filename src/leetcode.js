const { GraphQLClient } = require('graphql-request');
const fs = require('fs');
const nodeUrl = require('url');
const { prompt } = require('enquirer');
const ora = require('ora');
const {
  parseCookie,
  request,
  getHeaders,
  unicodeToChar,
  getSessionPath,
} = require('./utils');

const baseUrl = 'https://leetcode.com';
const loginUrl = `${baseUrl}/accounts/login/`;
const graphqlUrl = `${baseUrl}/graphql`;


const login = async (username, password) => {
  const response = await request(loginUrl);
  const {
    csrftoken,
  } = parseCookie(response);
  const options = {
    url: loginUrl,
    headers: {
      Origin: baseUrl,
      Referer: loginUrl,
      Cookie: `csrftoken=${csrftoken};`,
    },
    form: {
      csrfmiddlewaretoken: csrftoken,
      login: username,
      password,
    },
  };
  const loginRes = await request.post(options);
  if (loginRes.statusCode !== 302) {
    throw new Error('login failure');
  }
  const loginCookie = parseCookie(loginRes);
  const session = {
    LEETCODE_SESSION: loginCookie.LEETCODE_SESSION,
    csrftoken: loginCookie.csrftoken,
  };
  return session;
};

const getUsernameAndPass = async () => prompt([
  {
    type: 'input',
    name: 'username',
    message: 'username:',
  },
  {
    type: 'password',
    name: 'password',
    message: 'password:',
  },
]);


const getSession = async () => { // eslint-disable-line
  const sessionPath = getSessionPath();
  if (fs.existsSync(sessionPath)) {
    let json = fs.readFileSync(sessionPath);
    json = JSON.parse(json);
    if (json && json.session) {
      return json.session;
    }
  } else {
    const spinner = ora('Login...');
    try {
      const { username, password } = await getUsernameAndPass();
      spinner.start();
      const session = await login(username, password);
      fs.writeFile(
        sessionPath,
        JSON.stringify({
          session,
        }),
        (err) => {
          if (err) {
            console.error(`write ${sessionPath} file error`);
          }
        },
      );
      spinner.stop();
      return session;
    } catch (error) {
      spinner.stop();
      console.error('Login failure, retry...');
      return getSession();
    }
  }
};

const createGqlRequest = async () => {
  const session = await getSession();
  const client = new GraphQLClient(graphqlUrl, {
    headers: getHeaders(session),
  });
  return client.request.bind(client);
};

const createRequest = async () => {
  const session = await getSession();
  return url => request(url, {
    headers: getHeaders(session),
  });
};

const getAllACQuestions = async () => {
  const gqlRequest = await createGqlRequest();
  const json = await gqlRequest(`{
    allQuestions{
      title
      titleSlug
      status
      content
    }
  }`);
  const filterAcQuestions = (questions = []) => questions.filter(({
    status,
  }) => status === 'ac');
  const questions = json.allQuestions || [];
  return filterAcQuestions(questions);
};
const acCodeQuery = (questionSlug) => {
  const query = `{
    submissionList(offset:0,limit:10, questionSlug: "${questionSlug}"){
      submissions{
        lang
        title
        url
        statusDisplay
        id
      }
    }
  }`;
  return query;
};
const getAcCode = async (questionSlug) => {
  const qglRequest = await createGqlRequest();
  const json = await qglRequest(acCodeQuery(questionSlug));
  const submissions = (json.submissionList && json.submissionList.submissions) || [];
  const acSubmissions = submissions.filter(({
    statusDisplay,
  }) => statusDisplay === 'Accepted');
  if (acSubmissions.length > 0) {
    const {
      url,
    } = acSubmissions[0];
    const submissionUrl = nodeUrl.resolve(baseUrl, url);
    const requestWithSession = await createRequest(submissionUrl);
    const response = await requestWithSession(submissionUrl);
    // NOTE unreliable
    const matches = response.body.match(/submissionCode\s*:\s*'([\s\S]*)'\s*,\s*editCodeUrl/);
    if (matches[1]) {
      return {
        code: unicodeToChar(matches[1]),
        ...acSubmissions[0],
      };
    }
  }
  return null;
};

module.exports = {
  getAllACQuestions,
  getAcCode,
};
