import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiCheck, FiClock, FiUser } from "react-icons/fi";
import siteContent from "../../data/site-content";
import styles from "./styles.module.css";

const services = siteContent.find((section) => section.component === "services").items;
const timeSlots = ["09:30 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:00 PM", "03:30 PM", "04:30 PM"];
const specialists = ["No preference", "Maya Kapoor", "Dev Mehta", "Aarav Shah"];
const storageKey = "morrow-bookings";
const bookingWindowDays = 30;
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function atNoon(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

function toDateValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fromDateValue(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day, 12);
}

function getToday() {
    return atNoon(new Date());
}

function getFirstAvailableDate(today, maxDate) {
    for (let date = addDays(today, 1); date <= maxDate; date = addDays(date, 1)) {
        if (date.getDay() !== 0) return toDateValue(date);
    }

    return toDateValue(addDays(today, 1));
}

function getCalendarOptions(month) {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1, 12);
    const firstCell = addDays(firstOfMonth, -firstOfMonth.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = addDays(firstCell, index);

        return {
            value: toDateValue(date),
            weekday: weekdays[date.getDay()],
            day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
            inMonth: date.getMonth() === month.getMonth(),
            date,
        };
    });
}

function getUnavailableSlots(dateValue) {
    const date = fromDateValue(dateValue);
    const unavailable = new Set();

    if (date.getDay() === 6) unavailable.add("09:30 AM");
    if (date.getDate() % 3 === 0) unavailable.add("11:30 AM");
    if (date.getDate() % 5 === 0) unavailable.add("03:30 PM");

    return unavailable;
}

function readSavedBookings() {
    try {
        const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
        if (!Array.isArray(saved)) return [];

        return saved
            .filter((booking) => booking && typeof booking === "object")
            .map((booking, index) => ({
                ...booking,
                id: String(booking.id || booking.createdAt || `saved-${index}`),
            }));
    } catch {
        return [];
    }
}

function formatDate(dateValue) {
    if (typeof dateValue !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return typeof dateValue === "string" && dateValue ? dateValue : "Date unavailable";
    }

    const date = fromDateValue(dateValue);
    if (Number.isNaN(date.getTime()) || toDateValue(date) !== dateValue) return dateValue;

    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatMonth(date) {
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function formatPrice(price) {
    return price === 0 ? "Complimentary" : `₹${price.toLocaleString("en-IN")}`;
}

function Booking() {
    const [today] = useState(getToday);
    const maxDate = addDays(today, bookingWindowDays);
    const firstAvailableDate = getFirstAvailableDate(today, maxDate);
    const [selectedService, setSelectedService] = useState((services[1] || services[0]).href);
    const [selectedDate, setSelectedDate] = useState(firstAvailableDate);
    const [selectedTime, setSelectedTime] = useState(() => timeSlots.find((time) => !getUnavailableSlots(firstAvailableDate).has(time)));
    const [specialist, setSpecialist] = useState(specialists[0]);
    const [confirmation, setConfirmation] = useState(null);
    const [stage, setStage] = useState("details");
    const [reviewDetails, setReviewDetails] = useState(null);
    const [formValues, setFormValues] = useState({ name: "", email: "", phone: "" });
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const date = fromDateValue(firstAvailableDate);
        return new Date(date.getFullYear(), date.getMonth(), 1, 12);
    });
    const [savedBookings, setSavedBookings] = useState(readSavedBookings);
    const [historyMessage, setHistoryMessage] = useState("");
    const selectedServiceDetails = services.find((service) => service.href === selectedService);
    const dateOptions = getCalendarOptions(visibleMonth);
    const unavailableSlots = getUnavailableSlots(selectedDate);
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    const lastBookableMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1, 12);
    const disablePreviousMonth = visibleMonth <= currentMonth;
    const disableNextMonth = visibleMonth >= lastBookableMonth;

    const submitBooking = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setReviewDetails({
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
        });
        setStage("review");
    };

    const confirmBooking = () => {
        if (!reviewDetails || !selectedServiceDetails) return;

        const request = {
            id: window.crypto.randomUUID(),
            ...reviewDetails,
            service: selectedServiceDetails.label,
            price: selectedServiceDetails.price,
            duration: selectedServiceDetails.duration,
            date: selectedDate,
            time: selectedTime,
            specialist,
            createdAt: new Date().toISOString(),
        };
        const nextBookings = [request, ...savedBookings];
        let savedOnDevice = false;

        try {
            window.localStorage.setItem(storageKey, JSON.stringify(nextBookings));
            setSavedBookings(nextBookings);
            savedOnDevice = true;
        } catch {
            setHistoryMessage("This browser could not save the demo request.");
        }

        setConfirmation({ ...request, savedOnDevice });
        setStage("confirmation");
    };

    const removeSavedBooking = (id) => {
        const nextBookings = savedBookings.filter((booking) => booking.id !== id);

        try {
            window.localStorage.setItem(storageKey, JSON.stringify(nextBookings));
            setSavedBookings(nextBookings);
            setHistoryMessage("Demo request removed from this browser.");
        } catch {
            setHistoryMessage("This browser could not update the saved requests.");
        }
    };

    const startAnotherBooking = () => {
        setConfirmation(null);
        setReviewDetails(null);
        setFormValues({ name: "", email: "", phone: "" });
        setStage("details");
    };

    return (
        <section className={styles.section} aria-labelledby="booking-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.paragraphSmall}>The good part starts here</p>
                    <h2 id="booking-title">Let’s make <em>some time.</em></h2>
                    <p>Choose what works for you. You can review everything before you book.</p>
                </div>

                <ol className={styles.progress} aria-label="Booking progress">
                    {["Choose date and details", "Review", "Confirmation"].map((label, index) => {
                        const step = index + 1;
                        const activeStep = stage === "details" ? 1 : stage === "review" ? 2 : 3;
                        const complete = step < activeStep;

                        return (
                            <li
                                className={`${styles.progressStep} ${step === activeStep ? styles.progressStepActive : ""} ${complete ? styles.progressStepComplete : ""}`}
                                aria-current={step === activeStep ? "step" : undefined}
                                key={label}
                            >
                                <span>{complete ? <FiCheck aria-hidden="true" /> : `0${step}`}</span>{label}
                            </li>
                        );
                    })}
                </ol>

                {confirmation ? (
                    <div className={styles.confirmation} role="status">
                        <span className={styles.icon}><FiCheck aria-hidden="true" /></span>
                        <p className={styles.paragraphSmall}>
                            {confirmation.savedOnDevice ? `Demo request saved for ${confirmation.name.split(" ")[0]}` : "Demo request ready"}
                        </p>
                        <h3>{confirmation.savedOnDevice ? <>Your request is <em>saved.</em></> : <>Your request is <em>ready.</em></>}</h3>
                        <p className={styles.paragraph}>
                            {confirmation.service} · {formatDate(confirmation.date)} at {confirmation.time}.
                        </p>
                        <div className={styles.details}>
                            <span><FiCalendar aria-hidden="true" /> {formatDate(confirmation.date)}</span>
                            <span><FiClock aria-hidden="true" /> {confirmation.time} · {confirmation.duration}</span>
                            <span><FiUser aria-hidden="true" /> {confirmation.specialist}</span>
                        </div>
                        <p className={styles.note}>
                            {confirmation.savedOnDevice
                                ? "Saved in this browser only. This demo does not reserve the time or send your request to a business."
                                : "This browser could not save your request. It was not sent to a business."}
                        </p>
                        <button className={styles.buttonSecondary} type="button" onClick={startAnotherBooking}>
                            <FiArrowLeft aria-hidden="true" /> Book another session
                        </button>
                    </div>
                ) : stage === "review" ? (
                    <div className={styles.reviewCard} aria-labelledby="review-title">
                        <p className={styles.reviewEyebrow}>Step 2 of 3 · Review</p>
                        <h3 id="review-title">A quick final check</h3>
                        <p className={styles.reviewIntro}>Make sure the session and contact details look right before saving this demo request.</p>
                        <dl className={styles.reviewList}>
                            <div><dt>Session</dt><dd>{selectedServiceDetails.label} · {selectedServiceDetails.duration}</dd></div>
                            <div><dt>Date</dt><dd>{formatDate(selectedDate)}</dd></div>
                            <div><dt>Time</dt><dd>{selectedTime}</dd></div>
                            <div><dt>Specialist</dt><dd>{specialist}</dd></div>
                            <div><dt>Name</dt><dd>{reviewDetails?.name}</dd></div>
                            <div><dt>Email</dt><dd>{reviewDetails?.email}</dd></div>
                            <div><dt>Phone</dt><dd>{reviewDetails?.phone}</dd></div>
                            <div><dt>Total</dt><dd>{formatPrice(selectedServiceDetails.price)}</dd></div>
                        </dl>
                        <p className={styles.reviewNotice}>This is a frontend demo. Saving keeps the request in this browser; it does not reserve availability or contact the business.</p>
                        <div className={styles.reviewActions}>
                            <button className={styles.secondaryAction} type="button" onClick={() => setStage("details")}>
                                <FiArrowLeft aria-hidden="true" /> Edit details
                            </button>
                            <button className={styles.primaryAction} type="button" onClick={confirmBooking}>
                                Confirm and save <FiArrowRight aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className={styles.bookingLayout} onSubmit={submitBooking}>
                        <div className={styles.formCard}>
                            <div className={styles.bookingStep} id="choose-service">
                                <div className={styles.headerRow}>
                                    <span>01</span>
                                    <div><h3>Choose your session</h3><p>What would feel helpful?</p></div>
                                </div>
                                <div className={styles.serviceChoices}>
                                    {services.map((service) => {
                                        const active = selectedService === service.href;

                                        return (
                                            <button
                                                className={`${styles.serviceChoice} ${active ? styles.serviceChoiceActive : ""}`}
                                                type="button"
                                                key={service.href}
                                                aria-pressed={active}
                                                onClick={() => setSelectedService(service.href)}
                                            >
                                                <span className={styles.radioMark}>{active && <span />}</span>
                                                <span className={styles.choiceText}>
                                                    <strong>{service.label}</strong>
                                                    <small>{service.duration} · {formatPrice(service.price)}</small>
                                                </span>
                                                <span className={styles.choiceArrow} aria-hidden="true"><FiArrowRight /></span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.bookingStep} id="pick-a-time">
                                <div className={styles.headerRow}>
                                    <span>02</span>
                                    <div><h3>Pick a day and time</h3><p>Choose an open date in the next 30 days.</p></div>
                                </div>
                                <div className={styles.calendar} role="group" aria-label="Choose an appointment date">
                                    <div className={styles.calendarHeader}>
                                        <button
                                            type="button"
                                            aria-label="Previous month"
                                            disabled={disablePreviousMonth}
                                            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1, 12))}
                                        ><FiArrowLeft aria-hidden="true" /></button>
                                        <p aria-live="polite">{formatMonth(visibleMonth)}</p>
                                        <button
                                            type="button"
                                            aria-label="Next month"
                                            disabled={disableNextMonth}
                                            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1, 12))}
                                        ><FiArrowRight aria-hidden="true" /></button>
                                    </div>
                                    <div className={styles.weekdays} aria-hidden="true">
                                        {weekdays.map((weekday) => <span key={weekday}>{weekday}</span>)}
                                    </div>
                                    <div className={styles.dateChoices}>
                                    {dateOptions.map((date) => {
                                        const active = selectedDate === date.value;
                                        const isBookable = date.date > today && date.date <= maxDate && date.date.getDay() !== 0;

                                        if (!date.inMonth) return <span className={styles.calendarBlank} key={date.value} aria-hidden="true" />;

                                        return (
                                            <button
                                                className={`${styles.dateChoice} ${active ? styles.dateChoiceActive : ""}`}
                                                type="button"
                                                key={date.value}
                                                disabled={!isBookable}
                                                aria-label={`${date.weekday}, ${formatDate(date.value)}${isBookable ? ", available" : ", unavailable"}`}
                                                aria-pressed={active}
                                                onClick={() => {
                                                    setSelectedDate(date.value);
                                                    setSelectedTime(timeSlots.find((time) => !getUnavailableSlots(date.value).has(time)));
                                                }}
                                            >
                                                <span>{date.weekday}</span><strong>{date.day}</strong>
                                            </button>
                                        );
                                    })}
                                    </div>
                                    <p className={styles.calendarHint}>Sundays and dates outside the 30-day window are unavailable in this demo.</p>
                                </div>
                                <p className={styles.availableLabel}>Available times</p>
                                <div className={styles.timeChoices} aria-label="Available times">
                                    {timeSlots.map((time) => {
                                        const active = selectedTime === time;
                                        const unavailable = unavailableSlots.has(time);

                                        return (
                                            <button
                                                className={`${styles.timeChoice} ${active ? styles.timeChoiceActive : ""} ${unavailable ? styles.timeChoiceUnavailable : ""}`}
                                                type="button"
                                                key={time}
                                                aria-label={`${time}${unavailable ? ", unavailable sample slot" : ""}`}
                                                aria-pressed={active && !unavailable}
                                                disabled={unavailable}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}{unavailable && <small>Unavailable</small>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.bookingStep} id="meet-your-specialist">
                                <div className={styles.headerRow}>
                                    <span>03</span>
                                    <div><h3>A few details</h3><p>So we know who to expect.</p></div>
                                </div>
                                <label className={styles.selectLabel} htmlFor="specialist">Your specialist</label>
                                <select
                                    className={styles.select}
                                    id="specialist"
                                    value={specialist}
                                    onChange={(event) => setSpecialist(event.target.value)}
                                >
                                    {specialists.map((person) => <option key={person}>{person}</option>)}
                                </select>
                                <div className={styles.contactFields}>
                                    <label>Name<input name="name" autoComplete="name" placeholder="Your name" value={formValues.name} onChange={(event) => setFormValues({ ...formValues, name: event.target.value })} required /></label>
                                    <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formValues.email} onChange={(event) => setFormValues({ ...formValues, email: event.target.value })} required /></label>
                                    <label>Phone<input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" value={formValues.phone} onChange={(event) => setFormValues({ ...formValues, phone: event.target.value })} required /></label>
                                </div>
                            </div>
                        </div>

                        <aside className={styles.summaryCard} aria-label="Appointment summary">
                            <div className={styles.headerRow}><span>Your appointment</span><FiCalendar aria-hidden="true" /></div>
                            <p className={styles.heading}>{selectedServiceDetails.label}</p>
                            <p className={styles.paragraph}>{selectedServiceDetails.description}</p>
                            <div className={styles.divider} />
                            <dl className={styles.list}>
                                <div><dt><FiCalendar aria-hidden="true" /> Day</dt><dd>{formatDate(selectedDate)}</dd></div>
                                <div><dt><FiClock aria-hidden="true" /> Time</dt><dd>{selectedTime}</dd></div>
                                <div><dt><FiUser aria-hidden="true" /> With</dt><dd>{specialist}</dd></div>
                            </dl>
                            <div className={styles.price}><span>Total</span><strong>{formatPrice(selectedServiceDetails.price)}</strong></div>
                            <button className={styles.buttonPrimary} type="submit">Review appointment <FiArrowRight aria-hidden="true" /></button>
                            <p className={styles.note}>You’ll review the details before saving a demo request in this browser.</p>
                        </aside>
                    </form>
                )}

                {savedBookings.length > 0 && (
                    <section className={styles.savedBookings} aria-labelledby="saved-bookings-title">
                        <div className={styles.savedBookingsHeader}>
                            <div>
                                <p className={styles.paragraphSmall}>Stored on this device</p>
                                <h3 id="saved-bookings-title">Your demo requests</h3>
                            </div>
                            <span>{savedBookings.length}</span>
                        </div>
                        {historyMessage && <p className={styles.historyMessage} role="status">{historyMessage}</p>}
                        <ul>
                            {savedBookings.map((booking) => (
                                <li className={styles.savedBooking} key={booking.id}>
                                    <div>
                                        <strong>{booking.service || "Appointment"}</strong>
                                        <span>{booking.date ? formatDate(booking.date) : "Date unavailable"}{booking.time ? ` · ${booking.time}` : ""}</span>
                                        <small>{booking.name ? `For ${booking.name}` : "Demo request"}</small>
                                    </div>
                                    <button type="button" onClick={() => removeSavedBooking(booking.id)} aria-label={`Remove ${booking.service || "appointment"} demo request`}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <p className={styles.savedBookingsNote}>This list is private to this browser. Removing a demo request does not contact a business.</p>
                    </section>
                )}
            </div>
        </section>
    );
}

export default Booking;
