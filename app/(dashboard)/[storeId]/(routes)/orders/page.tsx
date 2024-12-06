import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

import { OrdersClient } from "./_components/client";
import { Order } from "@/types-db";
import { OrdersColumns } from "./_components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const formattedOrders: OrdersColumns[] = ordersData.map((item) => ({
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    address: item.address,
    books: item.orderItems.map((item) => item.name).join(", "),
    order_status: item.order_status,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        if (item && item.qty !== undefined) {
          return total + Number(item.price * item.qty);
        }
        return total;
      }, 0)
    ),
    images: item.orderItems.map((item) => item.images[0].url),
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;

// import { supabase } from "@/lib/supabaseClient"; // Supabase client initialization
// import { format } from "date-fns";

// import { OrdersClient } from "./_components/client";
// import { Order } from "@/types-db";
// import { OrdersColumns } from "./_components/columns";
// import { formatter } from "@/lib/utils";

// const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
//   // Fetch orders data from Supabase
//   const { data: ordersData, error } = await supabase
//     .from("orders")
//     .select(`
//       id, 
//       isPaid, 
//       phone, 
//       address, 
//       order_status, 
//       createdAt, 
//       orderItems (
//         name,
//         qty,
//         price,
//         images
//       )
//     `)
//     .eq("store_id", params.storeId);

//   if (error) {
//     console.error("Error fetching orders:", error);
//     return (
//       <div className="flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           <p className="text-red-500">Failed to load orders. Please try again later.</p>
//         </div>
//       </div>
//     );
//   }

//   const formattedOrders: OrdersColumns[] = (ordersData || []).map((item: any) => ({
//     id: item.id,
//     isPaid: item.isPaid,
//     phone: item.phone,
//     address: item.address,
//     books: item.orderItems.map((orderItem: any) => orderItem.name).join(", "),
//     order_status: item.order_status,
//     totalPrice: formatter.format(
//       item.orderItems.reduce((total: number, orderItem: any) => {
//         if (orderItem && orderItem.qty !== undefined) {
//           return total + Number(orderItem.price * orderItem.qty);
//         }
//         return total;
//       }, 0)
//     ),
//     images: item.orderItems
//       .map((orderItem: any) => (orderItem.images && orderItem.images[0]?.url) || "")
//       .filter(Boolean), // Ensure we only include valid URLs
//     createdAt: item.createdAt ? format(new Date(item.createdAt), "MMMM do, yyyy") : "",
//   }));

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <OrdersClient data={formattedOrders} />
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;
