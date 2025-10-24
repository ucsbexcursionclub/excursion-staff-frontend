export const positionOptions = [
    "Director",
    "Treasurer",
    "General Board",
    "Web Developer",
    "Camping Gear Head",
    "Climbing Gear Head",
    "Head of Water Sports",
    "Head of Medicine",
    "Social Media Head",
    "Gear Fairy",
    "Full Staff",
    "Prospective Staff",
    "Wizard of Computer",
    "Emeritus",
    "西海岸仁波齐",
    "Animal Whisperer",
    "Chef of Succulent Chinese Meals",
    "Corelord",
    "Jill of All Trades"
];

export enum GearFilterOptions {
    SHOW_OVERDUE = "SHOW_OVERDUE",
    HIDE_OVERDUE = "HIDE_OVERDUE",
    SHOW_AVAILABLE = "SHOW_AVAILABLE",
    SHOW_ALL = "SHOW_ALL"
}

export enum MemberFilterOptions {
    SHOW_EXPIRED = "SHOW_EXPIRED",
    SHOW_ACTIVE = "SHOW_ACTIVE",
    SHOW_HAS_OVERDUE_GEAR = "SHOW_HAS_OVERDUE_GEAR",
    SHOW_FLAGGED = "SHOW_FLAGGED",
    SHOW_ALL = "SHOW_ALL"
}

export const MILLISECONDS_IN_DAY = 86400000;

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes
