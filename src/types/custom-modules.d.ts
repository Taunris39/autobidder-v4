// src/types/custom-modules.d.ts
declare module "mailparser" {
    export interface Attachment {
        content: Buffer | Uint8Array | string;
        filename?: string;
        contentType?: string;
        contentDisposition?: string;
        cid?: string;
    }

    export interface ParsedMail {
        subject?: string;
        text?: string;
        html?: string;
        from?: any;
        to?: any;
        attachments?: Attachment[];
        messageId?: string;
        date?: Date;
    }

    export function simpleParser(input: Buffer | string | NodeJS.ReadableStream): Promise<ParsedMail>;
    export default { simpleParser };
}
