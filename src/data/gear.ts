import { generateResourceUrl } from "../utils/utils";

type sampleGearProps = {
    imageUrl: string;
    title: string;
};

export const sampleGearItems: sampleGearProps[] = [
    {
        imageUrl: generateResourceUrl('/resources/SleepingBag.jpg'),
        title: "Sleeping Bags"
    },
    {
        imageUrl: generateResourceUrl('/resources/SleepingPad.jpg'),
        title: "Sleeping Pads"
    },
    {
        imageUrl: generateResourceUrl('/resources/Tent.jpg'),
        title: "Tents"
    },
    {
        imageUrl: generateResourceUrl('/resources/Backpack.jpg'),
        title: "Backpacks"
    },
    {
        imageUrl: generateResourceUrl('/resources/ColemanStove.jpg'),
        title: "Camping Stoves"
    },
    {
        imageUrl: generateResourceUrl('/resources/BackpackingStove.jpg'),
        title: "Backpacking Stoves"
    },
    {
        imageUrl: generateResourceUrl('/resources/Waterfilter.jpg'),
        title: "Water Filters"
    },
    {
        imageUrl: generateResourceUrl('/resources/Surfboards.jpg'),
        title: "Surfboards"
    },
    {
        imageUrl: generateResourceUrl('/resources/Kayak.jpg'),
        title: "Ocean Kayaks"
    },
    {
        imageUrl: generateResourceUrl('/resources/Wetsuits.jpg'),
        title: "Wetsuits"
    },
    {
        imageUrl: generateResourceUrl('/resources/YogaMat.jpg'),
        title: "Yoga Mats"
    },
    {
        imageUrl: generateResourceUrl('/resources/Hammock.jpg'),
        title: "Hammocks"
    }
];
