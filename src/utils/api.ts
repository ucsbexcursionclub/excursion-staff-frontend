import {MemberProps} from "./types";
import axios from "axios";

export async function getMembers(): Promise<MemberProps[]> {
    const response = await axios.get("http://localhost:9000/api/v1/members");
    const membersData: MemberProps[] = await response.data.members;

    return membersData;
}
