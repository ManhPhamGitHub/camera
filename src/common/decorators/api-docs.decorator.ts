import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface ApiDocsType {
  tag?: string;
  isBearerAuth?: boolean;
}

export function ApiDocs(configs: ApiDocsType) {
  const decorators = [];
  if (configs.isBearerAuth) {
    decorators.push(ApiBearerAuth());
  }
  if (configs.tag) {
    decorators.push(ApiTags(configs.tag));
  }
  return applyDecorators(...decorators);
}
