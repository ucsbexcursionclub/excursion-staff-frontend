type linkType = {
    title: string;
    description: string;
    imageUrl: string;
    href: string;
};

export type LinkGroupType = {
    id: string;
    title: string;
    links: linkType[];
};