import { Module } from '@nestjs/common';
import UtilModule from 'src/util/util.module';

@Module({ imports: [UtilModule] })
export class RndModule {}
