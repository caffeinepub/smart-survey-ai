import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SurveyForm {
    id: bigint;
    title: string;
    creator: Principal;
    questions: Array<Question>;
}
export type QuestionType = {
    __kind__: "rating_1_5";
    rating_1_5: null;
} | {
    __kind__: "text";
    text: null;
} | {
    __kind__: "multipleChoice";
    multipleChoice: Array<string>;
};
export interface Response {
    answers: Array<[bigint, string]>;
    respondent?: Principal;
    formId: bigint;
}
export interface Question {
    id: bigint;
    questionLabel: string;
    questionType: QuestionType;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createForm(title: string, questions: Array<Question>): Promise<bigint>;
    getCallerUserRole(): Promise<UserRole>;
    getForm(formId: bigint): Promise<SurveyForm | null>;
    getFormResponses(formId: bigint): Promise<Array<Response>>;
    isCallerAdmin(): Promise<boolean>;
    listForms(): Promise<Array<SurveyForm>>;
    submitResponse(formId: bigint, answers: Array<[bigint, string]>, _shareToken: string): Promise<void>;
}
