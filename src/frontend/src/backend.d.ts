import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    content: string;
    role: string;
    timestamp: Time;
    sessionId: bigint;
}
export interface Session {
    id: bigint;
    title: string;
    createdAt: Time;
}
export type Time = bigint;
export interface backendInterface {
    addMessage(sessionId: bigint, role: string, content: string): Promise<Message>;
    createSession(title: string): Promise<Session>;
    deleteSession(sessionId: bigint): Promise<void>;
    getMessagesBySession(sessionId: bigint): Promise<Array<Message>>;
    listSessions(): Promise<Array<Session>>;
}
