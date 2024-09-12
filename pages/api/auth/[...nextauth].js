import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import { fetchPostApi } from "../../../redux/fetchHelper";
import _ from "lodash";

const tenantName = process.env.AZURE_AD_B2C_TENANT_NAME;
const userFlow = process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW;

const callbacks = {
  async redirect({ baseUrl }) {
    return baseUrl;
  },
  async signIn({ user }) {
    return user;
  },
  async jwt({ token, user }) {
    if (user) {
      console.log(user);
      const { newtoken, ...loggeduser } = user;
      token.accessToken = newtoken;
      token.user = loggeduser;
    }
    return token;
  },
  async session({ session, token }) {
    if (session) {
      session.accessToken = token.accessToken;
      session.user = token.user;
    }
    return session;
  },
};

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        let newtoken;
        let user;
        await fetchPostApi(
          `${process.env.NEXT_PUBLIC_API_URL}/user/login/submission`,
          {
            data: {
              idToken: {
                email: profile.email,
              },
              email: profile.email,
            },
            user: {
              email: profile.email,
              fullName: profile.name,
            },
          }
        ).then((response) => {
          user = response.data.user;
          newtoken = response.headers["x-jwt-token"];
        });
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture,
          username: profile.email,
          userId: user._id,
          userCustomers: user.userCustomers,
          roles: user.roles,
          newtoken,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      async profile(profile) {
        let newtoken;
        let user;
        let permissions = [];
        await fetchPostApi(
          `${process.env.NEXT_PUBLIC_API_URL}/user/login/submission`,
          {
            data: {
              idToken: {
                email: profile.email,
              },
              email: profile.email,
            },
            user: {
              email: profile.email,
              fullName: profile.name,
            },
          }
        ).then((response) => {
          user = response.data.user;
          newtoken = response.headers["x-jwt-token"];
        });
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture,
          username: profile.email,
          userId: user._id,
          userCustomers: user.userCustomers,
          roles: user.roles,
          newtoken,
        };
      },
    }),
    // AzureADB2CProvider({
    //   tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
    //   clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
    //   clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
    //   primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
    //   authorization: {
    //     params: {
    //       scope: "offline_access openid email profile",
    //       grant_type: "authorization_code",
    //     },
    //   },
    // }),
    {
      id: "azureb2c",
      name: "Azure B2C",
      type: "oauth",
      version: "2.0",
      debug: true,
      scope: "offline_access openid email profile",
      params: {
        grant_type: "authorization_code",
      },
      accessTokenUrl: `https://fosmapp.b2clogin.com/fosmapp.onmicrosoft.com/B2C_1_SignInOrSignUp/oauth2/v2.0/token`,
      // requestTokenUrl: `https://login.microsoftonline.com/${process.env.AUTH_TENANT_GUID}/oauth2/v2.0/token`,
      authorizationUrl:
        "https://fosmapp.b2clogin.com/fosmapp.onmicrosoft.com/B2C_1_SignInOrSignUp/oauth2/v2.0/authorize?response_type=code+id_token&response_mode=form_post",
      wellKnown:
        "https://login.microsoftonline.com/bc080077-5127-421b-9797-bb4e99dbbac0/v2.0/.well-known/openid-configuration",
      profileUrl: "https://graph.microsoft.com/v1.0/users",
      profile(profile) {
        console.log(profile);
        return {
          id: profile.sub,
          name: profile.name,
          //email: profile.emails[0],
          image: null,
        };
      },
      //tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
      idToken: true,
      state: false,
    },
  ],
  callbacks,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
    //newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 60 minutes
  },
  jwt: {
    secret: "1g9BVIJWkrQkLUwTW67bjgDX7Abj3CX58RYZ5BOIUM4",
  },
  secret: "1g9BVIJWkrQkLUwTW67bjgDX7Abj3CX58RYZ5BOIUM4",
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
