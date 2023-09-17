import {GearProps, MemberProps} from "./types";
import axios from "axios";

export async function getMembers(): Promise<MemberProps[]> {
    const response = await axios.get("http://localhost:9000/api/v1/members");
    const membersData: MemberProps[] = await response.data.members;

    return membersData;
}

export async function getGear(): Promise<GearProps[]> {
    const response = await axios.get("http://localhost:9000/api/v1/gear");
    const gearDta: GearProps[] = await response.data.gear;

    return gearDta;
}
