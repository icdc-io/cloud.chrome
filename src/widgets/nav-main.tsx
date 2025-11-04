import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Question from "@/shared/images/question.svg";
// import { builtInServices } from "@/shared/constants/builtInServices";
import { Collapsible, CollapsibleTrigger } from "@/shared/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shared/ui/sidebar";

export function NavMain({
	items,
	currentService,
}: {
	items: { title: string; url: string; icon?: LucideIcon }[];
	currentService: string;
}) {
	const location = useLocation();
	const currentRemote = location.pathname.split("/")[2];

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={false}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<Link className="w-full" to={`/${currentService}/${item.url}`}>
									<SidebarMenuButton
										tooltip={item.title}
										className="py-3 text-base font-bold text-white"
										isActive={item.url === currentRemote}
									>
										<div className="min-w-8 flex">
											<img
												className="m-auto"
												src={`/icons/${currentService}_${item.url}.svg`}
												alt={currentService}
												onError={({ currentTarget }) => {
													currentTarget.onerror = null;
													currentTarget.src = Question;
												}}
											/>
										</div>

										{/* <BrickWall size={24} /> */}
										<span className="text-base font-bold text-white ml-2">
											{item.title}
										</span>
									</SidebarMenuButton>
								</Link>
							</CollapsibleTrigger>
						</SidebarMenuItem>
					</Collapsible>
				))}
				{/* {builtInServices[currentService]?.map((item) => (
					<Collapsible
						key={item.route}
						asChild
						defaultOpen={false}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<Link
									className="w-full"
									to={`/${currentService}/${item.route}`}
								>
									<SidebarMenuButton
										tooltip={item.name}
										className="py-3 text-base font-bold text-white"
										isActive={item.route === currentRemote}
									>
										<BrickWall size={24} />
										<span className="text-base font-bold text-white">
											{item.name}
										</span>
									</SidebarMenuButton>
								</Link>
							</CollapsibleTrigger>
						</SidebarMenuItem>
					</Collapsible>
				))} */}
			</SidebarMenu>
		</SidebarGroup>
	);
}
