'use client';

import { useState } from 'react';
import qs from 'query-string';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/stores/use-modal-store';
import { useRouter } from 'next/navigation';

export const DeleteChannelModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { server, channel } = data;
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === 'deleteChannel';

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want do this{' '}
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>{' '}
            # will be permanently deleted?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-end w-full gap-x-2">
            <Button
              disabled={isLoading}
              onClick={() => onClose()}
              variant={`ghost`}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const url = qs.stringifyUrl({
                    url: `/api/channels/${channel?.id}`,
                    query: {
                      serverId: server?.id,
                    },
                  });
                  await axios.delete(url);
                  onClose();
                  router.refresh();
                  router.push(`/servers/${server?.id}`);
                } catch (error) {
                  console.log(error);
                } finally {
                  setIsLoading(false);
                }
              }}
              variant={`primary`}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
