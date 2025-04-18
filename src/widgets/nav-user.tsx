import { SidebarMenu, SidebarMenuItem } from "@/shared/ui/sidebar";
import UserDropdown from "./UserDropdown";

type UserDropdownType = {
	isFullInfoAvailable: boolean;
};
export function NavUser({ isFullInfoAvailable }: UserDropdownType) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<UserDropdown isFullInfoAvailable={isFullInfoAvailable} />
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
