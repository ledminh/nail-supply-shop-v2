import removeFile from "./supaRemove";

const deleteImages = async (
  filenames: string[],
  type: "category" | "product"
) => {
  const folder = type === "category" ? "category" : "product";

  const _filenames = filenames.map((filename) => {
    const split = filename.split("/");
    return folder + "/" + split[split.length - 1];
  });

  const { error } = await removeFile("nail-supply-store", _filenames);

  if (error) {
    throw new Error(error.message);
  } else {
    return Promise.resolve({
      success: true,
    });
  }
};

export default deleteImages;
