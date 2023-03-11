import LinksList from "@/components/generics/LinksList";
import NavItemCPN from "@/components/basics/NavItemCPN";

import { navigationItems } from "@/app_config";

export default function NavigationBar() {
    return (
        <LinksList 
            items={navigationItems}
            ItemCPN={NavItemCPN}
            liClass =""
            ulClass =""
            linkClass ="" 
            horizontal
        />
    );
}