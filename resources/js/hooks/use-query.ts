import {useQuery} from "@tanstack/react-query";

export function useQueryApi<TData>({queryKey, url, method ,options} : {queryKey: string | string[], url: string, method:string ,options?: any}) {
    const {data, isLoading, error} = useQuery<TData>({
        queryKey: [queryKey],
        queryFn: async () => {

            const response = await fetch(url, {
                method: method,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return result;
        },
        ...options,
    })

    return {data, isLoading, error}
}

