"use client";

import { useModal } from "connectkit";
import { Squircle } from "corner-smoothing";
import {
  useAccount,
  useConnect as useConnect$1,
  useDisconnect,
  useEnsName,
} from "wagmi";
import { ConnectKitButton } from "connectkit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { ellipsisAddress } from "@/utils";
import { useCallback } from "react";

export function UserNav() {
  const { address, isConnected, chainId, chain } = useAccount();
  const isMounted = useMounted();
  const { disconnect } = useDisconnect();
  const { reset } = useConnect$1();
  const { setOpen } = useModal();
  const { data: ensName } = useEnsName({
    chainId: chainId,
    address: address,
  });

  const handleDisconnect = useCallback(() => {
    setOpen(false);
    disconnect();
    reset();
  }, [disconnect, reset, setOpen]);

  if (!isMounted) return null;

  if (!isConnected && !address) {
    return (
      // <Squircle cornerRadius={20} cornerSmoothing={1}>
      //   <button
      //     onClick={() => setOpen(true)}
      //     className="bg-[#33CB82] hover:bg-[#33CB82]/80 font-medium px-6 rounded-[0] py-4 transition-colors duration-200"
      //   >
      //     Connect Wallet
      //   </button>
      // </Squircle>
      <ConnectKitButton />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Squircle cornerRadius={20} cornerSmoothing={1}>
          <button className="bg-[#33CB82] hover:bg-[#33CB82]/80 font-medium px-6 rounded-[0] py-4 transition-colors duration-200">
            {ensName || ellipsisAddress(address || "")}
          </button>
        </Squircle>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Connected</p>
            <p className="text-xs leading-none text-muted-foreground">
              {chain?.name}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleDisconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
