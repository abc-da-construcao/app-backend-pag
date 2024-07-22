import * as jsforce from 'jsforce';

import { env } from '@/env';

const comm = new jsforce.Connection({
  loginUrl: env.SF_LOGIN_URL,
});

comm.login(env.SF_USERNAME, env.SF_PASSWORD + env.SF_TOKEN, (err, userInfo) => {
  if (err) {
    console.error(err);
  } else {
    console.log('connected salesforce');
    // console.log(`User ID: ${userInfo.id}`);
    // console.log(`ORG ID: ${userInfo.organizationId}`);
  }
});

export default comm;
