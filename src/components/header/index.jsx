import { useState } from "react";
import { FiCalendar, FiChevronDown, FiGithub, FiMenu, FiX } from "react-icons/fi";
import siteContent from "../../data/site-content";
import styles from "./styles.module.css";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const closeMenu = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
    };

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <a className={styles.brand} href="#home" onClick={closeMenu} aria-label="Morrow home">
                    <span className={styles.brandIcon}><FiCalendar aria-hidden="true" /></span>
                    <span>morrow<span className={styles.dot}>.</span></span>
                </a>

                <button
                    className={styles.menuButton}
                    type="button"
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={menuOpen}
                    aria-controls="main-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                </button>

                <nav
                    className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}
                    id="main-navigation"
                    aria-label="Main navigation"
                >
                    {siteContent.map(({ href, label, items }) => {
                        const dropdownId = `${label.toLowerCase().replaceAll(" ", "-")}-menu`;
                        const isOpen = openDropdown === dropdownId;

                        return (
                            <div className={styles.navItem} key={href}>
                                <div className={styles.navRow}>
                                    <a className={styles.navLink} href={href} onClick={closeMenu}>{label}</a>
                                    {items.length > 0 && (
                                        <button
                                            className={styles.dropdownButton}
                                            type="button"
                                            aria-label={`${isOpen ? "Close" : "Open"} ${label} menu`}
                                            aria-expanded={isOpen}
                                            aria-controls={dropdownId}
                                            onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
                                        >
                                            <FiChevronDown className={isOpen ? styles.chevronOpen : ""} aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                                {items.length > 0 && (
                                    <div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`} id={dropdownId}>
                                        <p className={styles.paragraphSmall}>Explore {label.toLowerCase()}</p>
                                        <ul>
                                            {items.map((item) => (
                                                <li key={item.href}>
                                                    <a href={item.href} onClick={closeMenu}>{item.label}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <a className={styles.button} href="#book" onClick={closeMenu}>Book a session <span aria-hidden="true">↗</span></a>
                </nav>
                <a
                    className={styles.repository}
                    href="https://github.com/a2rp/appointment-booking"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FiGithub aria-hidden="true" />
                    <span>Repository</span>
                </a>
            </div>
        </header>
    );
}

export default Header;
