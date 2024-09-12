import { SessionProvider, getSession } from "next-auth/react";
import App from "next/app";
import { Provider } from "react-redux";
import store from "../utilities/store";
import Localization from "../utilities/localization";
import "../styles/global.scss";
import { getUserProfile, setUserProfile } from "../redux/auth/actions";
import { getCookie } from "../utilities/Utils";
import { getCustomerProfileWithTokenApi } from "../redux/auth/api";
import _ from "lodash";
import { useEffect } from "react";
import { setupSignalRConnection } from "../redux/signalR/actions";

const getToken = async (token) => {
  return token;
};

function MyApp({ Component, pageProps, session }) {
  useEffect(() => {
    if (session) {
      if (!store.getState().auth.myprofile) {
        const savedProfile = getCookie("profile");
        if (savedProfile) {
          const customer = JSON.parse(savedProfile);
          const applications = JSON.parse(getCookie("applications"));
          const roles = customer.roles.map((item) => item);
          const userRoles = customer.roles.map((item) => item.name);
          var permissions = [];
          customer.roles.forEach((element) => {
            if (userRoles.indexOf(element.name) >= 0) {
              permissions = _.union(permissions, element.permissions);
            }
          });
          permissions = _.sortBy(permissions);
          store.dispatch(
            setUserProfile(customer, roles, permissions, applications)
          );
        } else {
          getCustomerProfileWithTokenApi(
            session.user.userCustomers.filter((c) => c.isDefault === true)[0]
              ._id,
            session.accessToken
          ).then((result) => {
            const profile = result.data.customer;
            const roles = profile.roles.map((item) => item);
            const userRoles = profile.roles.map((item) => item.name);
            var permissions = [];
            profile.roles.forEach((element) => {
              if (userRoles.indexOf(element.name) >= 0) {
                permissions = _.union(permissions, element.permissions);
              }
            });
            permissions = _.sortBy(permissions);
            store.dispatch(
              setUserProfile(
                profile,
                roles,
                permissions,
                result.data.applications
              )
            );
          });
        }
      }
      if (store.getState().signalR === "") {
        store.dispatch(
          setupSignalRConnection(
            `${process.env.NEXT_PUBLIC_API_URL}/usertaskhub`,
            getToken(session.accessToken)
          )
        );
      }
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <Localization>
          <Component {...pageProps} />
        </Localization>
      </Provider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // perhaps getSession(appContext.ctx) would also work
  const session = await getSession({ req: appContext.ctx.req });
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, session };
};

export default MyApp;
