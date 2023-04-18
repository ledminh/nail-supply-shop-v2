// import * as CategoryModel from "./models/category";
import * as CategoryModel from './prisma/category';
// import * as ProductModel from "./models/product";
import * as ProductModel from './prisma/product';

import * as AboutUsModel from "./models/aboutUs";
import * as OrderModel from "./models/order";

import type { DBProduct, DBProductGroup } from "@/types/product";
import type { Order, FilterOrder, StatusValue } from "@/types/order";

/********************************************************
 * CATEGORY
 */

/**********************
 * getCategories
 */

export function getCategories() {
  const categories = CategoryModel.find({});
  return categories;
}

export function createCategory(props: CategoryModel.CreateCategoryProps) {
  const category = CategoryModel.createCategory(props);
  return category;
}

export function updateCategory(props: CategoryModel.UpdateCategoryProps) {
  const category = CategoryModel.updateCategory(props);
  return category;
}

export function deleteCategory(id: string) {
  const category = CategoryModel.deleteCategory(id);
  return category;
}

/***********************************************************
 * PRODUCT
 */

/**************************
 * getProducts
 */

export function getProducts(options: ProductModel.FindProductOptions) {
  return ProductModel.find(options);
}

/**************************
 * getProduct
 */

type GetProductProps = {
  id?: string;
  name?: string;
};

type GetProductResponse =
  | {
      success: true;
      data: DBProduct;
    }
  | {
      success: false;
      message: string;
    };

export const getProduct = ({ id, name }: GetProductProps): Promise<GetProductResponse> =>
  ProductModel.find({ id, name,  type: "product", }) as Promise<GetProductResponse>;

/**************************
 * getGroup
 */

type GetGroupProps = {  id?: string; name?: string; };

type GetGroupResponse = 
  | {
      success: true;
      data: DBProductGroup;
    }
  | {
      success: false;
      message: string;
    };

export const getGroup = ({
  id,
  name,
}: GetGroupProps): Promise<GetGroupResponse> =>
  ProductModel.find({ id, name, type: "group" }) as Promise<GetGroupResponse>;

/**************************
 * deleteProduct
 */

export function deleteProduct({
  id,
}: ProductModel.DeleteProductProps): Promise<ProductModel.DeleteProductResponse> {
  return ProductModel.deleteProduct({ id });
}

export function deleteGroup({
  id,
}: ProductModel.DeleteGroupProps): Promise<ProductModel.DeleteGroupResponse> {
  return ProductModel.deleteGroup({ id });
}

/*****************************
 * addProduct
 */

export function addProduct({
  product,
}: ProductModel.AddProductProps): Promise<ProductModel.AddProductResponse> {
  return ProductModel.addProduct({ product });
}

/*****************************
 * addGroup
 */

export function addGroup({
  group,
}: ProductModel.AddGroupProps): Promise<ProductModel.AddGroupResponse> {
  return ProductModel.addGroup({ group });
}

/*****************************
 * updateProduct
 *****************************/

export function updateProduct({
  product,
}: ProductModel.UpdateProductProps): Promise<ProductModel.UpdateProductResponse> {
  return ProductModel.updateProduct({ product });
}

/*****************************
 * updateGroup
 ******************************/

export function updateGroup({
  group,
}: ProductModel.UpdateGroupProps): Promise<ProductModel.UpdateGroupResponse> {
  return ProductModel.updateGroup({ group });
}

/*****************************
 * updateGroupProduct
 ******************************/

export function updateGroupProduct({
  groupID,
  product,
}: ProductModel.UpdateGroupProductProps): Promise<ProductModel.UpdateGroupProductResponse> {
  return ProductModel.updateGroupProduct({ groupID, product });
}

/*****************************
 * updateQuantity
 ******************************/

export function updateProductQuantity(quantityData: ProductModel.UpdateQuantityProps): Promise<ProductModel.UpdateQuantityResponse> {
  return ProductModel.updateQuantity(quantityData);
}


/***********************************************************
 * ABOUT US
 */

export function getAboutUsData(): Promise<AboutUsModel.GetAboutUsDataResponse> {
  return AboutUsModel.getAboutUsData();
}

export function setAboutUsFooter({ footer }: AboutUsModel.SetAboutUsFooterProps): Promise<AboutUsModel.SetAboutUsFooterResponse> {
  return AboutUsModel.setAboutUsFooter({footer});
}

export function setAboutUsMissionStatement({ missionStatement }: AboutUsModel.SetAboutUsMissionStatementProps): Promise<AboutUsModel.SetAboutUsMissionStatementResponse> {
  return AboutUsModel.setAboutUsMissionStatement({missionStatement});
}

export function setAboutUsHistoryHTML({history}: AboutUsModel.SetAboutUsHistoryHTMLProps): Promise<AboutUsModel.SetAboutUsHistoryHTMLResponse>  {
  return AboutUsModel.setAboutUsHistoryHTML({history});
}

export function setAboutUsContactInfo({contactInfo}: AboutUsModel.SetAboutUsContactInfoProps): Promise<AboutUsModel.SetAboutUsContactInfoResponse> {
  return AboutUsModel.setAboutUsContactInfo({contactInfo});
}

/***********************************************************
 * ORDERS
 */
export const getOrders = async () => {
  const orders = OrderModel.find({});

  return orders;
};

export const getOrder = async (id: string) => {
  const order = OrderModel.find({ id });

  return order;
};

export const saveOrder = async (order: Order) => {
  const savedOrder = OrderModel.add(order);

  return savedOrder;
};

export const deleteOrder = async (id: string) => {
  const order = OrderModel.deleteOrder(id);

  return order;
};

export const filterOrders = async (filter: FilterOrder) => {
  const orders = OrderModel.filter(filter);

  return orders;
};

export const updateOrderStatus = async (id: string, status: StatusValue) => {
  const order = OrderModel.updateStatus(id, status);

  return order;
};

export const saveTempOrder = async (order: Order) => {
  const savedOrder = OrderModel.saveTemp(order);

  return savedOrder;
};

export const getTempOrder = async (id: string) => {
  const order = OrderModel.findTemp(id);

  return order;
};

export const deleteTempOrder = async (id: string) => {
  const order = OrderModel.deleteTemp(id);

  return order;
};
