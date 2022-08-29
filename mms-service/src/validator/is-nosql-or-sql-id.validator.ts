import { Types } from 'mongoose';
import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { isSqlId } from './is-sql-id.validator';
import { ObjectIdLike } from 'bson';
import { isNoSqlId } from './is-nosql-id.validator';

export const IS_SQL_OR_NOSQL_ID = 'isSqlOrNoSqlId';

export function isSqlOrNoSqlId(
  val: number | string | Types.ObjectId | Uint8Array | ObjectIdLike,
): boolean {
  return isSqlId(val) || isNoSqlId(val);
}

export function IsSqlOrNoSqlId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_SQL_OR_NOSQL_ID,
      validator: {
        validate: (value, args): boolean => isSqlOrNoSqlId(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property must be a valid NoSQL or SQL ID',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
