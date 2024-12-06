"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrdersColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface OrdersClientProps {
  data: OrdersColumns[];
}

export const OrdersClient = ({ data }: OrdersClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

// "use client";

// import { Heading } from "@/components/heading";
// import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
// import { Separator } from "@/components/ui/separator";
// import { Plus } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { OrdersColumns, columns } from "./columns";
// import ApiList from "@/components/api-list";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";  // Assuming you have a Supabase client setup

// interface OrdersClientProps {
//   data: OrdersColumns[];  // This will be fetched from Supabase, so we expect it to be dynamic
// }

// export const OrdersClient = ({ data }: OrdersClientProps) => {
//   const router = useRouter();
//   const params = useParams();
//   const [orders, setOrders] = useState<OrdersColumns[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from("orders")  // Replace with your Supabase table name
//           .select("*")
//           .eq("store_id", params.storeId);  // Filter by storeId to fetch specific store's orders

//         if (error) {
//           console.error("Error fetching orders:", error.message);
//           return;
//         }

//         setOrders(data || []);  // Set orders data from Supabase
//       } catch (error) {
//         console.error("Something went wrong while fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [params.storeId]);

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading
//           title={`Orders (${orders.length})`}
//           description="Manage orders for your store"
//         />
//         <Button
//           variant="default"
//           size="icon"
//           onClick={() => router.push(`/${params.storeId}/orders/create`)}  // Navigate to order creation page
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </div>

//       <Separator />

//       {/* Pass the fetched orders data to the DataTable */}
//       <DataTable searchKey="name" columns={columns} data={orders} />

//     </>
//   );
// };
