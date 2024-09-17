import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcnComponents/ui/table";
import { Badge } from "../../shadcnComponents/ui/badge";
import { Switch } from "../../shadcnComponents/ui/switch";
import { Pencil } from "lucide-react";
import { Input } from "../../shadcnComponents/ui/input";
import { Search } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../../shadcnComponents/ui/menubar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../shadcnComponents/ui/pagination";

const rows = [
  {
    name: "Brewstore",
    badge: "Partner",
    status: "Active",
    date: "7/16/2024, 11:22:54 PM",
    variant: "partner",
  },
  {
    name: "Cafe Delight",
    badge: "Distributor",
    status: "Inactive",
    date: "8/22/2024, 10:15:00 AM",
    variant: "distributor",
  },
  {
    name: "Book Nook",
    badge: "Partner",
    status: "Active",
    date: "9/10/2024, 3:30:00 PM",
    variant: "partner",
  },
  // Add more rows as needed
];

function TableOne() {

  
  return (
    <>
      <div className="bg-white flex flex-col w-full px-[40px] py-[40px] gap-[30px]">
        <div className="flex flex-row justify-between items-center">
          <div className="font-medium text-[20px]">My Stores</div>
          <div className="flex flex-row items-center gap-[20px] justify-end">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="rounded-l-[8px]">All</MenubarTrigger>
                <MenubarTrigger>Active</MenubarTrigger>
                <MenubarTrigger className="rounded-r-[8px]">
                  Inactive
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>

            <div className="relative flex w-[230px] items-center">
              <Input
                type="text"
                placeholder="Please enter search text here"
                className="pr-10 border-gray-300 rounded-[8px] hover:border-[#FB8500] focus:border-OGOrange"
              />
              <Search className="absolute right-3 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Store Name</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date and Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge variant={row.variant}>{row.badge}</Badge>
                </TableCell>
                <TableCell>
                  <Switch />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Pencil className="w-4 h-4 text-gray-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

export default TableOne;
