const saveToLocalStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
};

const getFromLocalStorage = (key: string) => {
    try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error('Error retrieving from local storage:', error);
        return null;
    }
};

export {saveToLocalStorage, getFromLocalStorage};