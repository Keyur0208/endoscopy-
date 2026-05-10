/**
 * ability_helper.ts
 *
 * Utilities for parsing the `resourceInfo` (ability) string array that is
 * attached to every auth-access-token.
 *
 * Each ability is a colon-delimited string, e.g.
 *   "org:1"        → organisation id
 *   "branch:2"     → branch id
 *   "ip:10.0.0.1"  → originating IP address
 */

export interface OrgBranchInfo {
  orgId: number | null;
  branchId: number | null;
  ipAddress: string | null;
  pcName: string | null;
}

export interface BranchDetails {
  branchId: number;
  orgId: number | null;
  ipAddress: string | null;
}

/**
 * Extract organisation id, branch id and IP address from an abilities array.
 */
export function extractOrgAndBranch(abilities: string[]): OrgBranchInfo {
  let orgId: number | null = null;
  let branchId: number | null = null;
  let ipAddress: string | null = null;
  let pcName: string | null = null;

  for (const ability of abilities) {
    if (ability.startsWith('org:')) {
      const value = Number(ability.slice(4));
      if (!Number.isNaN(value) && value > 0) orgId = value;
    } else if (ability.startsWith('branch:')) {
      const value = Number(ability.slice(7));
      if (!Number.isNaN(value) && value > 0) branchId = value;
    } else if (ability.startsWith('ip:')) {
      ipAddress = ability.slice(3);
    } else if (ability.startsWith('pc:')) {
      pcName = ability.slice(3);
    }
  }

  return { orgId, branchId, ipAddress, pcName };
}

/**
 * Build a BranchDetails object for the given branchId using the
 * abilities array for supplementary context (orgId, ipAddress).
 * Returns null when branchId is falsy (0 / null / undefined).
 */
export function extractBranchDetails(
  branchId: number | null | undefined,
  abilities: string[]
): BranchDetails | null {
  if (!branchId) return null;

  const { orgId, ipAddress } = extractOrgAndBranch(abilities);

  return { branchId, orgId, ipAddress };
}
