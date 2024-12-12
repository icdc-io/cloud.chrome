import { BrickWall, ChevronRight, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

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
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {/* <SidebarMenuItem>
          <SidebarMenuSub>
            {items.map((subItem) => (
              <SidebarMenuButton tooltip={subItem.title} key={subItem.title}>
                <Link
                  className="py-2.5"
                  to={`/${currentService}/${subItem.url}`}
                >
                  <BrickWall size={24} />
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem> */}

        {/* <SidebarMenuSubItem
          key={subItem.title}
          className="text-base font-bold text-white"
        >
          <SidebarMenuSubButton
            asChild
            isActive={subItem.url === currentRemote}
          >
            <Link className="py-2.5" to={`/${currentService}/${subItem.url}`}>
              <BrickWall size={24} />
              <span className="text-base font-bold text-white">
                {subItem.title}
              </span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem> */}

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
                    <BrickWall size={24} />
                    <span className="text-base font-bold text-white">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
