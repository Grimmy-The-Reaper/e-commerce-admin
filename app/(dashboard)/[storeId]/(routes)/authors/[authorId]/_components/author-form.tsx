"use client";

import { Heading } from "@/components/heading";
import { AlertModel } from "@/components/model/alert-model";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Billboards, Author } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AuthorFormProps {
  initialData: Author;
  billboards: Billboards[];
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

export const AuthorForm = ({
  initialData,
  billboards,
}: AuthorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData, 
    // || {
    //   name: "",
    //   billboardId: "",
    // },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Author" : "Create Author";
  const description = initialData ? "Edit author data" : "Add a new author";
  const toastMessage = initialData ? "Author Data Updated" : "Author Created";
  const action = initialData ? "Save Changes" : "Create Author";

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const matchingBillboard = billboards.find(
        (item) => item.id === data.billboardId
      );

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/authors/${params.authorId}`,
          {
            ...data,
            billboardLabel: matchingBillboard?.label,
          }
        );
      } else {
        await axios.post(`/api/${params.storeId}/authors`, {
          ...data,
          billboardLabel: matchingBillboard?.label,
        });
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.storeId}/authors`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/authors/${params.authorId}`);
      toast.success("Author Removed");
      router.refresh();
      router.push(`/${params.storeId}/authors`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Author name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};


// "use client";

// import { Heading } from "@/components/heading";
// import { AlertModel } from "@/components/model/alert-model";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Billboards, Author } from "@/types-db";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Trash } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// interface AuthorFormProps {
//   initialData: Author;
//   billboards: Billboards[];
// }

// const formSchema = z.object({
//   name: z.string().min(1),
//   billboardId: z.string().min(1),
// });

// export const AuthorForm = ({
//   initialData,
//   billboards,
// }: AuthorFormProps) => {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData,
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const params = useParams();
//   const router = useRouter();

//   const title = initialData ? "Edit Author" : "Create Author";
//   const description = initialData ? "Edit Author data" : "Add a new author";
//   const toastMessage = initialData ? "Author Data Updated" : "Author Created";

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       setIsLoading(true);

//       const matchingBillboard = billboards.find(
//         (item) => item.id === data.billboardId
//       );

//       const payload = {
//         name: data.name,
//         billboardId: data.billboardId,
//         billboardLabel: matchingBillboard?.label,
//       };

//       if (initialData) {
//         const { error } = await supabase
//           .from("authors")
//           .update(payload)
//           .eq("id", initialData.id);

//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from("authors").insert(payload);

//         if (error) throw error;
//       }

//       toast.success(toastMessage);
//       router.push(`/${params.storeId}/authors`);
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       router.refresh();
//       setIsLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setIsLoading(true);

//       const { error } = await supabase
//         .from("authors")
//         .delete()
//         .eq("id", initialData.id);

//       if (error) throw error;

//       toast.success("Author Removed");
//       router.push(`/${params.storeId}/authors`);
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//       setOpen(false);
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
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             disabled={isLoading}
//             variant={"destructive"}
//             size={"icon"}
//             onClick={() => setOpen(true)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       <Separator />

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full space-y-8"
//         >
//           <div className="grid grid-cols-3 gap-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       disabled={isLoading}
//                       placeholder="Author name..."
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="billboardId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Billboard</FormLabel>
//                   <FormControl>
//                     <Select
//                       disabled={isLoading}
//                       onValueChange={field.onChange}
//                       value={field.value}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger>
//                         <SelectValue
//                           defaultValue={field.value}
//                           placeholder="Select a billboard"
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {billboards.map((billboard) => (
//                           <SelectItem key={billboard.id} value={billboard.id}>
//                             {billboard.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <Button disabled={isLoading} type="submit" size={"sm"}>
//             Save Changes
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// };
