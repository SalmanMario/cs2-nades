import {useMutation, type UseMutationOptions} from "@tanstack/react-query";
import {AxiosError} from "axios";
import api from "@/lib/api";

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
            try {
                const response = await api.request<TData>({
                    url,
                    method,
                    data: variables,
                    headers: {
                        Accept: "application/json",
                    },
                });

                return response.data;
            } catch (error) {
                if (error instanceof AxiosError) {
                    const data = error.response?.data;
                    const mutationError = new Error(data?.message ?? error.message);
                    (mutationError as any).errors = data?.errors ?? {};
                    throw mutationError;
                }

                throw error;
            }
        },
        ...options,
    });
}
