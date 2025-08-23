import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from './complaint.entity';

@Injectable()
export class ComplaintsService {
  constructor(@InjectRepository(Complaint) private readonly repo: Repository<Complaint>) {}

  create(authorId: string, category: string, text: string) {
    const c = this.repo.create({ author: { id: authorId } as any, category, text, status: 'open' });
    return this.repo.save(c);
  }

  list(status?: ComplaintStatus) {
    return this.repo.find({ where: status ? { status } : {}, order: { createdAt: 'DESC' }, relations: ['author'] });
  }

  updateStatus(id: string, status: ComplaintStatus) {
    return this.repo.update({ id }, { status });
  }
}