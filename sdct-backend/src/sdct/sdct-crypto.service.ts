import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SdctCryptoService {
  private readonly key: Buffer;

  constructor() {
    const raw = process.env.SDCT_ENC_KEY || '';
    this.key = this.deriveKey(raw);
  }

  encrypt(plain: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(Buffer.from(plain, 'utf8')), cipher.final()]);
    const tag = cipher.getAuthTag();
    const payload = `SDCTv1:${iv.toString('base64')}:${ciphertext.toString('base64')}:${tag.toString('base64')}`;
    return payload;
  }

  decrypt(payload: string): string {
    if (!payload || !payload.startsWith('SDCTv1:')) {
      return payload;
    }
    const parts = payload.split(':');
    if (parts.length !== 4) return payload;
    const iv = Buffer.from(parts[1], 'base64');
    const data = Buffer.from(parts[2], 'base64');
    const tag = Buffer.from(parts[3], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(data), decipher.final()]);
    return plain.toString('utf8');
  }

  private deriveKey(secret: string): Buffer {
    if (!secret) {
      // Development fallback; in production require env to be set
      return crypto.createHash('sha256').update('sdct_dev_key').digest();
    }
    // Accept hex/base64/utf8
    try {
      if (/^[0-9a-fA-F]{64}$/.test(secret)) {
        return Buffer.from(secret, 'hex');
      }
      const b64 = Buffer.from(secret, 'base64');
      if (b64.length === 32) return b64;
    } catch {}
    return crypto.createHash('sha256').update(secret, 'utf8').digest();
  }
}