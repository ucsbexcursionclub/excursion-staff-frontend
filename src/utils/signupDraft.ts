import {EmergencyContact} from "./types";

// Holds an in-flight signup so it survives a forced re-login (tab-scoped, cleared on success)
const SIGNUP_DRAFT_KEY = "memberSignupDraft";

export type SignupDraft = {
    membershipStatus: string;
    membershipDuration: 90 | 180 | 365;
    stokedLevel: string;
    email: string;
    reEnterEmail: string;
    phoneNumber: string;
    fullName: string;
    hasWaiver: boolean;
    hasPaid: boolean;
    localLivingAddress: string;
    useCustomExpiration: boolean;
    customExpirationDate: string;
    neverExpires: boolean;
    excludeFromStats: boolean;
    emergencyContact: EmergencyContact;
};

export const saveSignupDraft = (draft: SignupDraft) => {
    try {
        sessionStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify(draft));
    } catch {
        // Storage unavailable (private mode / quota); the form still keeps its state in memory
    }
};

export const loadSignupDraft = (): SignupDraft | null => {
    try {
        const raw = sessionStorage.getItem(SIGNUP_DRAFT_KEY);
        return raw ? (JSON.parse(raw) as SignupDraft) : null;
    } catch {
        return null;
    }
};

export const hasSignupDraft = () => loadSignupDraft() !== null;

export const clearSignupDraft = () => {
    try {
        sessionStorage.removeItem(SIGNUP_DRAFT_KEY);
    } catch {
        // ignore
    }
};
