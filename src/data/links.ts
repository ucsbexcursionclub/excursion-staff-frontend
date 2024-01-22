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
            description: "Click to go to the waiver",
            href: "https://waiver.smartwaiver.com/w/h5vuzbksltzbwsuetzfowy/web/",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/qr-code-waiver.png`
        },
        {
            title: "Meeting Minutes",
            description:
                "Whose working office hours, general meeting, and our weekly meeting notes",
            href: "https://docs.google.com/document/d/1WiDV_YgvW2ypGcJp0yxej-DeDH2ybcTfeYz9fKx60-k/edit?usp=sharing",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Excursion Club Spiel",
            description: "What to say at office hours & general meeting to prospective members",
            href: "https://docs.google.com/spreadsheets/d/1mEN-sp-X4ZLK0ayVb0ITfRY5kDti5P4gwu_GtZOxbQo/edit#gid=0",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleSheetsLogo.png`
        },
        {
            title: "Income Form",
            description: "Fill this out after every office hours and general meeting",
            href: "https://forms.gle/uwuQguGCZFpgEjPD8",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
        },
        {
            title: "Not Getting Emails?",
            description: "Share this form with any members not getting emails",
            href: "https://forms.gle/9T2TRQmKR69b261F9",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
        },
        {
            title: "Backup Sign Up Form",
            description: "Only use this form if the website is down",
            href: "https://forms.gle/mSQGzdkhmyAbA1Lh9",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
        },
        {
            title: "Backup Gear Form",
            description: "Only use this form to check in/out gear if the website is down",
            href: "https://forms.gle/7HkgKkbbjyWQKD5f8",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
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
            href: "https://forms.gle/RtFphf53oWifMu857",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
        },
        {
            title: "Directors Document",
            description: "Projects and info to pass down and coordinate",
            href: "https://docs.google.com/document/d/1NtPUA8MtqWYlnT4VgaY2I_JJSaRZWo3q00hgKsjSlQ8/edit?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Board Document",
            description: "Meeting notes and completed, in progress, and future tasks",
            href: "https://docs.google.com/document/d/1rjNvHad7OJy3ElJEgFDwl-tZowmFSl_tlm1d7wYZawA/edit?usp=sharing",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Camping Gear Heads",
            description: "Contact info, gear to-do list, and gear shed projects",
            href: "https://docs.google.com/document/d/1gomrxGpgpbNMWgLz7pOrizsbLRSdox8-XdLHkqJ7QRY/edit?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Climbing Gear Heads",
            description: "Contact info, climbing gear to-do list, and climbing shed projects",
            href: "https://docs.google.com/document/d/15LPSlhHx8FeH2oNTyvBblUzY2aBI-ULaPwZNKB9olas/edit?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Water Sports Gear Heads",
            description: "Contact info, water sports to-do list, & water sports projects",
            href: "https://docs.google.com/document/d/1S3cmX6LGvFyaHEszCvRq32sDJ4BYhf7z-c4l3J9zXcw/edit?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Gear Fairy",
            description: "Contact info, notes on missing gear, etc",
            href: "https://docs.google.com/document/d/1rJlXKTX3v-sshqxpBqhxzs1jsuIZXCbQ357VFBgQNjc/edit?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Boo Boo Boss Documents",
            description:
                "Any presentations on wilderness first aid and info on the med-kits and such",
            href: "https://drive.google.com/drive/folders/1EDZLKLLovAi5vCaJtw9OvOaGr-qLjAyO?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDriveLogo.png`
        },
        {
            title: "Website Documentation",
            description: "For maintaining this website, and who to contact for tech support",
            href: "https://docs.google.com/document/d/1dSOZdLs7zT5GUO4qkUKOnA7eWYCJVA829FMlDqX4eHE/edit?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "IKON Code Information",
            description: "Reference this document for any and all info on ikon codes",
            href: "https://docs.google.com/document/d/1zrrATsGKKW72btSfLL76W-564nwT5_nXdPM8gkUVJSk/edit?usp=sharing",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
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
            href: "https://docs.google.com/document/d/1ybLmOmhLVm0EaTM7vRrzoZDpWgSz8QtAJA2goLE5h_c/edit?usp=sharing",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Calendar",
            description: "Google calendar with overnight trips",
            href: "https://docs.google.com/document/d/1VlBlU3KzjnMlBuJ1UmcLcJAqf9KbmRjjiluMguhzcwI/edit?usp=sharing",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleCalendarLogo.png`
        },
        {
            title: "All Trails Log in",
            description: "username: info@excursionclubucsb.org password: stokestokestoke",
            href: "https://www.alltrails.com/",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/AllTrailsLogo.png`
        },
        {
            title: "Surfline Log in",
            description: "username: info@excursionclubucsb.org password: stokestokestoke",
            href: "https://www.surfline.com/",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/surfline-logo.png`
        },
        {
            title: "SUP Guide",
            description: "Read this before leading a paddle-boarding trip!",
            href: "https://docs.google.com/document/d/148jZXZw8nj7hWsJhOuxY67xYRGaXG0-8Wr5FP4gzmYs/edit",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Kayak Guide",
            description: "Read this before leading a kayaking trip!",
            href: "https://docs.google.com/document/d/1gU-cJViqEjtK-yHei3sjnf0TgEvzLBpsLhUG2r8VqvU/edit",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDocsLogo.png`
        },
        {
            title: "Pre-Trip Form",
            description: "Fill this out before you leave for an overnight trip",
            href: "https://forms.gle/KxjjNNRoxjo1A2oE7",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
        },
        {
            title: "Post-Trip Form",
            description: "Fill this out after you come back from an overnight trip",
            href: "https://forms.gle/MELcygEk4nwp6A9w8",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleFormsLogo.png`
        },
        {
            title: "Excursion Trip Map",
            description: "A Google map filled with super cool spots to run excursions to",
            href: "https://www.google.com/maps/d/u/0/viewer?mid=169qQnqsu-WLbdBhE5Y2DLgWQDjs&ll=52.255649885982486%2C-103.38926910597152&z=2&fbclid=IwAR1QHQXD6cXu0tn4NwYv-39fZx1N03wqHHPJT6RS6dgNHHKz3iyTPOAHrsY",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleMapsLogo.png`
        },
        {
            title: "Past Trip Planning Docs",
            description:
                "Share how you led your kick-ass trip to make it easier on the next staffer",
            href: "https://drive.google.com/drive/folders/1XfKEWYiUuI1dmiDOzJvqsfqq6nVMsAln?usp=drive_link",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GoogleDriveLogo.png`
        },
        {
            title: "Facebook Group",
            description: "Join the staff facebook group!",
            href: "https://www.facebook.com/groups/215970145093754",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/FacebookLogo.png`
        },
        {
            title: "Excursion Album",
            description: "Photos for the wall and content for social media",
            href: "https://photos.app.goo.gl/vTtdPdWkQUYdknwY6",
            imageUrl: `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/icons/GooglePhotosLogo.png`
        }
    ]
};
