import { Plan } from "./plan";
import { Role } from "./role";

export class User {
    id: number;
    fullname: string;
    email: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
    changePassword: boolean;
    emailVerified: boolean;
    agreeTerm: boolean;
    socialLogin: boolean;
    roleId: number;
    role: Role;
    planId: number ;
    plan: Plan ;
    isActive: boolean;
    rememberMe: boolean;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    createdById: number;
    addressId: number;
    token: string;
    currentUrl: string;
    invitationIsSent: boolean;
    tenantId: number;
    accountDeleted: boolean;
}
