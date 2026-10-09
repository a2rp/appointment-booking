import { FiArrowUpRight, FiCalendar, FiCheck, FiUser } from "react-icons/fi";
import styles from "./styles.module.css";

const stepIcons = [FiCheck, FiCalendar, FiUser];

function Approach({ items }) {
    return (
        <section className={styles.section} aria-labelledby="approach-title">
            <div className={styles.container}>
                <div className={styles.intro}>
                    <p className={styles.paragraphSmall}>Easy from the start</p>
                    <h2 id="approach-title">A few simple steps.<br /><em>Then it’s yours.</em></h2>
                    <p>No back and forth. Choose what you need, find a time, and we’ll be ready to welcome you.</p>
                    <a className={styles.link} href="#book">Let’s find a time <FiArrowUpRight aria-hidden="true" /></a>
                </div>
                <div className={styles.steps}>
                    {items.map((item, index) => {
                        const Icon = stepIcons[index % stepIcons.length];

                        return (
                            <article className={styles.step} id={item.href.slice(1)} key={item.href}>
                                <span className={styles.number}>0{index + 1}</span>
                                <span className={styles.icon}><Icon aria-hidden="true" /></span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Approach;
