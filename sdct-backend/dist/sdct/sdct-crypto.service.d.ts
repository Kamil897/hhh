export declare class SdctCryptoService {
    private readonly key;
    constructor();
    encrypt(plain: string): string;
    decrypt(payload: string): string;
    private deriveKey;
}
