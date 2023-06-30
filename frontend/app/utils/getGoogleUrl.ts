export const getGoogleUrl = (from: string) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options: any = {
    // redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT as string,
    // client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
    redirect_uri: process.env.NEXT_APP_GOOGLE_OAUTH_REDIRECT as string,
    client_id: process.env.NEXT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
  };

  const qs: URLSearchParams = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
