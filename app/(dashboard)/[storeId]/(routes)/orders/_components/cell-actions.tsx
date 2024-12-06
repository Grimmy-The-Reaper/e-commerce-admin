"use client";

import { useParams, useRouter } from "next/navigation";
import { OrdersColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModel } from "@/components/model/alert-model";

interface CellActionProps {
  data: OrdersColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order id copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);

      toast.success("Order Removed");
      location.reload();
      router.push(`/${params.storeId}/orders`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
      location.reload();
      router.push(`/${params.storeId}/orders`);
      toast.success("Order Updated");
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModel
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              onUpdate({ id: data.id, order_status: "Delivering" })
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Delivering
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, order_status: "Delivered" })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Delivered
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, order_status: "Canceled" })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Cancel
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};


// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { OrdersColumns } from "./columns";
// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
// import toast from "react-hot-toast";
// import { supabase } from "@/lib/supabaseClient"; // Import your Supabase client
// import { AlertModel } from "@/components/model/alert-model";

// interface CellActionProps {
//   data: OrdersColumns;
// }

// export const CellAction = ({ data }: CellActionProps) => {
//   const router = useRouter();
//   const params = useParams();

//   const [isLoading, setIsLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const onCopy = (id: string) => {
//     navigator.clipboard.writeText(id);
//     toast.success("Order id copied to clipboard");
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);

//       // Use Supabase to delete the order
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', data.id)
//         .eq('store_id', params.storeId); // Ensure the store ID matches

//       if (error) {
//         throw error;
//       }

//       toast.success("Order Removed");
//       location.reload();
//       router.push(`/${params.storeId}/orders`);
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//       setOpen(false);
//     }
//   };

//   const onUpdate = async (status: string) => {
//     try {
//       setIsLoading(true);

//       // Use Supabase to update the order status
//       const { error } = await supabase
//         .from('orders')
//         .update({ order_status: status })
//         .eq('id', data.id)
//         .eq('store_id', params.storeId); // Ensure the store ID matches

//       if (error) {
//         throw error;
//       }

//       location.reload();
//       router.push(`/${params.storeId}/orders`);
//       toast.success("Order Updated");
//     } catch (error) {
//       toast.error("Something Went Wrong");
//     } finally {
//       router.refresh();
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <AlertModel
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={onDelete}
//         loading={isLoading}
//       />
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button className="h-8 w-8 p-0" variant={"ghost"}>
//             <span className="sr-only">Open</span>
//             <MoreVertical className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuItem onClick={() => onCopy(data.id)}>
//             <Copy className="h-4 w-4 mr-2" />
//             Copy Id
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => onUpdate("Delivering")}
//           >
//             <Edit className="h-4 w-4 mr-2" />
//             Delivering
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => onUpdate("Delivered")}
//           >
//             <Edit className="h-4 w-4 mr-2" />
//             Delivered
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => onUpdate("Canceled")}
//           >
//             <Edit className="h-4 w-4 mr-2" />
//             Cancel
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => setOpen(true)}>
//             <Trash className="h-4 w-4 mr-2" />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };
