import  * as CategoryModel  from './models/category';
import * as ProductModel  from './models/product';
import * as AboutUsModel  from './models/aboutUs';
import * as OrderModel  from './models/order';

import type { DBProduct, DBProductGroup } from '@/types/product';
import type { FilterOrder, StatusValue } from '@/types/order';

/********************************************************
 * CATEGORY
 */

/**********************
 * getCategories
 */

type getCategoriesProps = {
    
};

export function getCategories({}:getCategoriesProps) {
    const categories = CategoryModel.find();
    return categories;
}





/***********************************************************
 * PRODUCT
 */ 

/**************************
 * getProducts
 */


export function getProducts(options:ProductModel.FindProductOptions) {

    return ProductModel.find(options);
    
}

/**************************
 * getProduct
 */

type getProductProps = {
    id?: string;
    name?: string;
}

export const getProduct = ({id, name}:getProductProps) => ProductModel.find({id, name});



/**************************
 * deleteProduct
 */

type deleteProductProps = {
    id: string;
}

export function deleteProduct({id}:deleteProductProps) {
    return ProductModel.deleteProduct({id});
}



/*****************************
 * addProduct
 */

type addProductProps = {
    product: DBProduct;
}

export function addProduct({product}:addProductProps) {
    return ProductModel.addProduct({product});
}


/*****************************
 * addGroup
 */

type addGroupProps = {
    group: DBProductGroup;
}

export function addGroup({group}:addGroupProps) {
    return ProductModel.addGroup({group});
}

/*****************************
 * updateProduct
 *****************************/

type updateProductProps = {
    product: DBProduct;
}

export function updateProduct({product}:updateProductProps) {
    return ProductModel.updateProduct({product});
}

/*****************************
 * updateGroup
 ******************************/

type updateGroupProps = {
    group: DBProductGroup;
}

export function updateGroup({group}:updateGroupProps) {
    return ProductModel.updateGroup({group});
}

/*****************************
 * updateGroupProduct
 ******************************/

type updateGroupProductProps = {
    groupID: string;
    product: DBProduct;
}

export function updateGroupProduct({groupID, product}:updateGroupProductProps) {
    return ProductModel.updateGroupProduct({groupID, product});
}


/***********************************************************
 * ABOUT US
 */ 

export function getAboutUsData() {
    return AboutUsModel.getAboutUsData();
}

export function setAboutUsFooter(footer: string) {
    return AboutUsModel.setAboutUsFooter(footer);
}

export function setAboutUsMissionStatement(missionStatement: string) {
    return AboutUsModel.setAboutUsMissionStatement(missionStatement);
}

export function setAboutUsHistoryHTML(history: string) {
    return AboutUsModel.setAboutUsHistoryHTML(history);
}

export function setAboutUsContactInfo(email: string, phone: string, additionalInfos?: string[]) {
    return AboutUsModel.setAboutUsContactInfo(email, phone, additionalInfos);
}


/***********************************************************
 * ORDERS
 */ 
export const getOrders = async () => {
    const orders = OrderModel.find();    

    return orders;
}

export const deleteOrder = async (id: string) => {
    const order = OrderModel.deleteOrder(id);

    return order;
}

export const updateOrderStatus = async (id: string, status: StatusValue) => {
    const order = OrderModel.updateOrderStatus(id, status);

    return order;
}

export const filterOrders = async (filter:FilterOrder) => {
    const orders = OrderModel.filterOrders(filter);

    return orders;
}