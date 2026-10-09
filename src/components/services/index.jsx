import { FiArrowUpRight, FiBriefcase, FiCompass, FiMessageCircle, FiRepeat } from "react-icons/fi";
import styles from "./styles.module.css";

const serviceIcons = [FiCompass, FiMessageCircle, FiBriefcase, FiRepeat];

function formatPrice(price) {
    return price === 0 ? "Complimentary" : `₹${price.toLocaleString("en-IN")}`;
}

function Services({ items }) {
    return (
        <section className={styles.section} aria-labelledby="services-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <p className={styles.paragraphSmall}>A good place to begin</p>
                        <h2 id="services-title">Find the session<br />that fits <em>you.</em></h2>
                    </div>
                    <p className={styles.intro}>Thoughtful time, shaped around what you need today. Choose a starting point and we’ll take it from there.</p>
                </div>

                <div className={styles.grid}>
                    {items.map((service, index) => {
                        const Icon = serviceIcons[index % serviceIcons.length];

                        return (
                            <article className={styles.card} id={service.href.slice(1)} key={service.href}>
                                <div className={styles.headerRow}>
                                    <span className={styles.number}>0{index + 1}</span>
                                    <span className={styles.icon}><Icon aria-hidden="true" /></span>
                                </div>
                                <p className={styles.label}>{service.category}</p>
                                <h3>{service.label}</h3>
                                <p className={styles.paragraph}>{service.description}</p>
                                <div className={styles.footer}>
                                    <span>{service.duration}</span>
                                    <span>{formatPrice(service.price)}</span>
                                </div>
                                <a className={styles.link} href="#book" aria-label={`Book ${service.label}`}>
                                    <FiArrowUpRight aria-hidden="true" />
                                </a>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Services;
