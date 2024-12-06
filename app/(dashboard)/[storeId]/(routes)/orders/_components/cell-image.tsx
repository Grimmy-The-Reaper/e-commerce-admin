"use client";

import Image from "next/image";

interface CellImageProps {
  data: string[];
}

const CellImage = ({ data }: CellImageProps) => {
  return (
    <>
      {data.map((url, index) => (
        <div
          key={index}
          className="overflow-hidden w-16 h-16 min-h-16 min-w-16 aspect-square rounded-md flex items-center justify-center relative"
        >
          <Image alt="image" fill className="object-contain" src={url} />
        </div>
      ))}
    </>
  );
};

export default CellImage;


//for dynamic from supabase

// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { supabase } from "@/lib/supabase";  // Assuming you have a supabase client set up

// interface CellImageProps {
//   imagePaths: string[];  // Array of image paths stored in Supabase storage
// }

// const CellImage = ({ imagePaths }: CellImageProps) => {
//   const [imageUrls, setImageUrls] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchImageUrls = async () => {
//       const urls = await Promise.all(
//         imagePaths.map(async (path) => {
//           const { signedURL, error } = await supabase
//             .storage
//             .from('your_bucket_name')  // Replace with your Supabase storage bucket name
//             .getPublicUrl(path);  // Path of the image in Supabase storage

//           if (error) {
//             console.error("Error fetching image:", error);
//             return "";  // Return empty string in case of error
//           }

//           return signedURL;
//         })
//       );
//       setImageUrls(urls);
//     };

//     if (imagePaths.length > 0) {
//       fetchImageUrls();
//     }
//   }, [imagePaths]);

//   return (
//     <>
//       {imageUrls.map((url, index) => (
//         url && (
//           <div
//             key={index}
//             className="overflow-hidden w-16 h-16 min-h-16 min-w-16 aspect-square rounded-md flex items-center justify-center relative"
//           >
//             <Image alt="image" fill className="object-contain" src={url} />
//           </div>
//         )
//       ))}
//     </>
//   );
// };

// export default CellImage;
