import { FiArrowUpRight } from "react-icons/fi";
import siteContent from "../../data/site-content";
import styles from "./styles.module.css";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <a className={styles.brand} href="#home" aria-label="Morrow, back to top">morrow<span>.</span></a>
                    <p>Make room for what matters.</p>
                    <nav className={styles.navigation} aria-label="Footer links">
                        {siteContent.map(({ href, label }) => (
                            <a href={href} key={href}>{label}</a>
                        ))}
                        <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Portfolio</a>
                        <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">GitHub</a>
                        <a href="https://codepen.io/ash1198" target="_blank" rel="noreferrer">CodePen</a>
                        <a href="https://www.linkedin.com/in/aashishranjan" target="_blank" rel="noreferrer">LinkedIn</a>
                        <a href="https://www.facebook.com/theash.ashish/" target="_blank" rel="noreferrer">Facebook</a>
                        <a href="https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1" target="_blank" rel="noreferrer">YouTube</a>
                        <a href="mailto:ash.ranjan09@gmail.com">Email</a>
                        <a href="https://a2rp-donation-page.netlify.app/" target="_blank" rel="noreferrer">Support</a>
                        <a href="https://buymeacoffee.com/ashishranjan" target="_blank" rel="noreferrer">Buy Me a Coffee</a>
                        <a href="https://www.patreon.com/ashishranjan" target="_blank" rel="noreferrer">Patreon</a>
                    </nav>
                </div>
                <div className={styles.bottom}>
                    <p>© {year} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
                    <a href="https://github.com/a2rp/appointment-booking" target="_blank" rel="noreferrer">
                        Source code <FiArrowUpRight aria-hidden="true" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
