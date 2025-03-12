declare module "qrcode" {
    export function toDataURL(
        text: string,
        options?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H" },
        callback?: (error: unknown, url: string) => void
    ): void;
}
