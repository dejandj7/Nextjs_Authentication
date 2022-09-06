import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useSession } from 'next-auth/react'
import Header from '../components/Header'
import stylesPage from '../styles/Signin.module.css'
import { useEffect } from 'react'
import axios from 'axios'

const Home = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const data = axios.get("http://localhost:3000/api/calendar")
      .then((response) => {
        const json = response.data;
        return {
          props: {
            data: json,
          },
        };
      });
    return data;
  }, [])

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <Header />
      <div className={stylesPage.wrapper} />
      <div className={stylesPage.content}>
        <div className={stylesPage.cardWrapper}>
          <div className={stylesPage.cardContent}>
            <main>
              {
                session &&
                <>
                  <p style={{ marginBottom: '10px' }}> Welcome, {session.user.name ?? session.user.email}</p> <br />
                  <img src={session.user.image} alt="" className={styles.avatar} referrerPolicy="no-referrer" />
                </>
              }
              {
                !session &&
                <>
                  <h1 className={styles.title}>
                    Welcome to Parking Assistant!
                  </h1>
                  <div className={styles.grid}>
                    <Link passHref href="/auth/signin">
                      <a href="#" className="btn-signin">Sign in</a>
                    </Link>
                  </div>
                  <img src="https://cdn.dribbble.com/users/759083/screenshots/6915953/2.gif" alt="" className={styles.avatar} />
                  <p className={styles.credit}>GIF by <a href="https://dribbble.com/shots/6915953-Another-man-down/attachments/6915953-Another-man-down?mode=media">Another man</a> </p>
                </>
              }
            </main>
          </div></div>
      </div>
      <img src='/login_pattern.svg' alt='Pattern Background' layout='fill' className={stylesPage.styledPattern} />
    </div>
  )
}

export default Home;