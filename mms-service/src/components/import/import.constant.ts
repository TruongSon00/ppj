export const IMPORT_ACTION_OPTION = {
  CREATE: 'create',
  UPDATE: 'update',
  IGNORE: 'ignore',
};

export const IMPORT_ACTION_CONST = {
  SECTION: 'action',
  JSON_KEY: 'header-csv.action.header',
  OPTION_KEYS: [
    IMPORT_ACTION_OPTION.CREATE,
    IMPORT_ACTION_OPTION.UPDATE,
    IMPORT_ACTION_OPTION.IGNORE,
  ],
  CELL_INDEX: 1,
  HEADER: 'header',
};

export const IMPORT_HEADER_CONST = {
  HEADER_ROW_INDEX: 1,
  DATA_ROW_START: 2,
};

export const JSON_KEY = {
  HEADER: 'header-csv',
  SAMPLE: 'import-sample',
};
