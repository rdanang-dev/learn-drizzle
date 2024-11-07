import { Global, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '../drizzle/drizzle.module';

const importedModule = [CqrsModule, DrizzleModule];
@Global()
@Module({
  imports: [...importedModule],
  exports: [],
})
export class SharedModule {}
