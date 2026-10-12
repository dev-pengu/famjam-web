import type { Chore } from "@/types/api"

export type ChoreListProps = {
    listTitle: string;
    chores: Chore[];
    familyId: string;
}