import React, {useState, ChangeEvent, FormEvent} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Button, Typography} from "@mui/material";
import {sendFeedback} from "../utils/api";
import {useSnackbar} from "../providers/SnackBarProvider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {InstagramEmbed} from "react-social-media-embed";
import {generateResourceUrl} from "../utils/utils";
import {sampleGearItems} from "../data/gear";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {faqItems} from "../data/faq";

type FaqItem = {
    question: string;
    answer: string;
};

type FAQSectionProps = {
    faqItems: FaqItem[];
};

const merchImageUrls = [
    generateResourceUrl("/resources/shortsleevefront.jpg"),
    generateResourceUrl("/resources/shortsleeveback.jpg"),
    generateResourceUrl("/resources/hat.jpg"),
    generateResourceUrl("/resources/longsleevefront.jpg"),
    generateResourceUrl("/resources/longsleeveback.jpg"),
    generateResourceUrl("/resources/headlamp.jpg")
];

const cardStyles = (isGreen = false) =>
    `flex flex-col items-center justify-end min-w-[275px] w-full ${
        isGreen ? "bg-[#3C4239] text-white" : ""
    }`;

const FAQSection: React.FC<FAQSectionProps> = ({faqItems}) => (
    <div className="space-y-2">
        {faqItems.map((item: FaqItem, index: number) => (
            <Accordion key={index}>
                <AccordionSummary
                    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: "0.9rem"}} />}
                    aria-controls={`panel${index + 1}d-content`}
                    id={`panel${index + 1}d-header`}
                    className="bg-gray-100 rounded-lg"
                >
                    <Typography className="m-1 text-sm sm:text-base md:text-lg">
                        {item.question}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Typography className="m-1 text-sm sm:text-base md:text-lg dark:text-gray-700 text-gray-800">
                        {item.answer}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        ))}
    </div>
);

export default function HomePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        feedback: ""
    });
    const [loading, setLoading] = useState(false);

    const {addNotification} = useSnackbar();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendFeedback(formData);
            setFormData({name: "", email: "", phone: "", subject: "", feedback: ""});
        } catch (error: any) {
            addNotification({type: "error", message: error.message});
            console.error("Error submitting feedback:", error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-start min-h-screen bg-[#3C4239]">
            <div className="relative">
                <img
                    src={`${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/rockJump.png`}
                    alt="Homepage"
                    className="w-full"
                />
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center py-2">
                    <div className="font-bold text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
                        {"We Do it Outdoors"}
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-start justify-end min-w-[275px] border bg-white p-4 sm:px-4 md:px-8 lg:px-12">
                <div className="flex-1 pr-2 text-right">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">stoked</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-500 italic">
                        /stōkt/ <br />
                        adjective
                    </p>
                </div>
                <div className="w-[2px] bg-black mx-4 h-full"></div>
                <div className="flex-2 pr-10">
                    <p className="text-sm sm:text-base md:text-lg">
                        To be stoked is to be completely and intensely enthusiastic, exhilarated, or
                        excited about something. Those who are stoked all of the time know this;
                        being stoked is the epitome of all being. When one is stoked, there is no
                        limit to what one can do.
                    </p>
                </div>
            </div>

            {/* 'What is Excursion Club?' text section */}
            <Card className={cardStyles()} square>
                <CardContent className="flex flex-col text-left sm:px-4 md:px-6 lg:px-8 ">
                    <Typography
                        variant="body2"
                        className="text-lg sm:text-xl md:text-2xl font-bold"
                    >
                        What is The Excursion Club?
                    </Typography>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        The Excursion Club at UCSB is an entirely student-run, volunteer
                        organization that is committed to getting people stoked on the outdoors. The
                        club connects individuals by providing gear and opportunities to partake in
                        outdoor activities as inexpensively as possible. We connect those who
                        already enjoy the outdoors, as well as provide those with little to no
                        outdoor experience with the knowledge, resources, opportunities, and support
                        to step outside of their comfort zone and experience the great outdoors.
                    </div>

                    {/* YouTube iframe width/height adjusted with Tailwind responsive classes */}
                    <iframe
                        className="w-full sm:w-3/4 lg:w-1/2 h-auto aspect-video mx-auto"
                        src="https://www.youtube.com/embed/n6187fG49r4?si=dJhEOAUQlXf89lux"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </CardContent>
            </Card>

            {/* 'What Do We Offer?' text section */}
            <Card className={cardStyles(true)} square>
                <CardContent className="flex flex-col text-left sm:px-4 md:px-6 lg:px-8">
                    <Typography
                        variant="body2"
                        className="text-lg sm:text-xl md:text-2xl font-bold text-white"
                    >
                        What do we offer?
                    </Typography>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        We lead a multitude of trips every week including but not limited to:
                        <br />
                        Skydiving, Rock Climbing, Tree Climbing, Surfing, Skiing/Snowboarding,
                        Camping, Backpacking, Kayaking, Stand Up Paddleboarding, Yoga, Free
                        Diving/Spear Fishing, Canyoneering, Hiking, Paintballing, Rafting, Dirt
                        Biking, Mountain Biking, Downhill Cycling, Road Cycling, Archery, Bungee
                        Jumping
                    </div>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        In the 2022-2023 academic year, we led an average of{" "}
                        <span className="font-bold">27 trips per week!</span>
                    </div>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        In addition to weekly trips, we have gear and equipment rentals available to
                        our members for free. All gear and equipment has limited availability, and
                        members are allowed to check them out for a limited time on a first-come,
                        first-serve basis. Below is all the gear we offer for rental:
                    </div>
                </CardContent>
            </Card>

            {/* Gear Grid Section */}
            {sampleGearItems.length > 0 && (
                <div className="w-full bg-lime-200 p-4 rounded-xl">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {sampleGearItems.slice(0, 12).map((item, index) => (
                            <div key={index} className="flex flex-col items-center p-1 text-white">
                                {/* Image Container */}
                                <div className="relative w-full aspect-square rounded-md overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="object-cover w-full h-full"
                                    />

                                    {/* Overlay Text */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <span className="text-white text-center text-lg md:text-xl font-bold">
                                            {item.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Card className={cardStyles()} square>
                <CardContent className="flex flex-col text-left sm:px-4 md:px-6 lg:px-8">
                    {/* Joining Info */}
                    <Typography
                        variant="body2"
                        className="text-lg sm:text-xl md:text-2xl font-bold text-black"
                    >
                        How can I join the stoke?
                    </Typography>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        During the academic year, come to one of our general meetings, which are
                        held most Tuesdays at 7:00 pm in 1924 Psychology Building (check our
                        instagram @excursionclubucsb day of), or come out to office hours, and bring
                        cash to sign up or renew your membership.
                        <br />
                        <br />
                        *We do not hold meetings or office hours during breaks, school holidays, and
                        finals week. If you are unable to sign-up during our general meeting or
                        office hours, contact us directly by emailing info@excursionclubucsb.org or
                        DM our instagram @excursionclubucsb and we will find a time to sign you up.
                    </div>

                    {/* Pricing Columns Section */}
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto px-4">
                        {/* Left Column: Pricing for New Members */}
                        <div className="bg-gray-100 p-5 rounded-lg flex-1 min-w-[250px]">
                            <h3 className="text-lg md:text-xl font-bold text-black">
                                Pricing for New Members
                            </h3>
                            <ul className="list-none p-0 mt-4 text-sm sm:text-base md:text-lg">
                                <li className="mb-3">For 365 Days (best deal): $60</li>
                                <li className="mb-3">For 180 Days: $50</li>
                                <li className="mb-3">For 90 Days: $30</li>
                            </ul>
                        </div>

                        {/* Right Column: Pricing for Continuing Members */}
                        <div className="bg-gray-200 p-5 rounded-lg flex-1 min-w-[250px]">
                            <h3 className="text-lg md:text-xl font-bold text-black">
                                Pricing for Continuing Members
                            </h3>
                            <ul className="list-none p-0 mt-4 text-sm md:text-base lg:text-lg">
                                <li className="mb-3">For 365 Days: $40</li>
                                <li className="mb-3">For 180 Days: $30</li>
                                <li className="mb-3">For 90 Days: $20</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 w-full flex justify-center">
                        <div className="min-w-[80px] w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                            <InstagramEmbed
                                url="https://www.instagram.com/excursionclubucsb/"
                                width="100%"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Responsive Image Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {merchImageUrls.map((imageUrl, index) => (
                    <div key={index} className="w-full">
                        <img
                            src={imageUrl}
                            alt={`Image ${index}`}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                ))}
            </div>

            <Card className={cardStyles(true)} square>
                <CardContent className="flex flex-col text-left sm:px-4 md:px-6 lg:px-8">
                    <Typography
                        variant="body2"
                        className="text-lg sm:text-xl md:text-2xl font-bold text-white"
                    >
                        Get Rad, Buy Rad
                    </Typography>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        Admiring our staffers in their merch? Come by the Oasis during office hours
                        to buy some and rep it with them!
                    </div>
                    <ul className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        <li>Long sleeves - sold out</li>
                        <li>XL Short sleeves - $15</li>
                        <li>Hats - $15</li>
                        <li>Headlamps - sold out</li>
                    </ul>
                    <div className="mx-4 my-2 text-sm sm:text-base md:text-lg">
                        If your question is not answered on this page, send it to us by emailing us
                        directly at info@excursionclubucsb.org or DM our instagram
                        @excursionclubucsb.
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Accordion */}
            <Card className={cardStyles()} square>
                <CardContent className="flex flex-col text-left sm:px-4 md:px-6 lg:px-8">
                    <Typography
                        variant="body2"
                        className="my-2 text-lg sm:text-xl md:text-2xl font-bold"
                    >
                        FAQ
                    </Typography>
                    <FAQSection faqItems={faqItems} />
                </CardContent>
            </Card>

            {/* Feedback Form */}
            <Card className={cardStyles()} square>
                <CardContent>
                    <div className="p-4">
                        <form onSubmit={handleSubmit}>
                            <Box className="flex flex-col space-y-4 max-w-lg mx-auto">
                                <Typography
                                    variant="body2"
                                    className="text-lg sm:text-xl md:text-2xl font-bold text-black"
                                >
                                    Contact Us
                                </Typography>
                                <TextField
                                    id="name"
                                    label="Name"
                                    name="name"
                                    variant="outlined"
                                    className="pb-2"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    id="email"
                                    label="Email"
                                    name="email"
                                    variant="outlined"
                                    className="pb-2"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    id="phone"
                                    label="Phone"
                                    name="phone"
                                    variant="outlined"
                                    className="pb-2"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    id="subject"
                                    label="Subject"
                                    name="subject"
                                    variant="outlined"
                                    className="pb-2"
                                    required
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    id="feedback"
                                    label="Feedback or Message"
                                    name="feedback"
                                    variant="outlined"
                                    className="pb-2"
                                    multiline
                                    required
                                    rows={4}
                                    value={formData.feedback}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{width: "min-content", whiteSpace: "nowrap"}}
                                    disabled={loading} // Disable the button while loading
                                    className="self-start"
                                >
                                    {loading ? "Submitting..." : "Submit Feedback"}{" "}
                                    {/* Show loading state */}
                                </Button>
                            </Box>
                        </form>
                        <p className="text-sm text-gray-600 mt-4">
                            * Send an anonymous message without filling out Name, Email, or Phone.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
