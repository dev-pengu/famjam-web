export type ClaimManagedFormProps = {
    familyId: string;
    dependentId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}