import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import styles from "./styles.module.css";

function Faq({ items }) {
    return (
        <section className={styles.section} aria-labelledby="faq-title">
            <div className={styles.container}>
                <div className={styles.intro}>
                    <p className={styles.paragraphSmall}>A few helpful things</p>
                    <h2 id="faq-title">Good to <em>know.</em></h2>
                    <p>Have another question? We’re always happy to help you find the answer.</p>
                    <a href="#book">Find a time <FiArrowUpRight aria-hidden="true" /></a>
                </div>
                <div className={styles.questions}>
                    {items.map((item) => (
                        <details className={styles.question} id={item.href.slice(1)} key={item.href}>
                            <summary>
                                {item.label}
                                <FiChevronDown aria-hidden="true" />
                            </summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Faq;
