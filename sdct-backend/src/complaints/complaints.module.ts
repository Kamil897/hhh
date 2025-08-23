import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './complaint.entity';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { SdctModule } from '../sdct/sdct.module';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), SdctModule],
  providers: [ComplaintsService],
  controllers: [ComplaintsController],
})
export class ComplaintsModule {}