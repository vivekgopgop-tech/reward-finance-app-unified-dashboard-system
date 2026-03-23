import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export interface DepositRequest {
    utr?: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    qrCodeData: string;
    user: Principal;
    timestamp: bigint;
    amount: bigint;
}
export enum PaymentMethod {
    bhim = "bhim",
    googlePay = "googlePay",
    paytm = "paytm",
    phonePe = "phonePe"
}
export enum PaymentStatus {
    verified = "verified",
    pending = "pending",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDepositRequest(amount: bigint, paymentMethod: PaymentMethod): Promise<string>;
    getAllDepositRequests(): Promise<Array<DepositRequest>>;
    getCallerDepositRequests(): Promise<Array<DepositRequest>>;
    getCallerRole(): Promise<UserRole>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDepositRequest(requestId: string): Promise<DepositRequest>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitUtr(requestId: string, utr: string): Promise<void>;
    verifyPayment(requestId: string, status: PaymentStatus): Promise<void>;
}
