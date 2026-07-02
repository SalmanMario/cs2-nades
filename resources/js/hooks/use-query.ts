import {useQuery} from "@tanstack/react-query";
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export function useQueryApi<TData>({queryKey, url, method, body, enabled ,options} : {queryKey: string | string[], url: string, method:string, body?: any, enabled?: boolean, options?: any}) {
    const {data, isLoading, error} = useQuery<TData>({
        queryKey: [queryKey],
        queryFn: async () => {

            const response = await fetch(url, {
                method: method,
                headers: {
                    ...(body ? { "Content-Type": "application/json" } : {}),
                    ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return result;
        },
        enabled: enabled,
        ...options,
    })

    return {data, isLoading, error}
}

