"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";
import CellImage from "./cell-image";
import { cn } from "@/lib/utils";

export type OrdersColumns = {
  id: string;
  phone: string;
  address: string;
  books: string;
  totalPrice: string;
  images: string[];
  isPaid: boolean;
  createdAt: string;
  order_status: string;
};

export const columns: ColumnDef<OrdersColumns>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => (
      <div className="grid grid-cols-2 gap-2">
        <CellImage data={row.original.images} />
      </div>
    ),
  },
  {
    accessorKey: "books",
    header: "Books",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Amount",
  },
  {
    accessorKey: "order_status",
    header: "Status",
    cell: ({ row }) => {
      const { order_status } = row.original;

      return (
        <p
          className={cn(
            "text-base font-semibold",
            (order_status === "Delivering" && "text-yellow-500") ||
              (order_status === "Processing" && "text-orange-500") ||
              (order_status === "Delivered" && "text-emerald-500") ||
              (order_status === "Canceled" && "text-red-500")
          )}
        >
          {order_status}
        </p>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
      const { isPaid } = row.original;

      return (
        <p
          className={cn(
            "text-base font-semibold",
            isPaid ? "text-emerald-500" : "text-red-500"
          )}
        >
          {isPaid ? "Paid" : "Not Paid"}
        </p>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];


// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { ArrowUpDown } from "lucide-react";
// import { CellAction } from "./cell-actions";
// import CellImage from "./cell-image";
// import { cn } from "@/lib/utils";

// // Assuming the data is fetched from Supabase and passed into the component
// export type OrdersColumns = {
//   id: string;
//   phone: string;
//   address: string;
//   books: string;
//   totalPrice: string;
//   images: string[];
//   isPaid: boolean;
//   createdAt: string | Date;  // This could either be a string or a Date from Supabase
//   order_status: string;
// };

// export const columns: ColumnDef<OrdersColumns>[] = [
//   {
//     accessorKey: "images",
//     header: "Images",
//     cell: ({ row }) => (
//       <div className="grid grid-cols-2 gap-2">
//         <CellImage data={row.original.images} />
//       </div>
//     ),
//   },
//   {
//     accessorKey: "books",
//     header: "Books",
//   },
//   {
//     accessorKey: "phone",
//     header: "Phone",
//   },
//   {
//     accessorKey: "address",
//     header: "Address",
//   },
//   {
//     accessorKey: "totalPrice",
//     header: "Amount",
//   },
//   {
//     accessorKey: "order_status",
//     header: "Status",
//     cell: ({ row }) => {
//       const { order_status } = row.original;

//       return (
//         <p
//           className={cn(
//             "text-base font-semibold",
//             (order_status === "Delivering" && "text-yellow-500") ||
//               (order_status === "Processing" && "text-orange-500") ||
//               (order_status === "Delivered" && "text-emerald-500") ||
//               (order_status === "Canceled" && "text-red-500")
//           )}
//         >
//           {order_status}
//         </p>
//       );
//     },
//   },
//   {
//     accessorKey: "isPaid",
//     header: "Payment Status",
//     cell: ({ row }) => {
//       const { isPaid } = row.original;

//       return (
//         <p
//           className={cn(
//             "text-base font-semibold",
//             isPaid ? "text-emerald-500" : "text-red-500"
//           )}
//         >
//           {isPaid ? "Paid" : "Not Paid"}
//         </p>
//       );
//     },
//   },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Date
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       const { createdAt } = row.original;
//       const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
//       return <span>{date.toLocaleDateString()}</span>;
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <CellAction data={row.original} />,
//   },
// ];