type linkType = {
    title: string;
    description: string;
    imageUrl: string;
    href: string;
};

export type linkGroupType = {
    id: string;
    title: string;
    links: linkType[];
};

export const prospectiveMembers: linkGroupType = {
    id: "prospectiveMembers",
    title: "Prospective Members",
    links: [
        {
            title: "Member Waiver",
            description: "Click to enlarge the QR code!",
            href: "",
            imageUrl: ""
        },
        {
            title: "Excursion Club Trial",
            description: "What to say at office hours & general meeting to prospective members",
            href: "",
            imageUrl: ""
        },
        {
            title: "Income Form",
            description: "Fill this out after every office hours and general meeting",
            href: "",
            imageUrl: ""
        },
        {
            title: "Not Getting Emails?",
            description: "Share this form with any members not getting emails",
            href: "",
            imageUrl: ""
        }
    ]
};

export const staffHeads: linkGroupType = {
    id: "staffHeads",
    title: "Staff Heads",
    links: [
        {
            title: "Expense Form",
            description: "Fill this out after every time you spend approved excursion club money",
            href: "",
            imageUrl: ""
        },
        {
            title: "Directors Document",
            description: "Projects and info to pass down and coordinate",
            href: "",
            imageUrl: ""
        },
        {
            title: "Board Document",
            description: "Meeting notes and completed, in progress, and future tasks",
            href: "",
            imageUrl: ""
        },
        {
            title: "Camping Gear Heads",
            description: "Contact info, gear to-do list, and gear shed projects",
            href: "",
            imageUrl: ""
        },
        {
            title: "Climbing Gear Heads",
            description: "Contact info, climbing gear to-do list, and climbing shed projects",
            href: "",
            imageUrl: ""
        },
        {
            title: "Water Sports Gear Heads",
            description: "Contact info, water sports to-do list, & water sports projects",
            href: "",
            imageUrl: ""
        },
        {
            title: "Gear Fairy",
            description: "Contact info, notes on missing gear, etc",
            href: "",
            imageUrl: ""
        },
        {
            title: "Boo Boo Boss Documents",
            description:
                "Any presentations on wilderness first aid and info on the med-kits and such",
            href: "",
            imageUrl: ""
        },
        {
            title: "Website Documentation",
            description: "For maintaining this website, and who to contact for tech support",
            href: "",
            imageUrl: ""
        },
        {
            title: "IKON Code Information",
            description: "Reference this document for any and all info on ikon codes",
            href: "",
            imageUrl: ""
        }
    ]
};

export const tripResources: linkGroupType = {
    id: "tripResources",
    title: "Trip Resources",
    links: [
        {
            title: "Weekly Trip Doc",
            description: "Put your trips in for the week here!",
            href: "",
            imageUrl: ""
        },
        {
            title: "Calendar",
            description: "Google calendar with overnight trips",
            href: "",
            imageUrl: ""
        },
        {
            title: "All Trails Log in",
            description: "username: info@excursionclubucsb.org password: stokestokestoke",
            href: "",
            imageUrl: ""
        },
        {
            title: "Surfline Log in",
            description: "username: info@excursionclubucsb.org password: stokestokestoke",
            href: "",
            imageUrl: ""
        },
        {
            title: "SUP Guide",
            description: "Read this before leading a paddle-boarding trip!",
            href: "",
            imageUrl: ""
        },
        {
            title: "Kayak Guide",
            description: "Read this before leading a kayaking trip!",
            href: "",
            imageUrl: ""
        },
        {
            title: "Pre-Trip Form",
            description: "Fill this out before you leave for an overnight trip",
            href: "",
            imageUrl: ""
        },
        {
            title: "Post-Trip Form",
            description: "Fill this out after you come back from an overnight trip",
            href: "",
            imageUrl: ""
        },
        {
            title: "Excursion Trip Map",
            description: "A Google map filled with super cool spots to run excursions to",
            href: "",
            imageUrl: ""
        },
        {
            title: "Past Trip Planning Docs",
            description:
                "Share how you led your kick-ass trip to make it easier on the next staffer",
            href: "",
            imageUrl: ""
        },
        {
            title: "Facebook Group",
            description: "Join the staff facebook group!",
            href: "",
            imageUrl: ""
        },
        {
            title: "Excursion Album",
            description: "Photos for the wall and content for social media",
            href: "",
            imageUrl: ""
        }
    ]
};
