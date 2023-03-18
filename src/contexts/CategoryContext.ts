import { createContext, useState, useContext, ReactNode } from 'react';
import { Category } from '@/types/category';
import { useEffect } from 'react';
  
interface CategoryContextValue {
    getCategoryProps: ({ categoryID, props }: { categoryID: string, props: Array<keyof Category> }) => Partial<Category>;
}
  
const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

export default CategoryContext;




export const useCategory = () => {
    const context = useContext(CategoryContext);

    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }

    return context;
};


export const useCategoryProviderValue = () => {
    
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/categories');
            const categories = await response.json();
            setCategories(categories);
        };
        fetchCategories();
    }, []);




    const getCategoryProps = ({ categoryID, props }: { categoryID: string, props: Array<keyof Category> }) => {
        const category = categories.find((category) => category.id === categoryID);
    
        if (!category) {
            throw new Error('Category not found');
        }
    
        const categoryProps: Partial<Category> = {};
    
        props.forEach((prop) => {
            categoryProps[prop] = category[prop] as any; 
        });
    
        return categoryProps;
    };
    


    return {
        getCategoryProps
    };
};


