import axios from "axios";
import type { ProductImage } from "@/types/product";

const processImages = async (
  images: (File | ProductImage)[]
): Promise<ProductImage[]> => {
  // images can be File[], ProductImage[] or a mixture of both
  // if images are File[], upload them to server, get the filenames, and create ProductImage[]
  // if images are RemoteImage[], just return them

  const files = images.filter((image) => image instanceof File) as File[];
  const productImages = images.filter(
    (image) => !(image instanceof File)
  ) as ProductImage[];

  if (files.length === 0) {
    return Promise.resolve(productImages);
  } else {
    const res = await uploadProductImages(files);
    const filenames = res.data.filenames as string[];
    const newProductImages = filenames.map((filename) => ({
      // generate a unique id string for each image with Date.now() and Math.random()
      id: `${Date.now()}-${Math.random()}`,
      src: `/images/product/${filename}`,
      alt: filename,
    }));

    return [...productImages, ...newProductImages];
  }
};

export default processImages;

const uploadProductImages = (images: File[]) => {
  const imageFormData = new FormData();

  images.forEach((image) => {
    imageFormData.append("product-images", image);
  });

  return axios.post("/api/upload?type=product-images", imageFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
