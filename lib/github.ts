export const getAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    }
  });
  const {error, access_token} = await accessTokenResponse.json();

  return {error, access_token};
}

interface Email {
  primary: boolean;
  verified: boolean;
  visibility: string;
  email: string;
}

export const getEmail = async (access_token: string) => {
  const userEmailREsponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  });

  const emails = await userEmailREsponse.json();

  const userEmail = emails.find((email: Email) => email.primary && email.verified && email.visibility === 'public').email;

  return userEmail;
};

export const getUserProfile = async (access_token: string) => {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache',
  });

  const {id, avatar_url, login} = await userProfileResponse.json();

  return {id, avatar_url, login};
}
