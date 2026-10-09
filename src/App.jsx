import styles from "./App.module.css";
import Approach from "./components/approach";
import Booking from "./components/booking";
import Faq from "./components/faq";
import Footer from "./components/footer";
import GoToTop from "./components/go-to-top";
import Header from "./components/header";
import Hero from "./components/hero";
import Services from "./components/services";
import siteContent from "./data/site-content";

const sectionComponents = {
    services: Services,
    approach: Approach,
    faq: Faq,
    booking: Booking,
};

function App() {
    return (
        <div className={styles.app}>
            <Header />
            <main>
                <Hero />
                {siteContent.map(({ href, component, items }) => {
                    const id = href.slice(1);
                    const Component = sectionComponents[component];

                    return (
                        <div className={styles.sectionTarget} id={id} key={id}>
                            <Component items={items} />
                        </div>
                    );
                })}
            </main>
            <Footer />
            <GoToTop />
        </div>
    );
}

export default App;
