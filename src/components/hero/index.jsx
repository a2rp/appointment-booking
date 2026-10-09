import { FiArrowDownRight, FiArrowUpRight, FiCalendar, FiClock, FiHeart } from "react-icons/fi";
import styles from "./styles.module.css";

function Hero() {
    return (
        <section className={styles.hero} id="home" aria-labelledby="hero-title">
            <div className={styles.container}>
                <div className={styles.copy}>
                    <p className={styles.paragraphSmall}><span /> A little more room in your day</p>
                    <h1 id="hero-title">Good things happen when <em>you make time.</em></h1>
                    <p className={styles.paragraph}>
                        Thoughtful one-to-one sessions, with a time and a person that feel right for you.
                    </p>
                    <div className={styles.actions}>
                        <a className={styles.buttonPrimary} href="#book">
                            Find your time <FiArrowUpRight aria-hidden="true" />
                        </a>
                        <a className={styles.buttonSecondary} href="#services">
                            Explore sessions <FiArrowDownRight aria-hidden="true" />
                        </a>
                    </div>
                    <div className={styles.reviews}>
                        <div className={styles.avatarStack} aria-hidden="true">
                            <span>M</span><span>J</span><span>A</span>
                        </div>
                        <p><strong>People-first, always.</strong><br />A thoughtful space to begin.</p>
                        <span className={styles.rating}><FiHeart aria-hidden="true" /> 4.9 <small>from 240+ visits</small></span>
                    </div>
                </div>

                <div className={styles.heroArt} aria-label="A preview of your next appointment">
                    <div className={styles.artCircle} />
                    <div className={styles.label}><span>YOUR NEXT GOOD THING</span><FiArrowUpRight aria-hidden="true" /></div>
                    <div className={styles.appointmentCard}>
                        <div className={styles.headerRow}>
                            <span className={styles.calendarIcon}><FiCalendar aria-hidden="true" /></span>
                            <span>TAKE A MOMENT</span>
                        </div>
                        <p className={styles.heading}>A session<br />made for <em>you.</em></p>
                        <div className={styles.divider} />
                        <div className={styles.cardDetails}>
                            <span><FiClock aria-hidden="true" /> 45 minutes, well spent</span>
                            <span className={styles.cardDot} />
                            <span>In person or online</span>
                        </div>
                    </div>
                    <div className={styles.footer}><span>MAKE SPACE FOR YOURSELF</span><span>01 / 04</span></div>
                    <span className={styles.artSparkle} aria-hidden="true">✳</span>
                </div>
            </div>
        </section>
    );
}

export default Hero;
