// import { db } from "@/lib/firebase";
// import { Store } from "@/types-db";
// import { auth } from "@clerk/nextjs/server";
// import { doc, getDoc } from "firebase/firestore";
// import { redirect } from "next/navigation";
// import { SettingsForm } from "./components/settings-form";

// interface SettingsPageProps {
//   params: {
//     storeId: string;
//   };
// }

// const SettingsPage = async ({ params }: SettingsPageProps) => {
//   const { userId } = auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   const store = (
//     await getDoc(doc(db, "stores", params.storeId))
//   ).data() as Store;

//   if (!store || store.userId !== userId) {
//     redirect("/");
//   }
//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-5 p-8 pt-6">
//         <SettingsForm initialData={store} />
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;


// import { db } from "@/lib/firebase";
// import { Store } from "@/types-db";
// import { auth } from "@clerk/nextjs/server";
// import { doc, getDoc } from "firebase/firestore";
// import { redirect } from "next/navigation";
// import { SettingsForm } from "./components/settings-form";

// interface SettingsPageProps {
//   params: {
//     storeId: string;
//   };
// }

// const SettingsPage = async ({ params }: SettingsPageProps) => {
//   const { userId } = auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   // Fetch store data
//   const storeDoc = await getDoc(doc(db, "stores", params.storeId));
//   const store = storeDoc.exists() ? (storeDoc.data() as Store) : null;

//   // Check if store exists and if user has permission
//   if (!store || store.userId !== userId) {
//     redirect("/");
//     return null; // Prevent rendering further if redirected
//   }

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-5 p-8 pt-6">
//         <SettingsForm initialData={store} />
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;


// import { Store } from "@/types-db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient"; // Supabase client initialization
// import { SettingsForm } from "./components/settings-form";

// interface SettingsPageProps {
//   params: {
//     storeId: string;
//   };
// }

// const SettingsPage = async ({ params }: SettingsPageProps) => {
//   const { userId } = auth();

//   // Redirect to sign-in if user is not authenticated
//   if (!userId) {
//     redirect("/sign-in");
//     return null;
//   }

//   // Fetch store data from Supabase
//   const { data: store, error } = await supabase
//     .from("stores")
//     .select("*")
//     .eq("id", params.storeId)
//     .single();

//   // Handle errors or missing store
//   if (error || !store) {
//     console.error("Error fetching store:", error?.message || "Store not found");
//     redirect("/");
//     return null;
//   }

//   // Ensure the user has permission to access this store
//   if (store.user_id !== userId) {
//     console.error("Unauthorized access attempt.");
//     redirect("/");
//     return null;
//   }

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-5 p-8 pt-6">
//         <SettingsForm initialData={store} />
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;



import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = auth();

  // Log if the user is not authenticated
  if (!userId) {
    console.log("Redirecting to sign-in due to missing userId.");
    redirect("/sign-in");
  }

  // Fetch the store document and check if it exists
  const storeDoc = await getDoc(doc(db, "stores", params.storeId));
  const store = storeDoc.exists() ? (storeDoc.data() as Store) : null;

  // Log if the store document was not found in Firestore
  if (!store) {
    console.log("Redirecting to home because store was not found.");
    redirect("/");
  }

  // Log if the user ID does not match the store's userID (i.e., unauthorized access)
  if (store.userId !== userId) {
    console.log("Redirecting to home due to user mismatch.");
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-5 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
