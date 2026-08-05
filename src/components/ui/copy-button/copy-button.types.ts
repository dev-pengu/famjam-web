export interface CopyButtonProps {
    children: React.ReactNode;
    testID?: string;
    className?: string;
    ariaLabel?: string;
    /** How long the 'copied' stated is shown in ms */
    copiedDuration?: number;
    onCopy?: (text: string) => void;
}