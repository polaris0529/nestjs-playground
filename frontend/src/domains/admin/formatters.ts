import {
  findReferenceCodeLabel,
  type ReferenceCodeOption,
} from '../../shared/reference-codes';
import type { CommonCode, CommonCodeGroup, UseYn } from './types';

export function formatUseYnLabel(
  useYn: UseYn,
  options: ReferenceCodeOption<UseYn>[],
): string {
  return findReferenceCodeLabel(options, useYn, useYn);
}

export function formatRoleText(
  roles: string[] | undefined,
  options: ReferenceCodeOption[],
): string {
  return (
    roles
      ?.map((role) => findReferenceCodeLabel(options, role, role))
      .join(', ') || 'USER'
  );
}

export function resolveCommonCodeGroupName(
  code: CommonCode,
  groups: CommonCodeGroup[],
): string {
  return (
    code.codeGroup?.groupName ??
    groups.find(
      (group) => String(group.codeGroupId) === String(code.codeGroupId),
    )?.groupName ??
    '-'
  );
}
