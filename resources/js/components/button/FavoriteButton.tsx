import {useQuery, useQueryClient} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {Star} from "lucide-react";
import api from "@/lib/api";
import {useMutationApi} from "@/hooks/use-mutation";
import {cn} from "@/lib/utils";

type ToggleFavoriteResponse = {
    utility_id: number,
    is_favorite: boolean,
}

const FAVORITE_IDS_KEY = ['favorites', 'ids'];

// null = user is not logged in
export function useFavoriteIds() {
    return useQuery<number[] | null>({
        queryKey: FAVORITE_IDS_KEY,
        queryFn: async () => {
            try {
                const response = await api.get<number[]>("/favorites/ids");
                return response.data;
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 401) return null;
                throw error;
            }
        },
        retry: false,
    });
}

export default function FavoriteButton({utilityId, className}: {utilityId: number, className?: string}) {
    const queryClient = useQueryClient();
    const {data: favoriteIds, isLoading} = useFavoriteIds();

    const isLoggedIn = favoriteIds !== null && favoriteIds !== undefined;
    const isFavorite = !!favoriteIds?.includes(utilityId);

    const {mutate, isPending} = useMutationApi<ToggleFavoriteResponse>({
        url: `/favorites/${utilityId}`,
        method: "POST",
        onSuccess: (data) => {
            queryClient.setQueryData<number[] | null>(FAVORITE_IDS_KEY, (ids) => {
                const withoutUtility = (ids ?? []).filter((id) => id !== data.utility_id);
                return data.is_favorite ? [...withoutUtility, data.utility_id] : withoutUtility;
            });
            queryClient.invalidateQueries({queryKey: ['favorites'], exact: true});
        },
    });

    const label = !isLoggedIn
        ? "Log in to save favorites"
        : isFavorite ? "Remove from favorites" : "Add to favorites";

    return (
        <button
            type="button"
            onClick={() => mutate(undefined)}
            disabled={isLoading || !isLoggedIn || isPending}
            title={label}
            aria-label={label}
            aria-pressed={isFavorite}
            className={cn(
                "cursor-pointer rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                isFavorite
                    ? "text-yellow-400 hover:bg-yellow-400/10"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-yellow-400",
                className
            )}
        >
            <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"}/>
        </button>
    );
}
