import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from './complaint.entity';
import { SdctCryptoService } from '../sdct/sdct-crypto.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint) private readonly repo: Repository<Complaint>,
    private readonly crypto: SdctCryptoService,
  ) {}

  async create(authorId: string, category: string, text: string) {
    const c = this.repo.create({ author: { id: authorId } as any, category, text: this.crypto.encrypt(text), status: 'open' });
    return this.repo.save(c);
  }

  async list(status?: ComplaintStatus) {
    const items = await this.repo.find({ where: status ? { status } : {}, order: { createdAt: 'DESC' }, relations: ['author'] });
    return items.map((c) => ({ ...c, text: this.crypto.decrypt(c.text) } as any));
  }

  updateStatus(id: string, status: ComplaintStatus) {
    return this.repo.update({ id }, { status });
  }
}