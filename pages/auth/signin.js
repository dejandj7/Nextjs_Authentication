import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import styles from "../../styles/signin.module.css";
import homeStyles from "../../styles/Home.module.css";

const Signin = ({ csrfToken, providers }) => {
  const doSignIn = (provider) => {
    console.log(provider.id);
    signIn(provider.id);
  };

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div className={styles.wrapper} />
      <div className={styles.content}>
        <div className={styles.cardWrapper}>
          <div className={styles.cardContent}>
            <main>
              <h1 className={homeStyles.title}>Login to Grant Manager!</h1>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className={homeStyles.grid}>
                {providers &&
                  Object.values(providers).map((provider) => (
                    <div key={provider.name} style={{ marginBottom: 0 }}>
                      <button onClick={() => doSignIn(provider)}>
                        Sign in with {provider.name}
                      </button>
                    </div>
                  ))}
              </div>
            </main>
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login_pattern.svg"
        alt="Pattern Background"
        layout="fill"
        className={styles.styledPattern}
      />
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
