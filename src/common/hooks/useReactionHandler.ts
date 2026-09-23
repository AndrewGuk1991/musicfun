import { CurrentUserReaction } from "@/common/enums";
import type {CurrentUserReactionValue} from "@/common/types";


type ReactionMutations = {
    like: (id: string) => { unwrap: () => Promise<any> };
    dislike: (id: string) => { unwrap: () => Promise<any> };
    removeReaction: (id: string) => { unwrap: () => Promise<any> };
};

export const useReactionHandler = (
    targetId: string,
    currentReaction: CurrentUserReactionValue, // Используем обновленный тип данных
    mutations: ReactionMutations
) => {
    const handleLikeClick = async () => {
        try {
            if (currentReaction === CurrentUserReaction.Like) {
                await mutations.removeReaction(targetId).unwrap();
            } else {
                await mutations.like(targetId).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle like reaction status:", error);
        }
    };

    const handleDislikeClick = async () => {
        try {
            if (currentReaction === CurrentUserReaction.Dislike) {
                await mutations.removeReaction(targetId).unwrap();
            } else {
                await mutations.dislike(targetId).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle dislike reaction status:", error);
        }
    };

    return { handleLikeClick, handleDislikeClick };
};
