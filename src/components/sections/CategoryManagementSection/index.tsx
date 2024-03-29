import AdminCategoryBlockCPN from "@/components/basics/AdminCategoryBlock";
import List from "@/components/generics/List";
import styles from "@styles/sections/CategoryManagementSection.module.scss";

import { RemoteImage } from "@/types/image";
import { Category } from "@/types/category";

import { useState, useEffect } from "react";

import CategoryModal from "@/components/composites/CategoryModal";
import WarningModal from "@/components/composites/WarningModal";
import { categoryManagementConfig } from "@/config";

import axios from "axios";
import getCategoryProps from "@/utils/getCategoryProps";
import { CategoryApiResponse } from "@/pages/api/categories";
import { AxiosResponse } from "axios";


export interface Props {}

export default function CategoryManagementSection({}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [items, setItems] = useState<ItemCPNProps[]>([]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const [toBeDeletedCategoryID, setToBeDeletedCategoryID] = useState<
    string | null
  >(null);
  const [categoryModalType, setCategoryModalType] = useState<
    "create" | "edit" | null
  >(null);

  const [beingEditedCategory, setBeingEditedCategory] =
    useState<Category | null>(null);

  const getCategoryName = (catID: string) => {
    return (
      getCategoryProps({ categories, categoryID: catID, props: ["name"] })
        .name || ""
    );
  };

  useEffect(() => {
    setItems(toItems(categories, onDelete, onEdit, onCreate));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res: AxiosResponse<CategoryApiResponse>) => {
        if (res.data.success) {
          setCategories(res.data.categories as Category[]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  /********************************
   * Functions for CategoryModal
   */
  const onDelete = (catID: string) => {
    setToBeDeletedCategoryID(catID);
    setIsWarningModalOpen(true);
  };

  const onEdit = (catID: string) => {
    setCategoryModalType("edit");
    setBeingEditedCategory(categories.find((cat) => cat.id === catID)!);
    setIsCategoryModalOpen(true);
  };

  const onCreate = () => {
    setCategoryModalType("create");
    setIsCategoryModalOpen(true);
  };

  const deleteCategory = (catID: string) => {
    axios
      .post(`/api/admin/categories/?type=delete&id=${catID}`)
      .then(({ data }) => {
        if (!data.success) {
          throw new Error("Failed to delete category");
        }

        setCategories((prevCats) => prevCats.filter((cat) => cat.id !== catID));

        setToBeDeletedCategoryID(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const createNewCategory = (
    name: string,
    description: string,
    image: File
  ) => {
    const _exec = async () => {
      // Upload the image first
      const imageFormData = new FormData();
      imageFormData.append("cat-image", image);


      const {data} = await axios.post("/api/upload?type=cat-image", imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(!data) {
        throw new Error("Failed to upload image. Data is null");
      }
      
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("imageFileName", data.filename);

      const res = await axios.post("/api/admin/categories?type=create", formData);

      if (!res.data.success) {
        throw new Error("Failed to create new category");
      }

      setCategories([res.data.category, ...categories]);
    };

    _exec().catch((err) => {
      throw new Error(err.message);
    });


  };

  

  const updateCategory = (
    catID: string,
    name: string,
    description: string,
    image: File | RemoteImage
  ) => {
    const formData = new FormData();

    formData.append("id", catID);
    formData.append("name", name);
    formData.append("description", description);

    if (image instanceof File) {
      // Upload the new image
      const imageFormData = new FormData();
      imageFormData.append("cat-image", image);

      axios
        .post("/api/upload?type=cat-image", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data)
        .then((imageData) => {
          formData.append("imageFileName", imageData.filename);
          return axios.post("/api/admin/categories?type=update", formData);
        })
        .then(({ data }) => {
          if (!data.success) {
            throw new Error("Failed to update category");
          }

          setCategories([
            data.category,
            ...categories.filter((cat) => cat.id !== catID),
          ]);
        })

        .catch((err) => {
          console.error(err);
        });
    } else {
      // User did not change the image
      axios
        .post("/api/admin/categories?type=update", formData)
        .then(({ data }) => {
          if (!data.success) {
            throw new Error("Failed to update category");
          }

          setCategories([
            data.category,
            ...categories.filter((cat) => cat.id !== catID),
          ]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <>
      <section className={styles.wrapper}>
        <List
          items={items}
          ItemCPN={ItemCPN}
          liClass={styles.li}
          ulClass={styles.ul}
        />
      </section>
      {isCategoryModalOpen &&
        (categoryModalType === "create" ? (
          <CategoryModal
            type="create"
            onSave={({ name, description, image }) => {
              createNewCategory(name, description, image as File);
              setIsCategoryModalOpen(false);
              setCategoryModalType(null);
            }}
            onCancel={() => {
              setIsCategoryModalOpen(false);
              setCategoryModalType(null);
            }}
          />
        ) : (
          <CategoryModal
            type="edit"
            onSave={({ name, description, image }) => {
              updateCategory(beingEditedCategory!.id, name, description, image);
              setIsCategoryModalOpen(false);
              setCategoryModalType(null);
              setBeingEditedCategory(null);
            }}
            onCancel={() => {
              setIsCategoryModalOpen(false);
              setCategoryModalType(null);
              setBeingEditedCategory(null);
            }}
            initName={beingEditedCategory?.name || ""}
            initDescription={beingEditedCategory?.description || ""}
            initImage={beingEditedCategory?.image as RemoteImage}
          />
        ))}
      {isWarningModalOpen && (
        <WarningModal
          message={categoryManagementConfig.warningMessage(
            getCategoryName(toBeDeletedCategoryID!)
          )}
          onOK={() => {
            if (toBeDeletedCategoryID) deleteCategory(toBeDeletedCategoryID);

            setIsWarningModalOpen(false);
          }}
          onCancel={() => {
            setToBeDeletedCategoryID(null);
            setIsWarningModalOpen(false);
          }}
        />
      )}
    </>
  );
}

CategoryManagementSection.displayName = "CategoryManagementSection";

interface ItemCPNProps {
  id: string;
  image?: RemoteImage;
  name?: string;
  description?: string;
  onDelete?: (catID: string) => void;
  onClick?: (catID: string) => void;
  onCreate?: () => void;
}

const ItemCPN = ({
  id,
  image,
  name,
  description,
  onDelete,
  onClick,
  onCreate,
}: ItemCPNProps) => {
  return (
    <>
      {image && name && description && onDelete && onClick && (
        <AdminCategoryBlockCPN
          id={id}
          image={image}
          name={name}
          description={description}
          onDelete={onDelete}
          onClick={onClick}
          className={styles.categoryBlock}
        />
      )}
      {onCreate && (
        <button
          className={styles.addButton}
          onClick={(e) => {
            e.preventDefault();
            onCreate();
          }}
        >
          ADD
        </button>
      )}
    </>
  );
};

/*************************
 * Helpers
 */
// Category[] -> ItemCPNProps[]

function toItems(
  categories: Category[],
  onDelete: (catID: string) => void,
  onClick: (catID: string) => void,
  onCreate: () => void
) {
  return [
    { id: "add-button", onCreate },
    ...categories.map((cat) => ({
      ...cat,
      onDelete,
      onClick,
    })),
  ];
}
