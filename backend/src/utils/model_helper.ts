/**
 * model_helper.ts
 *
 * Helpers that derive audit / scope fields from an authenticated user and
 * produce plain objects that can be spread directly into Prisma create/update
 * data payloads.
 *
 * Equivalent of the AdonisJS assignCreatedBy / assignUpdatedBy / applyBranchScope
 * / getBranchDetails utilities, adapted for Express + Prisma.
 */

import { AuthenticatedUser } from '../config/types/auth';
import {
  BranchDetails,
  extractBranchDetails,
  extractOrgAndBranch,
} from './ability_helper';

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function getResourceInfo(abilities?: string[]): string | null {
  if (!abilities || abilities.length === 0) return null;
  return JSON.stringify(abilities);
}

// ---------------------------------------------------------------------------
// Created-by fields
// ---------------------------------------------------------------------------

export interface CreatedByFields {
  createdBy: number | null;
  createdByAdmin: number | null;
  resourceInfo: string | null;
  branchId?: number | null;
  organizationId?: number | null;
}

/**
 * Return the audit fields to merge into a Prisma **create** payload.
 *
 * @example
 * const data = { ...req.body, ...assignCreatedBy(req.user!) };
 * await prisma.someModel.create({ data });
 */
export function assignCreatedBy(user: AuthenticatedUser): CreatedByFields {
  const abilities = user.resourceInfo;
  const resourceInfo = getResourceInfo(abilities);

  if (user.userType === 'user') {
    const { branchId ,orgId } = extractOrgAndBranch(abilities);
    return {
      createdBy: user.id,
      createdByAdmin: null,
      resourceInfo,
      branchId: branchId ?? null,
      organizationId: orgId ?? null,
    };
  }

  // admin – not branch-scoped
  return {
    createdBy: null,
    createdByAdmin: user.id,
    resourceInfo,
  };
}

// ---------------------------------------------------------------------------
// Updated-by fields
// ---------------------------------------------------------------------------

export interface UpdatedByFields {
  updatedBy: number | null;
  updatedByAdmin: number | null;
  resourceInfo: string | null;
  branchId?: number | null;
  organizationId?: number | null;
}

/**
 * Return the audit fields to merge into a Prisma **update** payload.
 *
 * @example
 * const data = { ...req.body, ...assignUpdatedBy(req.user!) };
 * await prisma.someModel.update({ where: { id }, data });
 */
export function assignUpdatedBy(user: AuthenticatedUser): UpdatedByFields {
  const abilities = user.resourceInfo;
  const resourceInfo = getResourceInfo(abilities);
    const { branchId ,orgId } = extractOrgAndBranch(abilities);

  if (user.userType === 'user') {
    return {
      updatedBy: user.id,
      updatedByAdmin: null,
      branchId: branchId ?? null,
      organizationId: orgId ?? null,
      resourceInfo,
    };
  }

  return {
    updatedBy: null,
    updatedByAdmin: user.id,
    resourceInfo,
  };
}

// ---------------------------------------------------------------------------
// Branch scope
// ---------------------------------------------------------------------------

/**
 * Merge a branch-id filter into an existing Prisma `where` object.
 * Admin users are not restricted and the original `where` is returned as-is.
 *
 * @example
 * const where = applyBranchScope({ isActive: true }, req.user!);
 * const records = await prisma.someModel.findMany({ where });
 */
export function applyBranchScope(
  where: Record<string, unknown>,
  user: AuthenticatedUser
): Record<string, unknown> {
  if (user.userType === 'admin') {
    return where;
  }

  const abilities = user.resourceInfo;

  if (abilities && abilities.length > 0) {
    const { branchId } = extractOrgAndBranch(abilities);
    if (branchId) {
      return { ...where, branchId };
    }
  }



  return where;
}

// ---------------------------------------------------------------------------
// Branch details
// ---------------------------------------------------------------------------

/**
 * Derive branch details for the authenticated user.
 * Returns `null` for admin users or when no branch is encoded in the token.
 *
 * @example
 * const branch = getBranchDetails(req.user!);
 * if (branch) { ... }
 */
export function getBranchDetails(user: AuthenticatedUser): BranchDetails | null {
  if (user.userType === 'admin') {
    return null;
  }

  const abilities = user.resourceInfo;
  if (!abilities || abilities.length === 0) return null;

  const { branchId } = extractOrgAndBranch(abilities);
  return extractBranchDetails(branchId, abilities);
}
