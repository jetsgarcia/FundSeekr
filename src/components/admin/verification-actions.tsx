"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface VerificationActionsProps {
  userName: string;
  userType: string;
}

export function VerificationActions({
  userName,
  userType,
}: VerificationActionsProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    // TODO: Call server action to approve user
  };

  const handleReject = async () => {
    setIsRejecting(true);
    // TODO: Call server action to reject user with rejectionReason
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 sm:flex-row sm:gap-3">
        <Button
          variant="destructive"
          size="lg"
          className="flex items-center justify-center space-x-2 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border-0 hover:scale-105 active:scale-95 min-w-[120px]"
          onClick={() => setIsRejectDialogOpen(true)}
          disabled={isApproving || isRejecting}
        >
          {isRejecting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Reject</span>
        </Button>
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border-0 hover:scale-105 active:scale-95 min-w-[120px]"
          onClick={() => setIsApproveDialogOpen(true)}
          disabled={isApproving || isRejecting}
        >
          {isApproving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Approve</span>
        </Button>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Approve User</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve <strong>{userName}</strong>
              &apos;s {userType.toLowerCase()} profile? This action will grant
              them full access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span>Reject User</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject <strong>{userName}</strong>
              &apos;s {userType.toLowerCase()} profile? You can optionally
              provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for rejection (optional)</Label>
              <Input
                id="reason"
                placeholder="e.g., Incomplete information, suspicious activity..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={isRejecting}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
