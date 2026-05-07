import {useMutation, type UseMutationOptions} from "@tanstack/react-query";

type MutationApiOptions<TData, TError, TVariables> = UseMutationOptions<TData, TError, TVariables> & {
    url: string,
    method: string,
}

export function useMutationApi<TData = unknown, TError = Error, TVariables = unknown>({
    url,
    method,
    ...options
}: MutationApiOptions<TData, TError, TVariables>) {
    return useMutation<TData, TError, TVariables>({
        mutationFn: async (variables: TVariables) => {
            const isFormData = variables instanceof FormData;
            const response = await fetch(url, {
                method,
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "",
                    ...(!isFormData && {"Content-Type": "application/json"}),
                },
                body: isFormData ? variables : JSON.stringify(variables),
            });

            if (!response.ok) {
                const data = await response.json();
                const error = new Error(data.message);
                (error as any).errors = data.errors;
                throw error;
            }
            const result = await response.json();

            return result as TData;
        },
        ...options,
    });
}
