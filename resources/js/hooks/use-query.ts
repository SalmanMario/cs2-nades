import {useQuery} from "@tanstack/react-query";
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export function useQueryApi<TData>({
                                       queryKey,
                                       url,
                                       method,
                                       body,
                                       params,
                                       enabled,
                                       options
                                   }: {
    queryKey: string | string[],
    url: string,
    method: string,
    body?: any,
    params?: Record<string, string | number | undefined>,
    enabled?: boolean,
    options?: any
}) {
    const {data, isLoading, isFetching, error} = useQuery<TData>({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn: async () => {
            let finalUrl = url;

            if (params) {
                const search = new URLSearchParams(
                    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "") as [string, string][]
                ).toString();
                if (search) finalUrl += `?${search}`;
            }

            const response = await fetch(finalUrl, {
                method: method,
                headers: {
                    ...(body ? {"Content-Type": "application/json"} : {}),
                    ...(csrf ? {"X-CSRF-TOKEN": csrf} : {}),
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

    return {data, isLoading, isFetching, error}
}
