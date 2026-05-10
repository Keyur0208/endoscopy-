import type { IDateValue } from './common';
import type { IOrganizationItem } from './organization';
import type { IOrganizationBranchItem } from './organization-branch';
import type { IUserRolePermissionItem } from './user-role-permisson';

// ----------------------------------------------------------------------

export type IResourceInfo = {
  pcName: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  organizationId?: string | null;
  brandId?: string | null;
};

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: number;
  fullName: string;
  email?: string | null;
  mobile?: string | null;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isOtpRequired?: boolean;
  canSwitchBranch?: boolean;
  isOrganizationAdmin?: boolean;
  branchId?: number | null;
  isActive?: boolean;
  userRoles?: IUserRolePermissionItem[];
  organizations?: any[];
  accessToken?: string | null;
  abilities?: string[];
  abilitiesbranchId?: number | null;
  abilitiesorganizationId?: number | null;
  currentbranch?: IOrganizationBranchItem | null;
  branch?: IOrganizationBranchItem | null;
  role?: string | null;
  isAdmin?: boolean;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};

export type IUserItem = {
  id: number;
  userType: string;
  branchId: number | null;
  branch: IOrganizationBranchItem;
  organizationId: number | null;
  organization: IOrganizationItem | null;
  fullName: string | null;
  email: string;
  mobile: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isOtpRequired: boolean;
  canSwitchBranch: boolean;
  isActive: boolean;
  userRoles: IUserRolePermissionItem[];
  policy?: {
    permissions: any;
  };
  permissions: any;
  createdAt: string;
  updatedAt: string | null;
};

export type ICreateUser = {
  organizationId: number | null;
  branchId: number | null;
  fullName?: string;
  email: string;
  mobile: string;
  password: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isOtpRequired: boolean;
  canSwitchBranch: boolean;
  isActive: boolean;
};

export type IUpdateUser = {
  branchId?: number;
  organizationId?: number | null;
  fullName?: string;
  email?: string;
  mobile?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isOtpRequired?: boolean;
  isActive?: boolean;
  canSwitchBranch?: boolean;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

// ----------------------------------------------------------------------
