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
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/qr-code-waiver.png"
        },
        {
            title: "Meeting Minutes",
            description:
                "Whose working office hours, general meeting, and our weekly meeting notes",
            href: "https://docs.google.com/document/d/1WiDV_YgvW2ypGcJp0yxej-DeDH2ybcTfeYz9fKx60-k/edit?usp=sharing",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Excursion Club Spiel",
            description: "What to say at office hours & general meeting to prospective members",
            href: "https://docs.google.com/spreadsheets/d/1mEN-sp-X4ZLK0ayVb0ITfRY5kDti5P4gwu_GtZOxbQo/edit#gid=0",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleSheetsLogo.PNG"
        },
        {
            title: "Income Form",
            description: "Fill this out after every office hours and general meeting",
            href: "https://forms.gle/uwuQguGCZFpgEjPD8",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
        },
        {
            title: "Not Getting Emails?",
            description: "Share this form with any members not getting emails",
            href: "https://forms.gle/9T2TRQmKR69b261F9",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
        },
        {
            title: "Backup Sign Up Form",
            description: "Only use this form if the website is down",
            href: "https://forms.gle/mSQGzdkhmyAbA1Lh9",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
        },
        {
            title: "Backup Gear Form",
            description: "Only use this form to check in/out gear if the website is down",
            href: "https://forms.gle/7HkgKkbbjyWQKD5f8",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
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
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
        },
        {
            title: "Directors Document",
            description: "Projects and info to pass down and coordinate",
            href: "https://docs.google.com/document/d/1NtPUA8MtqWYlnT4VgaY2I_JJSaRZWo3q00hgKsjSlQ8/edit?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Board Document",
            description: "Meeting notes and completed, in progress, and future tasks",
            href: "https://docs.google.com/document/d/1rjNvHad7OJy3ElJEgFDwl-tZowmFSl_tlm1d7wYZawA/edit?usp=sharing",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Camping Gear Heads",
            description: "Contact info, gear to-do list, and gear shed projects",
            href: "https://docs.google.com/document/d/1gomrxGpgpbNMWgLz7pOrizsbLRSdox8-XdLHkqJ7QRY/edit?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Climbing Gear Heads",
            description: "Contact info, climbing gear to-do list, and climbing shed projects",
            href: "https://docs.google.com/document/d/15LPSlhHx8FeH2oNTyvBblUzY2aBI-ULaPwZNKB9olas/edit?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Water Sports Gear Heads",
            description: "Contact info, water sports to-do list, & water sports projects",
            href: "https://docs.google.com/document/d/1S3cmX6LGvFyaHEszCvRq32sDJ4BYhf7z-c4l3J9zXcw/edit?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Gear Fairy",
            description: "Contact info, notes on missing gear, etc",
            href: "https://docs.google.com/document/d/1rJlXKTX3v-sshqxpBqhxzs1jsuIZXCbQ357VFBgQNjc/edit?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Boo Boo Boss Documents",
            description:
                "Any presentations on wilderness first aid and info on the med-kits and such",
            href: "https://drive.google.com/drive/folders/1EDZLKLLovAi5vCaJtw9OvOaGr-qLjAyO?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDriveLogo.PNG"
        },
        {
            title: "Website Documentation",
            description: "For maintaining this website, and who to contact for tech support",
            href: "https://docs.google.com/document/d/1dSOZdLs7zT5GUO4qkUKOnA7eWYCJVA829FMlDqX4eHE/edit?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "IKON Code Information",
            description: "Reference this document for any and all info on ikon codes",
            href: "https://docs.google.com/document/d/1zrrATsGKKW72btSfLL76W-564nwT5_nXdPM8gkUVJSk/edit?usp=sharing",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
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
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Calendar",
            description: "Google calendar with overnight trips",
            href: "https://calendar.google.com/calendar/embed?src=8mshv4d0hf4q9v6h0lmjlk9uq4%40group.calendar.google.com&ctz=America%2FLos_Angeles",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleCalendarLogo.PNG"
        },
        {
            title: "All Trails Log in",
            description: "username: info@excursionclubucsb.org password: stokestokestoke",
            href: "https://www.alltrails.com/",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/AllTrailsLogo.PNG"
        },
        {
            title: "Surfline Log in",
            description: "username: info@excursionclubucsb.org password: stokestokestoke",
            href: "https://www.surfline.com/",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/surfline-logo.png"
        },
        {
            title: "SUP Guide",
            description: "Read this before leading a paddle-boarding trip!",
            href: "https://docs.google.com/document/d/148jZXZw8nj7hWsJhOuxY67xYRGaXG0-8Wr5FP4gzmYs/edit",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Kayak Guide",
            description: "Read this before leading a kayaking trip!",
            href: "https://docs.google.com/document/d/1gU-cJViqEjtK-yHei3sjnf0TgEvzLBpsLhUG2r8VqvU/edit",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDocsLogo.PNG"
        },
        {
            title: "Pre-Trip Form",
            description: "Fill this out before you leave for an overnight trip",
            href: "https://forms.gle/KxjjNNRoxjo1A2oE7",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
        },
        {
            title: "Post-Trip Form",
            description: "Fill this out after you come back from an overnight trip",
            href: "https://forms.gle/MELcygEk4nwp6A9w8",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleFormsLogo.PNG"
        },
        {
            title: "Excursion Trip Map",
            description: "A Google map filled with super cool spots to run excursions to",
            href: "https://www.google.com/maps/d/u/0/viewer?mid=169qQnqsu-WLbdBhE5Y2DLgWQDjs&ll=52.255649885982486%2C-103.38926910597152&z=2&fbclid=IwAR1QHQXD6cXu0tn4NwYv-39fZx1N03wqHHPJT6RS6dgNHHKz3iyTPOAHrsY",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleMapsLogo.PNG"
        },
        {
            title: "Past Trip Planning Docs",
            description:
                "Share how you led your kick-ass trip to make it easier on the next staffer",
            href: "https://drive.google.com/drive/folders/1XfKEWYiUuI1dmiDOzJvqsfqq6nVMsAln?usp=drive_link",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GoogleDriveLogo.PNG"
        },
        {
            title: "Facebook Group",
            description: "Join the staff facebook group!",
            href: "https://www.facebook.com/groups/215970145093754",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/FacebookLogo.PNG"
        },
        {
            title: "Excursion Album",
            description: "Photos for the wall and content for social media",
            href: "https://photos.app.goo.gl/vTtdPdWkQUYdknwY6",
            imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/icons/GooglePhotosLogo.PNG"
        }
    ]
};
