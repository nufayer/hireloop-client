
"use client";

import Link from "next/link";
import { Bars, Bell, Envelope, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Drawer } from "@heroui/react";

export function DashboardSidebar() {
    const navItems = [
        { icon: House, label: "Home", href: "/dashboard" },
        { icon: Magnifier, label: "Jobs", href: "/dashboard/recruiter/jobs" },
        { icon: Bell, label: "Post a Job", href: "/dashboard/recruiter/jobs/new" },
        { icon: Envelope, label: "Company Profile", href: "/dashboard/recruiter/company" },
        { icon: Person, label: "Profile", href: "/dashboard/profile" },
        { icon: Gear, label: "Settings", href: "/dashboard/settings" },
    ];

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
                item.href ? (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    >
                        <item.icon className="size-5 text-muted" />
                        {item.label}
                    </Link>
                ) : (
                    <button
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                        type="button"
                    >
                        <item.icon className="size-5 text-muted" />
                        {item.label}
                    </button>
                )
            ))}
        </nav>
    );

    return (
        <>
            <aside className="dashboard-sidebar-desktop w-64 flex flex-col shrink-0 border-r border-default p-4">
                {navContent}
            </aside>
            <div className="dashboard-sidebar-mobile p-4">
                <Drawer>
                    <Drawer.Trigger className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm" variant="secondary">
                        <Bars />
                    </Drawer.Trigger>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left">
                            <Drawer.Dialog>
                                <Drawer.CloseTrigger />
                                <Drawer.Header>
                                    <Drawer.Heading>Navigation</Drawer.Heading>
                                </Drawer.Header>
                                <Drawer.Body>{navContent}</Drawer.Body>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </div>
        </>
    );
}