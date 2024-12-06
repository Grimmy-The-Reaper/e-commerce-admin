import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import ThemeToggleButton from "./themetogglebutton";

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let stores = [] as Store[];

  storeSnap.forEach((doc) => {
    stores.push(doc.data() as Store);
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Left side: Store switcher */}
        <StoreSwitcher items={stores} />

        {/* Center: Navigation */}
        <MainNav />

        {/* Right side: Theme toggle and user profile */}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggleButton />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
