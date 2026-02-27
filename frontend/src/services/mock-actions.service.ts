type MockActionResult = {
  ok: true;
  referenceId: string;
  completedAt: string;
};

const ACTION_DELAY_MS = 650;

function createReferenceId(prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${suffix}`;
}

async function completeAction(prefix: string): Promise<MockActionResult> {
  await new Promise((resolve) => setTimeout(resolve, ACTION_DELAY_MS));
  return {
    ok: true,
    referenceId: createReferenceId(prefix),
    completedAt: new Date().toISOString(),
  };
}

export const mockActionsService = {
  requestDataExport() {
    return completeAction("EXPORT");
  },
  requestAccountDeletion() {
    return completeAction("DELETE");
  },
  updatePassword() {
    return completeAction("PASSWD");
  },
  updateProfile() {
    return completeAction("PROFILE");
  },
  startSupportLiveChat() {
    return completeAction("CHAT");
  },
  requestSupportEmail() {
    return completeAction("SUPPORT");
  },
};
