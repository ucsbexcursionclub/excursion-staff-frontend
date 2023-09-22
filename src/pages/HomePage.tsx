import React, {useEffect, useState} from "react";
import StokedDefinitionCard from "src/components/homepage/StokedDefinitionCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import GearGrid from "src/components/homepage/GearGrid";
import FAQAccordion from "src/components/homepage/FAQAccordion";
import FeedbackForm from "src/components/homepage/FeedbackForm";
import ImageContainer from "components/homepage/ImageContainer";
import PricingColumns from "components/homepage/PricingColumns";
import ResponsiveImageRow from "components/homepage/ResponsiveImageRow";

const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row", // Display in a row layout
    alignItems: "flex-start", // Align items at the top
    justifyContent: "flex-end", // Align the left column to the right
    minWidth: 275,
    width: "100%"
};

const greenCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row", // Display in a row layout
    alignItems: "flex-start", // Align items at the top
    justifyContent: "flex-end", // Align the left column to the right
    minWidth: 275,
    backgroundColor: "rgba(60,66,57,255)",
    color: "white"
};

const pageContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the top
    minHeight: "100vh",
    paddingBottom: "0",
    margin: 0,
    backgroundColor: "rgba(60,66,57,255)"
};

const merchImageUrls = [
    "http://d36olvmp8krees.cloudfront.net/resources/shortsleevefront.jpg",
    "http://d36olvmp8krees.cloudfront.net/resources/shortsleeveback.jpg",
    "http://d36olvmp8krees.cloudfront.net/resources/hat.png",
    "http://d36olvmp8krees.cloudfront.net/resources/longsleevefront.jpg",
    "http://d36olvmp8krees.cloudfront.net/resources/longsleeveback.jpg",
    "http://d36olvmp8krees.cloudfront.net/resources/headlamp.jpg"
];

export default function HomePage() {
    const [bigFontSize, setBigFontSize] = useState("24px"); // Initial font size
    const [medFontSize, setMedFontSize] = useState("18"); // Initial font size
    const [columns, setColumns] = useState(4); // Initial number of columns
    const screenWidth = window.innerWidth;

    useEffect(() => {
        // Calculate font size based on screen width
        const bigCalculatedFontSize = `${(screenWidth / 15).toFixed(0)}px`;
        setBigFontSize(bigCalculatedFontSize);

        let cols = 0;
        if (screenWidth <= 420) {
            setColumns(2);
            cols = 2;
        } else if (screenWidth <= 700) {
            setColumns(3);
            cols = 3;
        } else {
            setColumns(4); // Default to 4 columns
            cols = 4;
        }
        const medCalculatedFontSize = `${(screenWidth / (cols * 12)).toFixed(0)}`;
        setMedFontSize(medCalculatedFontSize);
    }, [screenWidth]);

    const paragraphStyle = {
        margin: "16px",
        fontSize: `${parseInt(medFontSize) - 4}px`
    };

    const asteriskNoteStyle = {
        margin: "18px",
        fontSize: `${parseInt(medFontSize) - 6}px`
    };

    const liStyle = {
        marginBottom: "10px",
        fontSize: `${parseInt(medFontSize) - 4}px`
    };

    return (
        <div style={pageContainerStyle}>
            <ImageContainer // https://d36olvmp8krees.cloudfront.net/resources/homePageTop1.png
                imgurl="https://d36olvmp8krees.cloudfront.net/resources/rockJump.png"
                bigFontSize={bigFontSize}
            />
            <StokedDefinitionCard />
            <Card sx={cardStyle} square>
                <CardContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        paddingRight: "15px",
                        paddingLeft: "15px"
                    }}
                >
                    <Typography variant="body2">
                        <Typography
                            variant="body2"
                            style={{
                                fontSize: `${parseInt(medFontSize) + 1}px`,
                                fontWeight: "bold",
                                color: "black",
                                paddingRight: "15px",
                                paddingLeft: "15px"
                            }}
                        >
                            What is The Excursion Club?
                        </Typography>
                        <p style={paragraphStyle}>
                            The Excursion Club at UCSB is an entirely student-run, volunteer
                            organization that is committed to getting people stoked on the outdoors.
                            The club connects individuals by providing gear and opportunities to
                            partake in outdoor activities as inexpensively as possible. We connect
                            those who already enjoy the outdoors, as well as provide those with
                            little to no outdoor experience with the knowledge, resources,
                            opportunities, and support to step outside of their comfort zone and
                            experience the great outdoors they’ve been missing out on.
                        </p>
                    </Typography>
                    <iframe
                        width={`${screenWidth * 0.9}px`}
                        height={`${0.5625 * (screenWidth * 0.9)}px`}
                        src="https://www.youtube.com/embed/n6187fG49r4?si=dJhEOAUQlXf89lux"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{margin: "0 auto"}}
                    ></iframe>
                </CardContent>
            </Card>
            <Card sx={greenCardStyle} square>
                <CardContent>
                    <Typography variant="body2">
                        <Typography
                            variant="body2"
                            style={{
                                fontSize: `${parseInt(medFontSize) + 1}px`,
                                fontWeight: "bold",
                                color: "white"
                            }}
                        >
                            What do we offer?
                        </Typography>
                        <p style={paragraphStyle}>
                            We lead a multitude of trips every week including but not limited to:
                            <br />
                            Skydiving, Rock Climbing, Tree Climbing, Surfing, Skiing/Snowboarding,
                            Camping, Backpacking, Kayaking, Stand Up Paddleboarding, Intramural
                            Sports, Yoga, Free Diving/Spear Fishing, Canyoneering, Hiking,
                            Paintballing, Rafting, Dirt Biking, Mountain Biking, Downhill Cycling,
                            Road Cycling, Archery, Bungee Jumping
                            <br />
                            <br />
                            In the 2022-2023 academic year, we led an average of{" "}
                            <span style={{fontSize: "18px", fontWeight: "bold"}}>
                                27 trips per week!
                            </span>
                        </p>
                        <p style={paragraphStyle}>
                            In addition to weekly trips, we have gear and equipment rentals
                            available to our members for free. All gear and equipment has limited
                            availability, and members are allowed to check them out for a limited
                            time on a first-come, first-serve basis.
                        </p>
                    </Typography>
                </CardContent>
            </Card>
            <GearGrid columns={columns} labelFontSize={parseInt(medFontSize)} />
            <Card sx={cardStyle} square>
                <CardContent>
                    <Typography variant="body2">
                        <Typography
                            variant="body2"
                            style={{
                                fontSize: `${parseInt(medFontSize) + 1}px`,
                                fontWeight: "bold",
                                color: "black"
                            }}
                        >
                            How to get stoked (How can I join?)
                        </Typography>
                        <p style={paragraphStyle}>
                            During the academic year, come to one of our general meetings, every
                            Tuesday at 7:00 pm in Broida Hall, room 1610 on the UCSB campus, or come
                            out to office hours every Wednesday and Thursday from 4-6 pm at 1026
                            Camino Lindo, and bring cash or check (made out to The Excursion Club
                            using black or blue ink) to the meeting for the membership payment.
                            During the summer quarter our hours are every Monday from 7-8pm at 1026
                            Camino Lindo.
                        </p>
                        <p style={asteriskNoteStyle}>
                            *We do not hold meetings or office hours during breaks, school holidays,
                            and finals week. If you are unable to sign-up during our general meeting
                            or office hours, contact us directly through the form at the bottom of
                            this site or DM us on instagram (@excursionclubucsb) and we will find a
                            time to sign you up!
                        </p>
                    </Typography>
                    <PricingColumns medFontSize={medFontSize} />
                </CardContent>
            </Card>
            <ResponsiveImageRow imageUrls={merchImageUrls} screenWidth={screenWidth} />
            <Card sx={greenCardStyle} square>
                <CardContent>
                    <Typography variant="body2">
                        <Typography
                            variant="body2"
                            style={{
                                fontSize: `${parseInt(medFontSize) + 1}px`,
                                fontWeight: "bold",
                                color: "white"
                            }}
                        >
                            Get Rad, Buy Rad
                        </Typography>
                        <p style={paragraphStyle}>
                            Admiring our staffers in their merch? Come by the Oasis during office
                            hours to buy some and rep it with them!
                        </p>
                        <ul style={liStyle}>
                            <li>Long sleeves - $15</li>
                            <li>Short sleeves - $15</li>
                            <li>Hats - $15</li>
                            <li>Headlamps - $5</li>
                        </ul>
                    </Typography>
                    <p style={paragraphStyle}>
                        If your question is not answered on this page, send it to us using the form
                        above or by emailing us directly at info@excursionclubucsb.org
                    </p>
                </CardContent>
            </Card>
            <Card sx={cardStyle} square>
                <CardContent>
                    <Typography
                        variant="body2"
                        style={{
                            fontSize: `${parseInt(medFontSize) + 1}px`,
                            fontWeight: "bold",
                            color: "black"
                        }}
                    >
                        FAQ
                    </Typography>
                    <FAQAccordion fontSize={`${parseInt(medFontSize) - 4}px`} />
                </CardContent>
            </Card>
            <Card sx={cardStyle} square>
                <CardContent>
                    <Typography
                        variant="body2"
                        style={{
                            fontSize: `${parseInt(medFontSize) + 1}px`,
                            fontWeight: "bold",
                            color: "black"
                        }}
                    >
                        Contact Us
                    </Typography>
                    <FeedbackForm fontSize={`${parseInt(medFontSize) - 6}px`} />{" "}
                    {/* Use the FeedbackForm component here */}
                </CardContent>
            </Card>
        </div>
    );
}
