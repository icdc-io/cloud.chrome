import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch {
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(storedValue));
		} catch {}
	}, [key, storedValue]);

	const setValue = useCallback((value: T) => {
		setStoredValue((prev: T) =>
			typeof value === "function" ? value(prev) : value,
		);
	}, []);

	return [storedValue, setValue];
};
