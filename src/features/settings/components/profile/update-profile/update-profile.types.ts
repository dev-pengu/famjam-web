import type { Person } from "@/types/api";

export type UpdateProfileProps = {
    onSuccess?: () => void;
    onCancel?: () => void;
    person: Person;
}