
// import { db } from "@/lib/firebase";
// import { collection, doc, getDocs } from "firebase/firestore";
// import { format } from "date-fns";

// import { BillboardClient } from "./_components/client";
// import { Billboards } from "@/types-db";
// import { BillboardColumns } from "./_components/columns";

// const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
//   try {
//     const billboardsRef = collection(doc(db, "stores", params.storeId), "billboards");
//     const billboardsSnapshot = await getDocs(billboardsRef);
    
//     const formattedBillboards: BillboardColumns[] = billboardsSnapshot.docs.map((doc) => {
//       const data = doc.data();
      
//       return {
//         id: doc.id,
//         label: data.label?.toString() || "Untitled",
//         imageUrl: data.imageUrl?.toString() || "",
//         createdAt: data.createdAt 
//           ? format(data.createdAt.toDate(), "MMMM do, yyyy").toString()
//           : "No date"
//       };
//     });

//     return (
//       <div className="flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           <BillboardClient data={formattedBillboards} />
//         </div>
//       </div>
//     );
    
//   } catch (error) {
//     console.error("Error fetching billboards:", error);
//     return (
//       <div className="flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           <p>Error loading billboards. Please try again later.</p>
//         </div>
//       </div>
//     );
//   }
// };

// export default BillboardsPage;


import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

import { BillboardClient } from "./_components/client";
import { Billboards } from "@/types-db";
import { BillboardColumns } from "./_components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboardsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

  const formattedBillboards: BillboardColumns[] = billboardsData.map(
    (item) => ({
      id: item.id,
      label: item.label,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt
        ? format(item.createdAt.toDate(), "MMMM do, yyyy")
        : "",
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;

// import { createClient } from "@supabase/supabase-js";
// import { format } from "date-fns";

// import { BillboardClient } from "./_components/client";
// import { Billboards } from "@/types-db";
// import { BillboardColumns } from "./_components/columns";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
//   const { data: billboardsData, error } = await supabase
//     .from("billboards")
//     .select("*")
//     .eq("store_id", params.storeId);

//   if (error) {
//     console.error("Error fetching billboards:", error);
//     return <div>Error loading billboards data.</div>;
//   }

//   const formattedBillboards: BillboardColumns[] = billboardsData.map(
//     (item) => ({
//       id: item.id,
//       label: item.label,
//       imageUrl: item.image_url, // Assuming column name is `image_url` in Supabase
//       createdAt: item.created_at
//         ? format(new Date(item.created_at), "MMMM do, yyyy")
//         : "",
//     })
//   );

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <BillboardClient data={formattedBillboards} />
//       </div>
//     </div>
//   );
// };

// export default BillboardsPage;
