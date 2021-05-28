import OktaJwtVerifier from '@okta/jwt-verifier';
import * as okta from '@okta/okta-sdk-nodejs';

require('dotenv').config();

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `https://${process.env.OKTA_DOMAIN}/oauth2/default`
});

const client = new okta.Client({
  orgUrl: `https://${process.env.OKTA_DOMAIN}`,
  token: process.env.OKTA_API_TOKEN,
});

const getUserIdFromToken = async (token) => {
  if (!token) return;

  try {
    const jwt = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
    return jwt.claims.sub;
  } catch (error) {
    console.log("there was an error with getting user id");
  }
};

const getUser = async (userId, store) => {
  if (!userId) return;

  try {
    const oktaUser = await client.getUser(userId);
    console.log(oktaUser.profile.email);

    const users = await store.users.findOrCreate({ where: { email: oktaUser.profile.email }});

    let currentUser = users && users[0] ? users[0] : null;
    if (currentUser != null && !currentUser.first)  {
      currentUser.first = oktaUser.profile.firstName;
      currentUser.last = oktaUser.profile.lastName;
      await currentUser.save();
    }
    return currentUser;

  } catch (error) {
     console.log("there was an error");
  }
};

module.exports = { getUserIdFromToken, getUser };

