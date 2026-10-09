const siteContent = [
    {
        href: "#services",
        label: "Services",
        component: "services",
        items: [
            {
                href: "#intro-call",
                label: "Intro call",
                duration: "20 min",
                price: 0,
                description: "A relaxed first conversation to find the right next step.",
                category: "A good place to start",
            },
            {
                href: "#one-to-one",
                label: "1:1 consultation",
                duration: "45 min",
                price: 1499,
                description: "Focused time with a specialist, shaped around your needs.",
                category: "Most booked",
            },
            {
                href: "#planning-session",
                label: "Planning session",
                duration: "60 min",
                price: 2499,
                description: "A deeper working session with a clear plan to take away.",
                category: "Make a plan",
            },
            {
                href: "#follow-up",
                label: "Follow-up",
                duration: "30 min",
                price: 999,
                description: "Pick up where you left off and keep your momentum going.",
                category: "Continue the conversation",
            },
        ],
    },
    {
        href: "#approach",
        label: "How it works",
        component: "approach",
        items: [
            {
                href: "#choose-service",
                label: "Choose a service",
                title: "Start where you are",
                description: "Pick the kind of session that would help most. You can always change your mind later.",
            },
            {
                href: "#pick-a-time",
                label: "Pick a time",
                title: "Find a time that fits",
                description: "See the open times for the week and choose the one that works for you.",
            },
            {
                href: "#meet-your-specialist",
                label: "Meet your specialist",
                title: "Make it yours",
                description: "Tell us a little about yourself and choose who you would like to meet.",
            },
        ],
    },
    {
        href: "#faq",
        label: "FAQs",
        component: "faq",
        items: [
            {
                href: "#faq-change",
                label: "Can I change my appointment?",
                answer: "Yes. Use the confirmation details to get in touch at least 24 hours before your appointment and we’ll help find another time.",
            },
            {
                href: "#faq-video",
                label: "Are online sessions available?",
                answer: "Absolutely. Choose video or in-person when you book. We’ll send the session details with your confirmation.",
            },
            {
                href: "#faq-first",
                label: "What should I book first?",
                answer: "The intro call is a friendly, no-pressure way to meet and decide what would be most useful for you.",
            },
        ],
    },
    {
        href: "#book",
        label: "Book",
        component: "booking",
        items: [],
    },
];

export default siteContent;
