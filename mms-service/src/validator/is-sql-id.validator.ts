import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_SQL_ID = 'isSqlId';

export function isSqlId(val: unknown): boolean {
  return typeof val === 'number' && Number.isInteger(val) && val > 0;
}

export function IsSqlId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_SQL_ID,
      validator: {
        validate: (value, args): boolean => isSqlId(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a valid SQL ID',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
