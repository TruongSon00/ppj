import { SupplyGroupServiceInterface } from '@components/supply-group/interface/supply-group.service.interface';
import { AttributeTypeServiceInterface } from './../attribute-type/interface/attribute-type.service.interface';
import { SupplyServiceInterface } from './../supply/interface/supply.service.interface';
import { InstallationTemplateServiceInterface } from './../installation-template/interface/installation-template.service.interface';
import { TypeEnum } from '@components/export/export.constant';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { Workbook } from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ImportExcelRequest } from './dto/import-excel.request';
import { ImportExcelServiceInterface } from './interface/import-excel.service.interface';
import { uniq, isEmpty, compact, isNull, isUndefined, has } from 'lodash';
import {
  TEMPLATE_DEVICE_GROUP,
  TEMPLATE_DEFECTS,
  DefectPriority,
  TEMPLATE_MAINTENANCE_ATTRIBUTE,
  TEMPLATE_ATTRIBUTE_TYPE,
  TEMPLATE_SUPPLY,
  TEMPLATE_CHECK_LIST,
  TEMPLATE_CHECK_LIST_DETAIL,
  TEMPLATE_INSTALLATION,
  TEMPLATE_INSTALLATION_DETAIL,
  TEMPLATE_UNIT,
  TEMPLATE_INTER_REGION,
  TEMPLATE_REGION,
  MAINTENANCE_TEAM,
  TEMPLATE_AREA,
  TEMPLATE_ERROR_TYPE,
  TEMPLATE_VENDOR,
} from './import-excel.constant';
import { getDataDuplicate } from '@utils/common';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { DeviceGroupServiceInterface } from '@components/device-group/interface/device-group.service.interface';
import { DefectServiceInterface } from '@components/defect/interface/defect.service.interface';
import { MaintenanceAttributeServiceInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.service.interface';
import { CheckListTemplateServiceInterface } from '@components/checklist-template/interface/checklist-template.service.interface';
import { UnitServiceInterface } from '@components/unit/interface/unit.service.interface';
import { InterRegionServiceInterface } from '@components/inter-region/interface/inter-region.service.interface';
import { RegionServiceInterface } from '@components/region/interface/region.service.interface';
import { MaintenanceTeamServiceInterface } from '@components/maintenance-team/interface/maintenance-team.service.interface';
import { AreaServiceInterface } from '@components/area/interface/area.service.interface';
import { ErrorTypeServiceInterface } from '@components/error-type/interface/error-type.service.interface';
import { VendorServiceInterface } from '@components/vendor/interface/vendor.service.interface';

@Injectable()
export class ImportExcelService implements ImportExcelServiceInterface {
  constructor(
    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('MaintenanceTeamServiceInterface')
    private readonly maintenanceTeamService: MaintenanceTeamServiceInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('MaintenanceAttributeServiceInterface')
    private readonly maintenanceAttributeService: MaintenanceAttributeServiceInterface,

    @Inject('AttributeTypeServiceInterface')
    private readonly attributeTypeService: AttributeTypeServiceInterface,

    @Inject('SupplyServiceInterface')
    private readonly supplyService: SupplyServiceInterface,

    @Inject('CheckListTemplateServiceInterface')
    private readonly checkListTemplateService: CheckListTemplateServiceInterface,

    @Inject('DeviceGroupServiceInterface')
    private readonly deviceGroupService: DeviceGroupServiceInterface,

    @Inject('SupplyGroupServiceInterface')
    private readonly supplyGroupService: SupplyGroupServiceInterface,

    @Inject('DefectServiceInterface')
    private readonly defectService: DefectServiceInterface,

    @Inject('InstallationTemplateServiceInterface')
    private readonly installationTemplateService: InstallationTemplateServiceInterface,

    @Inject('UnitServiceInterface')
    private readonly unitService: UnitServiceInterface,

    @Inject('InterRegionServiceInterface')
    private readonly interRegionService: InterRegionServiceInterface,

    @Inject('RegionServiceInterface')
    private readonly regionService: RegionServiceInterface,

    @Inject('AreaServiceInterface')
    private readonly areaService: AreaServiceInterface,

    @Inject('ErrorTypeServiceInterface')
    private readonly errorTypeService: ErrorTypeServiceInterface,

    @Inject('VendorServiceInterface')
    private readonly vendorService: VendorServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async import(request: ImportExcelRequest): Promise<any> {
    const { type, files } = request;

    const workbook = new Workbook();
    await workbook.xlsx.load(Buffer.from(files[0].data));
    switch (type) {
      case TypeEnum.DEVICE_GROUP:
        return await this.importDeviceGroups(workbook, request?.user?.id);
      case TypeEnum.SUPPLY_GROUP:
        return await this.importSupplyGroups(workbook, request?.user?.id);
      case TypeEnum.DEFECTS:
        return await this.importDefects(workbook, request?.user?.id);
      case TypeEnum.MAINTENANCE_ATTRIBUTE:
        return await this.importMaintenanceAttributes(
          workbook,
          request?.user?.id,
        );
      case TypeEnum.ATTRIBUTE_TYPE:
        return await this.importAttributeType(workbook);
      case TypeEnum.SUPPLY:
        return await this.importSupplies(workbook, request?.user?.id);
      case TypeEnum.CHECKLIST_TEMPLATE:
        return await this.importCheckListTemplates(workbook, request?.user?.id);
      case TypeEnum.INSTALLATION_TEMPLATE:
        return await this.importInstallationTemplates(workbook);
      case TypeEnum.UNIT:
        return await this.importUnits(workbook, request?.user?.id);
      case TypeEnum.INTER_REGION:
        return await this.importInterRegions(workbook, request?.user?.id);
      case TypeEnum.REGION:
        return await this.importRegions(workbook, request?.user?.id);
      case TypeEnum.MAINTENANCE_TEAM:
        return await this.importMaintenanceTeam(workbook, request?.user?.id);
      case TypeEnum.AREA:
        return await this.importAreas(workbook, request?.user?.id);
      case TypeEnum.ERROR_TYPE:
        return await this.importErrorTypes(workbook, request?.user?.id);
      case TypeEnum.VENDOR:
        return await this.importVendor(workbook, request?.user?.id);
      default:
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .build();
    }
  }

  private async importDeviceGroups(
    workbook: any,
    userId: number,
  ): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.deviceGroup.code'),
      name: await this.i18n.translate('import.deviceGroup.name'),
      description: await this.i18n.translate('import.deviceGroup.description'),
      assign: await this.i18n.translate('import.deviceGroup.assign'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_DEVICE_GROUP,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.deviceGroupService.createMany(
      data,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importSupplyGroups(
    workbook: any,
    userId: number,
  ): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.supplyGroup.code'),
      name: await this.i18n.translate('import.supplyGroup.name'),
      description: await this.i18n.translate('import.supplyGroup.description'),
      assign: await this.i18n.translate('import.supplyGroup.assign'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_DEVICE_GROUP,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.supplyGroupService.createMany(
      data,
      userId,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importDefects(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.defects.code'),
      name: await this.i18n.translate('import.defects.name'),
      description: await this.i18n.translate('import.defects.description'),
      deviceCode: await this.i18n.translate('import.defects.deviceCode'),
      priorityStr: await this.i18n.translate('import.defects.priorityStr'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_DEFECTS,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    for (const key in data) {
      data[key].priority = DefectPriority[data[key].priorityStr] ?? 1;
    }

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.defectService.createMany(
      data,
      userId,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importMaintenanceAttributes(
    workbook: any,
    userId: number,
  ): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.maintenanceAttribute.code'),
      name: await this.i18n.translate('import.maintenanceAttribute.name'),
      description: await this.i18n.translate(
        'import.maintenanceAttribute.description',
      ),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_MAINTENANCE_ATTRIBUTE,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } =
      await this.maintenanceAttributeService.createMany(data, userId);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importAttributeType(workbook: any): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.attributeType.code'),
      name: await this.i18n.translate('import.attributeType.name'),
      description: await this.i18n.translate(
        'import.attributeType.description',
      ),
      unitCode: await this.i18n.translate('import.attributeType.unitCode'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_ATTRIBUTE_TYPE,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.attributeTypeService.import(
      data,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importSupplies(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.supply.code'),
      name: await this.i18n.translate('import.supply.name'),
      supplyGroupCode: await this.i18n.translate(
        'import.supply.supplyGroupCode',
      ),
      type: await this.i18n.translate('import.supply.type'),
      unitCode: await this.i18n.translate('import.supply.unitCode'),
      price: await this.i18n.translate('import.supply.price'),
      description: await this.i18n.translate('import.supply.description'),
      assign: await this.i18n.translate('import.supply.assign'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_SUPPLY,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.supplyService.createMany(
      data,
      userId,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importCheckListTemplates(
    workbook: any,
    userId: number,
  ): Promise<any> {
    const headerCheckListTemplate = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.checkListTemplate.code'),
      name: await this.i18n.translate('import.checkListTemplate.name'),
      description: await this.i18n.translate(
        'import.checkListTemplate.description',
      ),
      checkType: await this.i18n.translate(
        'import.checkListTemplate.checkType',
      ),
    };

    const headerCheckListDetail = {
      templateCode: await this.i18n.translate('import.checkListTemplate.code'),
      title: await this.i18n.translate('import.checkListTemplate.detail.title'),
      description: await this.i18n.translate(
        'import.checkListTemplate.detail.description',
      ),
      obligatoryStr: await this.i18n.translate(
        'import.checkListTemplate.detail.obligatory',
      ),
    };

    const [dataCheckList, resultErrorCheckList] = await this.handleWorkbook(
      workbook,
      TEMPLATE_CHECK_LIST,
      headerCheckListTemplate,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    const [dataDetail, resultErrorDetail] = await this.handleWorkbook(
      workbook,
      TEMPLATE_CHECK_LIST_DETAIL,
      headerCheckListDetail,
      await this.i18n.translate('import.sheetName.Sheet2'),
    );

    if (
      dataCheckList[0]?.statusCode === ResponseCodeEnum.NOT_FOUND ||
      dataDetail[0]?.statusCode === ResponseCodeEnum.NOT_FOUND
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(dataCheckList[0]?.message || dataDetail[0]?.message)
        .build();
    }

    const textObligatoryYes = await this.i18n.translate(
      'import.obligatory.yes',
    );

    const detailMapByCode = dataDetail.reduce((preMap, detail) => {
      detail.obligatory = detail.obligatoryStr === textObligatoryYes ? 1 : 0;

      preMap[detail.templateCode] = has(preMap, detail.templateCode)
        ? preMap[detail.templateCode].concat(detail)
        : [detail];
      return preMap;
    }, {});
    dataCheckList.forEach((checkList, index) => {
      dataCheckList[index].details = detailMapByCode[checkList.code] ?? [];
    });

    const { dataError, dataSuccess } =
      await this.checkListTemplateService.createMany(dataCheckList, userId);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultErrorCheckList, ...resultErrorDetail, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importInstallationTemplates(workbook: any): Promise<any> {
    const headerInstallationTemplate = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.installationTemplate.code'),
      name: await this.i18n.translate('import.installationTemplate.name'),
      description: await this.i18n.translate(
        'import.installationTemplate.description',
      ),
    };

    const headerInstallationDetail = {
      templateCode: await this.i18n.translate(
        'import.installationTemplate.code',
      ),
      title: await this.i18n.translate(
        'import.installationTemplate.detail.title',
      ),
      description: await this.i18n.translate(
        'import.installationTemplate.detail.description',
      ),
      obligatoryStr: await this.i18n.translate(
        'import.installationTemplate.detail.obligatory',
      ),
    };

    const [dataInstallation, resultErrorInstallation] =
      await this.handleWorkbook(
        workbook,
        TEMPLATE_INSTALLATION,
        headerInstallationTemplate,
        await this.i18n.translate('import.sheetName.Sheet1'),
      );

    const [dataDetail, resultErrorDetail] = await this.handleWorkbook(
      workbook,
      TEMPLATE_INSTALLATION_DETAIL,
      headerInstallationDetail,
      await this.i18n.translate('import.sheetName.Sheet2'),
    );

    if (
      dataInstallation[0]?.statusCode === ResponseCodeEnum.NOT_FOUND ||
      dataDetail[0]?.statusCode === ResponseCodeEnum.NOT_FOUND
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(dataInstallation[0]?.message || dataDetail[0]?.message)
        .build();
    }

    const textObligatoryYes = await this.i18n.translate(
      'import.obligatory.yes',
    );

    const detailMapByCode = dataDetail.reduce((preMap, detail) => {
      detail.isRequire = detail.obligatoryStr === textObligatoryYes;

      preMap[detail.templateCode] = has(preMap, detail.templateCode)
        ? preMap[detail.templateCode].concat(detail)
        : [detail];
      return preMap;
    }, {});
    dataInstallation.forEach((installation, index) => {
      dataInstallation[index].details =
        detailMapByCode[installation.code] ?? [];
    });

    const { dataError, dataSuccess } =
      await this.installationTemplateService.createMany(dataInstallation);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [
        ...resultErrorInstallation,
        ...resultErrorDetail,
        ...dataError,
      ],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importMaintenanceTeam(
    workbook: any,
    userId: number,
  ): Promise<any> {
    const headerMaintenanceTeam = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.maintenanceTeam.code'),
      name: await this.i18n.translate('import.maintenanceTeam.name'),
      description: await this.i18n.translate(
        'import.maintenanceTeam.description',
      ),
      member: await this.i18n.translate('import.maintenanceTeam.member'),
      role: await this.i18n.translate('import.maintenanceTeam.role'),
      type: await this.i18n.translate('import.maintenanceTeam.type'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      MAINTENANCE_TEAM,
      headerMaintenanceTeam,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } =
      await this.maintenanceTeamService.createMany(data);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async handleWorkbook(
    workbook: any,
    template: any,
    header: any,
    sheetName: any,
  ) {
    const sizeHeader = Object.keys(header).length;
    const templateMap = new Map(
      Object.keys(template).map((key) => [key, template[key]]),
    );
    const templateKeyMap = new Map(
      Object.keys(template).map((key, index) => [index, key]),
    );
    const worksheet = workbook.getWorksheet(sheetName);
    return await this.getDataWorksheet(
      worksheet,
      templateMap,
      templateKeyMap,
      sizeHeader,
      header,
    );
  }

  private async getDataWorksheet(
    worksheet,
    templateMap,
    templateKeyMap,
    sizeHeader,
    header,
  ) {
    const data: any[] = [];
    const dataError: any[] = [];
    let isData = false;
    for (let i = 0; i <= worksheet?.rowCount; i++) {
      const row = worksheet.getRow(i);

      if (isData) {
        const obj: any = {};
        let error = '';
        obj['line'] = i;
        for (let j = 0; j < row.cellCount; j++) {
          const cell = row.getCell(j + 1);

          obj[templateKeyMap.get(j)] = cell.value;

          error = await this.validateDataCell(
            header,
            templateMap.get(templateKeyMap.get(j)),
            cell.value,
          );
          if (!isEmpty(error)) {
            break;
          }
        }
        if (!isEmpty(error)) {
          dataError[i] = error;
          error = '';
        } else {
          data.push(obj);
        }
      }

      if (row.cellCount === sizeHeader && !isData) {
        isData = true;
        for (let j = 0; j < row.cellCount; j++) {
          const cell = row.getCell(j + 1);

          if (header[templateKeyMap.get(j)] !== cell.value) {
            return [
              [
                {
                  statusCode: ResponseCodeEnum.NOT_FOUND,
                  message: await this.i18n.translate(
                    'error.HEADER_TEMPLATE_ERROR',
                  ),
                },
              ],
              [],
            ];
          }
        }
      }
    }
    return await this.validateDataUniqueCode(data, dataError);
  }

  async validateDataCell(header, template, value) {
    let error: any = '';
    // check not null
    if (template.notNull) {
      error =
        !isNull(value) || !isUndefined(value)
          ? error
          : await this.i18n.translate('import.error.notNull', {
              args: {
                value: header[template.key],
              },
            });
    }

    // check key
    if (
      template.key === TEMPLATE_DEVICE_GROUP.action.key &&
      !(
        value === (await this.i18n.translate('import.common.add')) ||
        value === (await this.i18n.translate('import.common.edit'))
      )
    ) {
      error = this.i18n.translate('import.error.acction');
    }

    // check string max length
    if (template.maxLength && template.type === 'string') {
      error =
        value && (value?.trim()?.length ?? 0) > template.maxLength
          ? await this.i18n.translate('import.error.maxLength', {
              args: {
                value: header[template.key],
                number: template.maxLength,
              },
            })
          : error;
    }

    return error;
  }

  async validateDataUniqueCode(data: any[], dataError: any[]) {
    const listCode = compact(
      data.map((i) => {
        return i?.code;
      }),
    );
    if (isEmpty(listCode)) return [data, dataError];
    let dataDuplicate = getDataDuplicate(listCode);
    dataDuplicate = uniq(dataDuplicate);
    if (dataDuplicate.length > 0) {
      const newData: any[] = [];
      const newDataError: any[] = [...dataError];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (dataDuplicate.includes(item.code)) {
          newDataError[item.line] = await this.i18n.translate(
            'import.error.duplicateCode',
            {
              args: {
                value: item.code,
              },
            },
          );
        } else {
          newData.push(item);
        }
      }
      return [newData, newDataError];
    }

    return [data, dataError];
  }

  private async importUnits(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.unit.code'),
      name: await this.i18n.translate('import.unit.name'),
      description: await this.i18n.translate('import.unit.description'),
    };

    const [dataUnit, resultErrorUnit] = await this.handleWorkbook(
      workbook,
      TEMPLATE_UNIT,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (dataUnit[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(dataUnit[0]?.message || dataUnit[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.unitService.import(dataUnit);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultErrorUnit, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importInterRegions(
    workbook: any,
    userId: number,
  ): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.interRegion.code'),
      name: await this.i18n.translate('import.interRegion.name'),
      description: await this.i18n.translate('import.interRegion.description'),
    };

    const [dataInterRegion, resultErrorInterRegion] = await this.handleWorkbook(
      workbook,
      TEMPLATE_INTER_REGION,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (dataInterRegion[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(dataInterRegion[0]?.message || dataInterRegion[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.interRegionService.import(
      dataInterRegion,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultErrorInterRegion, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importRegions(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.region.code'),
      name: await this.i18n.translate('import.region.name'),
      description: await this.i18n.translate('import.region.description'),
      interRegionCode: await this.i18n.translate(
        'import.region.interRegionCode',
      ),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_REGION,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.regionService.import(data);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importAreas(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.area.code'),
      name: await this.i18n.translate('import.area.name'),
      description: await this.i18n.translate('import.area.description'),
      factoryCode: await this.i18n.translate('import.area.factoryCode'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_AREA,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.areaService.import(data);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importErrorTypes(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.errorType.code'),
      name: await this.i18n.translate('import.errorType.name'),
      description: await this.i18n.translate('import.errorType.description'),
      priority: await this.i18n.translate('import.errorType.priority'),
    };

    const [dataErrorType, resultErrorErrorType] = await this.handleWorkbook(
      workbook,
      TEMPLATE_ERROR_TYPE,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (dataErrorType[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(dataErrorType[0]?.message || dataErrorType[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.errorTypeService.import(
      dataErrorType,
    );

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultErrorErrorType, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async importVendor(workbook: any, userId: number): Promise<any> {
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.vendor.code'),
      name: await this.i18n.translate('import.vendor.name'),
      description: await this.i18n.translate('import.vendor.description'),
      address: await this.i18n.translate('import.vendor.address'),
      email: await this.i18n.translate('import.vendor.email'),
      phone: await this.i18n.translate('import.vendor.phone'),
      bank: await this.i18n.translate('import.vendor.bank'),
      contactUser: await this.i18n.translate('import.vendor.contactUser'),
    };

    const [data, resultError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_VENDOR,
      header,
      await this.i18n.translate('import.sheetName.Sheet1'),
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const { dataError, dataSuccess } = await this.vendorService.import(data);

    return new ResponseBuilder({
      dataSuccess,
      dataError: [...resultError, ...dataError],
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
