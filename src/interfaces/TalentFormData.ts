import { ImageWithDescription } from "./ImageWithDescription";

export interface TalentFormData {
    username: string;
    email: string;
    phoneNo: string;
    profileImageURL: string;
    skills: string;
    experience: string;
    portfolio: string;
    imageDesc: ImageWithDescription[],
}