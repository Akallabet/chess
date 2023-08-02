export const useLocalStorage = () => {
  return {
    setItem: <T>(key: string, item: T) =>
      window.localStorage.setItem(key, JSON.stringify(item)),
    getItem: (key: string) => {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
  };
};
