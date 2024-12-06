import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from "@/types-db";
import { Navbar } from "@/components/navbar";
import ThemeToggleButton from "@/components/themetogglebutton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { storeId: string };
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(
      collection(db, "stores"),
      where("userId", "==", userId),
      where("id", "==", params.storeId)
    )
  );

  let store = null as any;

  storeSnap.forEach((doc) => {
    store = doc.data() as Store;
    return;
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar/>
      {children}
    </>
  );
};

export default DashboardLayout;


// import { supabase } from "@/lib/supabaseClient"; // Supabase client initialization
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { Navbar } from "@/components/navbar";
// import ThemeToggleButton from "@/components/themetogglebutton";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   params: { storeId: string };
// }

// const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
//   const { userId } = auth();

//   if (!userId) {
//     redirect("/sign-in");
//     return null; // Avoid further rendering
//   }

//   // Fetch the store associated with the user
//   const { data: store, error } = await supabase
//     .from("stores")
//     .select("*")
//     .eq("userId", userId)
//     .eq("id", params.storeId)
//     .single();

//   if (error || !store) {
//     console.error("Error fetching store:", error?.message);
//     redirect("/");
//     return null; // Avoid further rendering
//   }

//   return (
//     <>
//       <Navbar />
//       {children}
//     </>
//   );
// };

// export default DashboardLayout;
