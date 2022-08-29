import { Inject, Injectable } from '@nestjs/common';
import { ExportServiceInterface } from './interface/export.service.interface';
import { Alignment, Borders, Font, Workbook } from 'exceljs';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import {
  EXCEL_STYLE,
  MAX_NUMBER_PAGE,
  ROW,
  SHEET,
  TypeEnum,
} from './export.constant';
import { CompanyRepositoryInterface } from '@components/company/interface/company.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { isEmpty, keyBy, map, uniq } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ExportRequestDto } from './dto/request/export.request.dto';
import { GetListCompanyRequestDto } from '@components/company/dto/request/get-list-company.request.dto';
import { FactoryRepositoryInterface } from '@components/factory/interface/factory.repository.interface';
import { GetListFactoryRequestDto } from '@components/factory/dto/request/get-list-factory.request.dto';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { WarehouseServiceInterface } from '@components/warehouse/interface/warehouse.service.interface';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { MmsServiceInterface } from '@components/mms/interface/mms.service.interface';

@Injectable()
export class ExportService implements ExportServiceInterface {
  constructor(
    @Inject('CompanyRepositoryInterface')
    private readonly companyRepository: CompanyRepositoryInterface,

    @Inject('FactoryRepositoryInterface')
    private readonly factoryRepository: FactoryRepositoryInterface,

    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseService: WarehouseServiceInterface,

    @Inject('MmsServiceInterface')
    private readonly mmsService: MmsServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async export(request: ExportRequestDto): Promise<any> {
    const { ids, type } = request;

    if (!isEmpty(ids) && ids.length > ROW.LIMIT_EXPORT) {
      return new ResponseBuilder()
        .withMessage(
          await this.i18n.translate('error.LIMIT_EXPORT_ONE_SHEET_ERROR'),
        )
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build();
    }

    let workbook;
    switch (type) {
      case TypeEnum.COMPANY:
        workbook = await this.exportCompanies(request);
        break;
      case TypeEnum.FACTORY:
        workbook = await this.exportFactories(request);
        break;
      case TypeEnum.USER:
        workbook = await this.exportUserManagement(request);
      default:
        break;
    }
    if (workbook?.xlsx) {
      // await workbook?.xlsx.writeFile('export.xlsx');
      const file = await workbook.xlsx.writeBuffer();

      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(file)
        .build();
    } else {
      return workbook;
    }
  }

  async exportCompanies(payload: any) {
    let users: any;
    let companies: any[] = [];
    let page: any = 1;
    const count = await this.companyRepository.getCount();
    const totalRecord =
      count.cnt > ROW.LIMIT_EXPORT ? ROW.LIMIT_EXPORT : count.cnt;
    page = Math.ceil(totalRecord / ROW.LIMIT_EXPORT_ON_SHEET);
    if (page < MAX_NUMBER_PAGE) {
      page = 10;
    }

    for (let i = 1; i <= page; i++) {
      const request = new GetListCompanyRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      if (payload.queryIds) {
        request.ids = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.filter = payload.filter;
      request.sort = payload.sort;
      const list = await this.companyRepository.getList(request);
      companies = companies.concat(list.result);
      if (list.result < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (isEmpty(companies)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const userIds = uniq(map(companies, 'createdBy'));

    if (!isEmpty(userIds)) {
      users = await this.userService.getListByIds({ userIds });
    }
    const userMap = keyBy(users.data, 'id');
    const data = companies.map((company) => {
      return {
        code: company.code || '',
        name: company.name || '',
        address: company.address || '',
        phone: company.phone || '',
        taxNo: company.taxNo || '',
        email: company.email || '',
        fax: company.fax || '',
        description: company.description || '',
        createdBy: userMap[company.createdBy]?.fullname || '',
        createdAt: company.createdAt || '',
      };
    });

    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.company.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.company.name'),
      },
      {
        key: 'address',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.company.address'),
      },
      {
        key: 'phone',
        width: 15,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.common.phone'),
      },
      {
        key: 'taxNo',
        width: 15,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.company.taxNo'),
      },
      {
        key: 'email',
        width: 20,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.email'),
      },
      {
        key: 'fax',
        width: 15,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.company.fax'),
      },
      {
        key: 'description',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.description'),
      },
      {
        key: 'createdBy',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.createdBy'),
      },
      {
        key: 'createdAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.createdAt'),
      },
    ];

    const workbook = await this.exportOneSheetUtil(
      data,
      [await this.i18n.translate('export.company.title')],
      headers,
    );
    return workbook;
  }

  async exportFactories(payload: any) {
    let users: any;
    let companies: any;
    let regions: any;
    let factories: any[] = [];
    let page: any = 1;
    const count = await this.companyRepository.getCount();
    const totalRecord =
      count.cnt > ROW.LIMIT_EXPORT ? ROW.LIMIT_EXPORT : count.cnt;
    page = Math.ceil(totalRecord / ROW.LIMIT_EXPORT_ON_SHEET);

    if (page > MAX_NUMBER_PAGE) {
      page = 10;
    }

    for (let i = 1; i <= page; i++) {
      const request = new GetListFactoryRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      if (payload.queryIds) {
        request.ids = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.filter = payload.filter;
      request.sort = payload.sort;
      const list = await this.factoryRepository.getList(request);

      factories = factories.concat(list.result);
      if (list.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (isEmpty(factories)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const userIds = uniq(map(factories, 'createdBy'));
    if (!isEmpty(userIds)) {
      users = await this.userService.getListByIds({ userIds });
    }
    const userMap = keyBy(users.data, 'id');
    const companyIds = uniq(map(factories, 'companyId'));
    if (!isEmpty(companyIds)) {
      companies = await this.userService.getCompaniesByIds(companyIds);
    }
    const companyMap = keyBy(companies.data, 'id');

    const regionIds = uniq(map(factories, 'regionId'));
    if (!isEmpty(regionIds)) {
      regions = await this.mmsService.listRegion({ codes: regionIds });
    }
    const regionMap = keyBy(regions, 'id');

    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.factory.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.factory.name'),
      },
      {
        key: 'companyName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.factory.companyName'),
      },
      {
        key: 'regionName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.factory.regionName'),
      },
      {
        key: 'interRegionName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.factory.interRegionName'),
      },
      {
        key: 'location',
        width: 15,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.factory.location'),
      },
      {
        key: 'phone',
        width: 15,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.common.phone'),
      },
      {
        key: 'description',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.description'),
      },
      {
        key: 'createdBy',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.createdBy'),
      },
      {
        key: 'createdAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.createdAt'),
      },
    ];
    const data = factories?.map((factory) => {
      return {
        code: factory.code || '',
        name: factory.name || '',
        companyName: companyMap[factory.companyId]?.name || '',
        regionName: regionMap[factory.regionId]?.name || '',
        interRegionName: regionMap[factory.regionId]?.interRegion?.name || '',
        location: factory.location || '',
        phone: factory.phone || '',
        description: factory.description || '',
        createdBy: userMap[factory.createdBy]?.fullname || '',
        createdAt: factory.createdAt || '',
      };
    });
    const workbook = await this.exportOneSheetUtil(
      data,
      [await this.i18n.translate('export.factory.title')],
      headers,
    );
    return workbook;
  }

  async exportUserManagement(payload: any) {
    let users: any[] = [];
    let page: any = 1;
    let listUser;

    const count = await this.userRepository.getCount();
    const totalRecord =
      count.cnt > ROW.LIMIT_EXPORT ? ROW.LIMIT_EXPORT : count.cnt;
    page = Math.ceil(totalRecord / ROW.LIMIT_EXPORT_ON_SHEET);
    if (page > MAX_NUMBER_PAGE) {
      page = 10;
    }
    for (let i = 1; i <= page; i++) {
      const request = new GetListUserRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      if (payload.queryIds) {
        request.ids = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.filter = payload.filter;
      request.sort = payload.sort;
      const list = await this.userRepository.getListUser(request);
      if (!isEmpty(list.data)) {
        users = users.concat(list?.data);
      }

      if (list.data < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (isEmpty(users)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const userIds = uniq(map(users, 'createdBy'));
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.createdBy && !userIds.includes(user.createdBy))
        userIds.push(user.createdBy);
    }

    if (!isEmpty(userIds)) {
      listUser = await this.userService.getListByIds({ userIds: userIds });
    }
    const userMap = keyBy(listUser.data, 'id');
    const companyIds = uniq(map(users, 'companyId'));
    const companies = await this.userService.getCompaniesByIds(companyIds);
    const companyMap = keyBy(companies.data, 'id');
    const data = users.map((user) => {
      return {
        username: user.username || '',
        fullName: user.fullName || '',
        code: user.code || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        email: user.email || '',
        companyName: companyMap[user.companyId]?.name || '',
        departmentName: map(user.departmentSettings, 'name').join(', ') || '',
        factoryName: map(user.factories, 'name').join(', '),
        role: map(user.userRoleSettings, 'name').join(', ') || '',
        nameWarehouse: map(user.userWarehouses, 'id').join(', ') || '',
        status: user.status || '',
        createdBy: userMap[user.createdBy]?.username || '',
        createdAt: user.createdAt || '',
      };
    });
    const headers = [
      {
        key: 'username',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.user.username'),
      },
      {
        key: 'fullName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.user.fullname'),
      },
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.user.code'),
      },
      {
        key: 'phone',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.phone'),
      },
      {
        key: 'dateOfBirth',
        width: 30,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.user.dateOfBirth'),
      },
      {
        key: 'email',
        width: 30,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.common.email'),
      },
      {
        key: 'companyName',
        width: 20,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.company.name'),
      },
      {
        key: 'departmentName',
        width: 30,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
        },
        title: await this.i18n.translate('export.user.departmentName'),
      },
      {
        key: 'factoryName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.factory.name'),
      },
      {
        key: 'role',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.user.role'),
      },
      {
        key: 'nameWarehouse',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.user.warehouse.name'),
      },
      {
        key: 'status',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.user.status'),
      },
      {
        key: 'createdBy',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.common.createdBy'),
      },
      {
        key: 'createdAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.createdAt'),
      },
    ];

    const workbook = await this.exportOneSheetUtil(
      data,
      [await this.i18n.translate('export.user.title')],
      headers,
    );
    return workbook;
  }

  async exportOneSheetUtil(data: any[], title: any, headers: any) {
    const workbook = new Workbook();
    let countRowData = ROW.COUNT_START_ROW;
    let countSheet = SHEET.START_SHEET;
    data.forEach((element) => {
      let worksheet = workbook.getWorksheet(SHEET.NAME + countSheet);
      if (countRowData == ROW.COUNT_START_ROW) {
        worksheet = workbook.addWorksheet(SHEET.NAME + countSheet);

        const titleRow = worksheet.getRow(1);
        titleRow.values = title;
        titleRow.font = <Font>EXCEL_STYLE.TITLE_FONT;

        const headerRow = worksheet.getRow(3);
        headerRow.values = headers.map((header) => header.title);
        headerRow.eachCell(function (cell) {
          cell.font = <Font>EXCEL_STYLE.TITLE_FONT;
          cell.alignment = <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER;
          cell.border = <Partial<Borders>>EXCEL_STYLE.BORDER_ALL;
        });
      }
      worksheet.columns = headers;
      worksheet
        .addRow({
          ...element,
        })
        .eachCell(function (cell) {
          cell.border = <Partial<Borders>>EXCEL_STYLE.BORDER_ALL;
          cell.font = <Font>EXCEL_STYLE.DEFAULT_FONT;
        });

      countRowData++;
      if (countRowData == ROW.COUNT_END_ROW) {
        countSheet++;
        countRowData = ROW.COUNT_START_ROW;
      }
    });
    return workbook;
  }

  async exportMultiSheetUtil(
    workbook: Workbook,
    items: any[],
    level: any,
    titleMap: any,
    headersMap: any,
  ) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let worksheet = workbook.getWorksheet(SHEET.NAME + level);
      if (!worksheet) {
        worksheet = workbook.addWorksheet(SHEET.NAME + level);

        const titleRow = worksheet.getRow(1);
        titleRow.values = titleMap.get(level);
        titleRow.font = <Font>EXCEL_STYLE.TITLE_FONT;

        const headerRow = worksheet.getRow(3);
        headerRow.values = headersMap.get(level).map((header) => header.title);
        headerRow.eachCell(function (cell) {
          cell.font = <Font>EXCEL_STYLE.TITLE_FONT;
          cell.alignment = <Partial<Alignment>>EXCEL_STYLE.ALIGN_CENTER;
          cell.border = <Partial<Borders>>EXCEL_STYLE.BORDER_ALL;
        });
        worksheet.columns = headersMap.get(level);
      }

      worksheet
        .addRow({
          ...item,
        })
        .eachCell(function (cell) {
          cell.border = <Partial<Borders>>EXCEL_STYLE.BORDER_ALL;
          cell.font = <Font>EXCEL_STYLE.DEFAULT_FONT;
        });
      if (item.subItem?.length > 0) {
        workbook = await this.exportMultiSheetUtil(
          workbook,
          item.subItem,
          level + 1,
          titleMap,
          headersMap,
        );
      }
    }

    return workbook;
  }

  // async exportTemplateUtil(
  //   data: any[],
  //   title: any,
  //   headerTitles: any,
  //   headers: any,
  // ) {
  //   const workbook = new Workbook();
  //   await workbook.xlsx.readFile('static/template/export/company.xlsx');

  //   let countRowData = ROW.countStartRow;
  //   let countSheet = SHEET.startSheet;

  //   data.forEach((element, index) => {
  //     if (countRowData == ROW.countStartRow && index > 0) {
  //       workbook.addWorksheet(SHEET.name + countSheet).model =
  //         workbook.getWorksheet(SHEET.name + SHEET.startSheet).model;
  //     }

  //     workbook.getWorksheet(SHEET.name + countSheet).addRow({
  //       ...element,
  //     });

  //     countRowData++;
  //     if (countRowData == ROW.countEndRow) {
  //       countSheet++;
  //       countRowData = ROW.countStartRow;
  //     }
  //   });
  //   return workbook;
  // }
}
