
// get month items from now back to 12 months ago in  format "MM/YYYY"
const getMonthItems = () => {
    const monthItems = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    for (let i = 0; i < 12; i++) {
        const curMonth  = month > i? month - i: month - i + 12;
        const curYear = month > i? year: year - 1;


        const monthItem = {
            label: `${curMonth}/${curYear}`,
            value: `${curMonth}/${curYear}`
        };
        monthItems.push(monthItem);
    }
    return monthItems;
};


export const MONTH_ITEMS = getMonthItems();

// get year items from now back to 10 years ago in  format "YYYY"
export const getYearItems = () => {
    const yearItems = [];
    const now = new Date();
    const year = now.getFullYear();
    for (let i = 0; i < 10; i++) {
        const yearItem = {
            label: `${year - i}`,
            value: `${year - i}`
        };
        yearItems.push(yearItem);
    }
    return yearItems;
};

export const YEAR_ITEMS = getYearItems();