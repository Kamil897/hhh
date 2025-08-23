import { Module } from '@nestjs/common';
import { SdctCryptoService } from './sdct-crypto.service';

@Module({
  providers: [SdctCryptoService],
  exports: [SdctCryptoService],
})
export class SdctModule {}