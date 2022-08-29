import { GetListSupplyResponseDto } from './../supply/dto/response/get-list-supply.response.dto';
import { GetListMaintenanceAttributeRequestDto } from './../maintenance-attribute/dto/request/get-list-maintenance-attribute.request.dto';
import { GetListAttributeTypeQuery } from '@components/attribute-type/dto/request/get-list-attribute-type.query';
import { GetListDefectResponseDto } from './../defect/dto/response/get-list-defect.response.dto';
import { DefectRepositoryInterface } from '@components/defect/interface/defect.repository.interface';
import { GetListDefectRequestDto } from '@components/defect/dto/request/get-list-defect.request.dto';
import { GetListCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/get-list-checklist-template.request.dto';
import { CheckListTemplateRepositoryInterface } from '@components/checklist-template/interface/checklist-template.repository.interface';
import { AttributeTypeRepositoryInterface } from './../attribute-type/interface/attribute-type.repository.interface';
import { AttributeType } from 'src/models/attribute-type/attribute-type.model';
import { CreateMaintenanceAttributeResponseDto } from './../maintenance-attribute/dto/response/create-maintenance-attribute.response.dto';
import { MaintenanceAttributeRepositoryInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.repository.interface';
import { UserResponseDto } from './../user/dto/response/user.response.dto';
import { SupplyGroupRepositoryInterface } from '@components/supply-group/interface/supply-group.repository.interface';
import { GetListSupplyGroupRequestDto } from '@components/supply-group/dto/request/get-list-supply-group.request.dto';
import { SupplyRepositoryInterface } from './../supply/interface/supply.repository.interface';
import { GetListSupplyRequestDto } from './../supply/dto/request/get-list-supply.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { GetListInstallationTemplateQuery } from '@components/installation-template/dto/query/get-list-installation-template.query';
import { InstallationTemplateRepositoryInterface } from '@components/installation-template/interface/installation-template.repository';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { SaleServiceInterface } from '@components/sale/interface/sale.service.interface';
import { SupplyTypeConstant } from '@components/supply/supply.constant';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { Workbook, Font, Alignment, Borders } from 'exceljs';
import { isEmpty, keyBy, map, uniq, compact, first } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ExportRequestDto } from './dto/request/export.request.dto';
import {
  DefectPriorityExport,
  EXCEL_STYLE,
  MAX_NUMBER_PAGE,
  ROW,
  SHEET,
  TypeEnum,
} from './export.constant';
import { ExportServiceInterface } from './interface/export.service.interface';
import { MaintenanceTeam } from 'src/models/maintenance-team/maintenance-team.model';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { DeviceType } from '@components/device/device.constant';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';
import { GetListUnitQuery } from '@components/unit/dto/request/get-list-unit.query';
import { GetListInterRegionQuery } from '@components/inter-region/dto/request/get-list-inter-region.query';
import { InterRegionRepositoryInterface } from '@components/inter-region/interface/inter-region.repository.interface';
import { RegionRepositoryInterface } from '@components/region/interface/region.repository.interface';
import { GetListMaintenaceTeamRequestDto } from '@components/maintenance-team/dto/request/get-list-maintenace-team.request.dto';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { GetListRegionQuery } from '@components/region/dto/request/get-list-region.query';
import { AreaRepositoryInterface } from '@components/area/interface/area.repository.interface';
import { GetListAreaQuery } from '@components/area/dto/request/get-list-area.query';
import { ErrorTypeRepositoryInterface } from '@components/error-type/interface/error-type.repository.interface';
import { GetListErrorTypeQuery } from '@components/error-type/dto/request/get-list-error-type.query';
import { VendorRepositoryInterface } from '@components/vendor/interface/vendor.repository.interface';
import { GetListVendorRequestDto } from '@components/vendor/dto/request/get-list-vendor.request.dto';

@Injectable()
export class ExportService implements ExportServiceInterface {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('DefectRepositoryInterface')
    private readonly defectRepository: DefectRepositoryInterface,

    @Inject('AttributeTypeRepositoryInterface')
    private readonly attributeTypeRepository: AttributeTypeRepositoryInterface,

    @Inject('MaintenanceAttributeRepositoryInterface')
    private readonly maintenanceAttributeRepository: MaintenanceAttributeRepositoryInterface,

    @Inject('SupplyGroupRepositoryInterface')
    private readonly supplyGroupRepository: SupplyGroupRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('CheckListTemplateRepositoryInterface')
    private readonly checkListTemplateRepository: CheckListTemplateRepositoryInterface,

    @Inject('InstallationTemplateRepositoryInterface')
    private readonly installationTemplateRepository: InstallationTemplateRepositoryInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    @Inject('InterRegionRepositoryInterface')
    private readonly interRegionRepository: InterRegionRepositoryInterface,

    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,

    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('AreaRepositoryInterface')
    private readonly areaRepository: AreaRepositoryInterface,

    @Inject('ErrorTypeRepositoryInterface')
    private readonly errorTypeRepository: ErrorTypeRepositoryInterface,
    @Inject('VendorRepositoryInterface')
    private readonly vendorRepository: VendorRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}
  async export(request: ExportRequestDto): Promise<any> {
    const { queryIds, type } = request;

    if (!isEmpty(queryIds) && queryIds.length > ROW.LIMIT_EXPORT) {
      return new ResponseBuilder()
        .withMessage(
          await this.i18n.translate('error.LIMIT_EXPORT_ONE_SHEET_ERROR'),
        )
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build();
    }

    let workbook;
    switch (type) {
      case TypeEnum.DEVICE_GROUP:
        workbook = await this.exportDeviceGroup(request);
        break;
      case TypeEnum.DEFECTS:
        workbook = await this.exportDefects(request);
        break;
      case TypeEnum.CHECKLIST_TEMPLATE:
        workbook = await this.exportTemplateChecklist(request);
        break;
      case TypeEnum.INSTALLATION_TEMPLATE:
        workbook = await this.exportInstallationTemplate(request);
        break;
      case TypeEnum.ATTRIBUTE_TYPE:
        workbook = await this.exportAttributeType(request);
        break;
      case TypeEnum.MAINTENANCE_ATTRIBUTE:
        workbook = await this.exportMaintenanceAttributes(request);
        break;
      case TypeEnum.SUPPLY_GROUP:
        workbook = await this.exportSupplyGroup(request);
        break;
      case TypeEnum.SUPPLY:
        workbook = await this.exportSupply(request);
        break;
      case TypeEnum.DEVICE:
        workbook = await this.exportDevice(request);
        break;
      case TypeEnum.UNIT:
        workbook = await this.exportUnit(request);
        break;
      case TypeEnum.MAINTENANCE_TEAM:
        workbook = await this.exportMaintenanceTeam(request);
        break;
      case TypeEnum.INTER_REGION:
        workbook = await this.exportInterRegion(request);
        break;
      case TypeEnum.REGION:
        workbook = await this.exportRegion(request);
        break;
      case TypeEnum.DEVICE_REQUEST:
        workbook = await this.exportDeviceRequest(request);
        break;
      case TypeEnum.AREA:
        workbook = await this.exportArea(request);
        break;
      case TypeEnum.ERROR_TYPE:
        workbook = await this.exportErrorType(request);
      case TypeEnum.VENDOR:
        workbook = await this.exportVendor(request);
        break;
      default:
        break;
    }
    if (workbook?.xlsx) {
      // await workbook.xlsx.writeFile('excel.xlsx');
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

  async exportDeviceGroup(payload: ExportRequestDto) {
    let users: any;
    let maintenanceTeams: any[] = [];
    let deviceGroups: any[] = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListDeviceGroupRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.deviceGroupRepository.getList(request);
      if (!isEmpty(result)) {
        deviceGroups = deviceGroups.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!deviceGroups || isEmpty(deviceGroups)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const userIds = compact(uniq(map(deviceGroups, 'responsibleUserIds')));
    if (!isEmpty(userIds)) {
      users = await this.userService.getListByIDs(userIds);
    }
    const userMap = keyBy(users, 'id');

    const maintenanceTeamIds = compact(
      uniq(map(deviceGroups, 'responsibleMaintenanceTeam')),
    );
    if (!isEmpty(maintenanceTeamIds)) {
      maintenanceTeams =
        await this.maintenanceTeamRepository.findAllByCondition({
          _id: {
            $in: maintenanceTeamIds,
          },
        });
    }
    const companyMap = keyBy(maintenanceTeams, '_id');

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceGroup.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceGroup.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceGroup.description'),
      },
      {
        key: 'assign',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceGroup.assign'),
      },
    ];

    const items: any[] = deviceGroups?.map((deviceGroup) => {
      const item: any = {
        code: deviceGroup.code ?? '',
        name: deviceGroup.name ?? '',
        description: deviceGroup.description ?? '',
        assign:
          userMap[deviceGroup.responsibleUserIds]?.fullName ??
          companyMap[deviceGroup.responsibleMaintenanceTeam]?.name ??
          '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.deviceGroup.title')],
      headers,
    );
    return workbook;
  }

  async exportDefects(payload: ExportRequestDto) {
    let defects: GetListDefectResponseDto[] = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListDefectRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.defectRepository.getList(request);
      if (!isEmpty(result)) {
        defects = defects.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!defects || isEmpty(defects)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.defects.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.defects.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.defects.description'),
      },
      {
        key: 'deviceCode',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.defects.deviceCode'),
      },
      {
        key: 'priority',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.defects.priority'),
      },
    ];

    const items = defects?.map((defect) => {
      const item = {
        code: defect.code ?? '',
        name: defect.name ?? '',
        description: defect.description ?? '',
        deviceCode: defect?.device?.code ?? '',
        priority: DefectPriorityExport[defect.priority] ?? '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.defects.title')],
      headers,
    );
    return workbook;
  }

  async exportTemplateChecklist(payload: ExportRequestDto) {
    let templateChecklist = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListCheckListTemplateRequestDto();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.checkListTemplateRepository.getList(
        request,
      );
      if (!isEmpty(result)) {
        templateChecklist = templateChecklist.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!templateChecklist || isEmpty(templateChecklist)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.checklistTemplate.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.checklistTemplate.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.checklistTemplate.description',
        ),
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
      {
        key: 'updatedAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.updatedAt'),
      },
    ];

    const items = templateChecklist.map((templateChecklist) => ({
      code: templateChecklist?.code,
      name: templateChecklist?.name,
      description: templateChecklist?.description,
      createdAt: templateChecklist?.createdAt,
      updatedAt: templateChecklist?.updatedAt,
    }));

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.checklistTemplate.title')],
      headers,
    );
    return workbook;
  }

  async exportInstallationTemplate(payload: ExportRequestDto) {
    let installationTemplate = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListInstallationTemplateQuery();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.installationTemplateRepository.list(request);
      if (!isEmpty(data)) {
        installationTemplate = installationTemplate.concat(data);
      }

      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!installationTemplate || isEmpty(installationTemplate)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.installationTemplate.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.installationTemplate.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.installationTemplate.description',
        ),
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
      {
        key: 'updatedAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.updatedAt'),
      },
    ];

    const items = installationTemplate.map((item) => ({
      code: item?.code,
      name: item?.name,
      description: item?.description,
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt,
    }));

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.installationTemplate.title')],
      headers,
    );
    return workbook;
  }

  async exportAttributeType(payload: ExportRequestDto) {
    let units = [];
    let attributeTypes: AttributeType[] = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListAttributeTypeQuery();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.attributeTypeRepository.list(request);
      if (!isEmpty(data)) {
        attributeTypes = attributeTypes.concat(data);
      }
      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    const unitIds = compact(uniq(map(attributeTypes, 'unit')));

    units = await this.unitRepository.findAllByCondition({
      _id: {
        $in: unitIds,
      },
    });
    const unitMap = keyBy(units, '_id');

    if (!attributeTypes || isEmpty(attributeTypes)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.attributeType.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.attributeType.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.attributeType.description'),
      },
      {
        key: 'unit',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.attributeType.unit'),
      },
    ];

    const items = attributeTypes?.map((attributeType) => {
      const item = {
        code: attributeType.code ?? '',
        name: attributeType.name ?? '',
        description: attributeType.description ?? '',
        unit: unitMap[attributeType.unit]?.name ?? '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.attributeType.title')],
      headers,
    );
    return workbook;
  }

  async exportMaintenanceAttributes(payload: ExportRequestDto) {
    let maintenanceAttributes: CreateMaintenanceAttributeResponseDto[] = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListMaintenanceAttributeRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.maintenanceAttributeRepository.getList(
        request,
      );
      if (!isEmpty(result)) {
        maintenanceAttributes = maintenanceAttributes.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!maintenanceAttributes || isEmpty(maintenanceAttributes)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 20,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.maintenanceAttribute.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.maintenanceAttribute.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.maintenanceAttribute.description',
        ),
      },
    ];

    const items = maintenanceAttributes?.map((maintenanceAttribute) => {
      const item = {
        code: maintenanceAttribute.code ?? '',
        name: maintenanceAttribute.name ?? '',
        description: maintenanceAttribute.description ?? '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.maintenanceAttribute.title')],
      headers,
    );
    return workbook;
  }

  async exportSupplyGroup(payload: ExportRequestDto) {
    let supplyGroups = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListSupplyGroupRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.supplyGroupRepository.getList(request);
      if (!isEmpty(result)) {
        supplyGroups = supplyGroups.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!supplyGroups || isEmpty(supplyGroups)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const textYes = await this.i18n.translate('export.common.yes');
    const textNo = await this.i18n.translate('export.common.no');

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supplyGroup.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supplyGroup.name'),
      },
      {
        key: 'active',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supplyGroup.active'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supplyGroup.description'),
      },
    ];

    const items = supplyGroups?.map((supplyGroup) => {
      const item = {
        code: supplyGroup.code ?? '',
        name: supplyGroup.name ?? '',
        active: supplyGroup.active ? textYes : textNo,
        description: supplyGroup.description ?? '',
      };
      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.supplyGroup.title')],
      headers,
    );
    return workbook;
  }

  async exportSupply(payload: ExportRequestDto) {
    let users: UserResponseDto[] = [];
    let maintenanceTeams: MaintenanceTeam[] = [];
    let itemUnits = [];
    let supplies: GetListSupplyResponseDto[] = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListSupplyRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.supplyRepository.getList(request);
      if (!isEmpty(result)) {
        supplies = supplies.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!supplies || isEmpty(supplies)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const userIds = compact(uniq(map(supplies, 'responsibleUserIds')));

    if (!isEmpty(userIds)) {
      users = await this.userService.getListByIDs(userIds);
    }
    const userMap = keyBy(users, 'id');

    const maintenanceTeamIds = compact(
      uniq(map(supplies, 'responsibleMaintenanceTeam')),
    );

    if (!isEmpty(maintenanceTeamIds)) {
      maintenanceTeams =
        await this.maintenanceTeamRepository.findAllByCondition({
          _id: {
            $in: maintenanceTeamIds,
          },
        });
    }
    const companyMap = keyBy(maintenanceTeams, '_id');

    const itemUnitIds = compact(uniq(map(supplies, 'itemUnitId')));
    if (!isEmpty(itemUnitIds)) {
      itemUnits = await this.unitRepository.findAllByCondition({
        _id: {
          $in: itemUnitIds,
        },
      });
    }

    const itemUnitMap = keyBy(itemUnits, '_id');

    const headers = [
      {},
      {
        key: 'code',
        width: 20,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.name'),
      },
      {
        key: 'supplyGroup',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.supplyGroup'),
      },
      {
        key: 'type',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.type'),
      },
      {
        key: 'unit',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.unit'),
      },
      {
        key: 'price',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.price'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.description'),
      },
      {
        key: 'assign',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.supply.assign'),
      },
    ];

    const items = await Promise.all(
      supplies?.map(async (supply) => {
        const item = {
          code: supply.code ?? '',
          name: supply.name ?? '',
          supplyGroup: supply?.supplyGroup?.name ?? '',
          type:
            (await this.i18n.translate(`export.supplyType.${supply.type}`)) ??
            '',
          unit: itemUnitMap[supply.itemUnitId]?.name ?? '',
          price: supply.price ?? '',
          description: supply.description ?? '',
          assign:
            userMap[supply.responsibleUserIds]?.username ??
            companyMap[supply.responsibleMaintenanceTeam]?.name ??
            '',
        };

        return item;
      }),
    );

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.supply.title')],
      headers,
    );
    return workbook;
  }

  async exportDevice(payload: ExportRequestDto) {
    let users: any;
    let vendors: any;
    let devices: any[] = [];
    const titleMap: any = new Map();
    const headersMap: any = new Map();

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListDevicesRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      request.keyword = payload.keyword;
      const list = await this.deviceRepository.getListExport(request);
      if (!isEmpty(list)) {
        devices = devices.concat(list);
      }
      if (list?.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }
    if (!devices || isEmpty(devices)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const userIds = compact(uniq(map(devices, 'responsibleUserId')));
    if (!isEmpty(userIds)) {
      users = await this.userService.getListByIDs(userIds);
    }
    const userMap = keyBy(users, 'id');

    const vendorIds = compact(
      devices.map((device) => device.information?.vendor),
    );
    if (!isEmpty(vendorIds)) {
      vendors = await this.saleService.getVendorsByIds(vendorIds);
    }
    const vendorMap = keyBy(vendors, 'id');

    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.name'),
      },
      {
        key: 'deviceGroup',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.groupName'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.device.information.description',
        ),
      },
      {
        key: 'price',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.price'),
      },
      {
        key: 'type',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.type'),
      },
      {
        key: 'frequency',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.frequency'),
      },
      {
        key: 'periodicInspectionTime',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.device.information.periodicInspectionTime',
        ),
      },
      {
        key: 'attributeType',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.device.information.attributeType',
        ),
      },
      {
        key: 'maintenancePeriod',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.device.information.maintenancePeriod',
        ),
      },
      {
        key: 'maintenanceAttribute',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.device.information.maintenanceAttribute',
        ),
      },
      {
        key: 'assign',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.information.assign'),
      },
    ];

    const subHeaderOne = [
      {
        key: 'code',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.detail.code'),
      },
      {
        key: 'vendor',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.detail.vendor'),
      },
      {
        key: 'importDate',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.detail.importDate'),
      },
      {
        key: 'warrantyPeriod',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.detail.warrantyPeriod'),
      },
      {
        key: 'productionDate',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.detail.productionDate'),
      },
      {
        key: 'model',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.detail.model'),
      },
    ];

    const subHeaderTwo = [
      {
        key: 'code',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.code'),
      },
      {
        key: 'supllyName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.supllyName'),
      },
      {
        key: 'supplyQuantity',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate(
          'export.device.accessory.supplyQuantity',
        ),
      },
      {
        key: 'canRepair',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.canRepair'),
      },
      {
        key: 'mtbfIndex',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.mtbfIndex'),
      },
      {
        key: 'mttrIndex',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.mttrIndex'),
      },
      {
        key: 'mttaIndex',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.mttaIndex'),
      },
      {
        key: 'mttfIndex',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.accessory.mttfIndex'),
      },
    ];

    const subHeaderThree = [
      {
        key: 'code',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.supply.code'),
      },
      {
        key: 'supllyName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.supply.supllyName'),
      },
      {
        key: 'supplyQuantity',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.supply.supplyQuantity'),
      },
      {
        key: 'useDate',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.device.supply.useDate'),
      },
    ];

    const textYes = await this.i18n.translate('export.common.yes');
    const textNo = await this.i18n.translate('export.common.no');

    const items = [];
    for (const device of devices) {
      const item = {
        code: device.code ?? '',
        name: device.name ?? '',
        deviceGroup: device.deviceGroup?.name ?? '',
        description: device.description ?? '',
        price: device.price ?? '',
        type: DeviceType.ForManufacture === device.type ? textYes : textNo,
        frequency: device.frequency ?? '',
        periodicInspectionTime: device.periodicInspectionTime ?? '',
        attributeType:
          device.attributeType
            ?.map((attributeType) => attributeType.name)
            .join(', ') ?? '',
        installTemplate: device.installTemplate?.name ?? '',
        maintenancePeriod: device.information?.maintenancePeriod ?? '',
        maintenanceAttribute:
          device.information?.maintenanceAttributeId?.name ?? '',
        assign:
          device.responsibleMaintenanceTeamId?.name ??
          userMap[device]?.responsibleUserId ??
          '',
        subItem: [],
        level: 1,
      };

      const subItem = {
        code: device.code ?? '',
        vendor: vendorMap[device.information?.vendor]?.name ?? '',
        importDate: device.information?.importDate ?? '',
        warrantyPeriod: device.information?.warrantyPeriod ?? '',
        brand: device.information?.brand ?? '',
        productionDate: device.information?.productionDate ?? '',
        model: device.model ?? '',
        subItem: [],
        subItemClone: [],
        level: 2,
      };

      for (const supply of device.information.supplies) {
        if (supply.supplyId.type === SupplyTypeConstant.ACCESSORY)
          subItem.subItem.push({
            code: device.code ?? '',
            supllyName: supply.supplyId?.name ?? '',
            supplyQuantity: supply.quantity,
            canRepair: supply.canRepair ? textYes : textNo,
            mtbfIndex: device.information.mtbfIndex,
            mttrIndex: device.information.mttrIndex,
            mttaIndex: device.information.mttaIndex,
            mttfIndex: device.information.mttfIndex,
            level: 3,
          });
        else
          subItem.subItemClone.push({
            code: device.code ?? '',
            supllyName: supply.supplyId?.name ?? '',
            supplyQuantity: supply.quantity,
            useDate: supply.useDate ?? '',
            level: 4,
          });
      }

      item.subItem.push(subItem);
      items.push(item);
    }

    titleMap.set(1, [
      await this.i18n.translate('export.device.information.title'),
    ]);
    titleMap.set(2, [await this.i18n.translate('export.device.detail.title')]);
    titleMap.set(3, [
      await this.i18n.translate('export.device.accessory.title'),
    ]);
    titleMap.set(4, [await this.i18n.translate('export.device.supply.title')]);
    headersMap.set(1, headers);
    headersMap.set(2, subHeaderOne);
    headersMap.set(3, subHeaderTwo);
    headersMap.set(4, subHeaderThree);

    let workbook = new Workbook();
    workbook = await this.exportMultiSheetUtil(
      workbook,
      items,
      1,
      titleMap,
      headersMap,
    );
    return workbook;
  }

  async exportMaintenanceTeam(payload: ExportRequestDto) {
    let maintenanceTeams = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListMaintenaceTeamRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { result } = await this.maintenanceTeamRepository.getList(request);
      if (!isEmpty(result)) {
        maintenanceTeams = maintenanceTeams.concat(result);
      }
      if (result.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.maintenanceTeam.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.maintenanceTeam.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.maintenanceTeam.description'),
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
      {
        key: 'updatedAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.updatedAt'),
      },
    ];
    // @TODO: waiting template export
    const items = maintenanceTeams.map((maintenanceTeam) => ({
      code: maintenanceTeam?.code,
      name: maintenanceTeam?.name,
      description: maintenanceTeam?.description,
      createdAt: maintenanceTeam?.createdAt,
      updatedAt: maintenanceTeam?.updatedAt,
    }));
    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.maintenanceTeam.title')],
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
        const getLevel = first(item.subItem)['level'] ?? level + 1;
        workbook = await this.exportMultiSheetUtil(
          workbook,
          item.subItem,
          getLevel,
          titleMap,
          headersMap,
        );
      }

      if (item.subItemClone?.length > 0) {
        const getLevel = first(item.subItemClone)['level'] ?? level + 2;
        workbook = await this.exportMultiSheetUtil(
          workbook,
          item.subItemClone,
          getLevel,
          titleMap,
          headersMap,
        );
      }
    }

    return workbook;
  }

  async exportUnit(payload: ExportRequestDto) {
    let units = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListUnitQuery();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.unitRepository.list(request);
      if (!isEmpty(data)) {
        units = units.concat(data);
      }

      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!units || isEmpty(units)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.unit.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.unit.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.unit.description'),
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
      {
        key: 'updatedAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.updatedAt'),
      },
    ];

    const items = units.map((item) => ({
      code: item?.code,
      name: item?.name,
      description: item?.description,
      updatedAt: item?.updatedAt,
      createdAt: item?.createdAt,
    }));

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.unit.title')],
      headers,
    );
    return workbook;
  }

  async exportInterRegion(payload: ExportRequestDto) {
    let interRegions = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListInterRegionQuery();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.interRegionRepository.list(request);
      if (!isEmpty(data)) {
        interRegions = interRegions.concat(data);
      }

      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!interRegions || isEmpty(interRegions)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.interRegion.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.interRegion.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.interRegion.description'),
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
      {
        key: 'updatedAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.updatedAt'),
      },
    ];

    const items = interRegions.map((item) => ({
      code: item?.code,
      name: item?.name,
      description: item?.description,
      updatedAt: item?.updatedAt,
      createdAt: item?.createdAt,
    }));

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.interRegion.title')],
      headers,
    );
    return workbook;
  }

  async exportRegion(payload: ExportRequestDto) {
    let regions = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListRegionQuery();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.regionRepository.list(request);
      if (!isEmpty(data)) {
        regions = regions.concat(data);
      }
      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!regions || isEmpty(regions)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.region.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.region.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.region.description'),
      },
      {
        key: 'interRegionName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.region.interRegionName'),
      },
    ];

    const items = regions?.map((region) => {
      const item = {
        code: region.code ?? '',
        name: region.name ?? '',
        description: region.description ?? '',
        interRegionName: region?.interRegion?.name ?? '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.region.title')],
      headers,
    );
    return workbook;
  }

  async exportDeviceRequest(payload: ExportRequestDto) {
    let deviceRequests = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListDefectRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.deviceRequestTicketRepository.getList(
        request as any,
      );
      if (!isEmpty(data)) {
        const factoryIds = map(data, 'factoryId');
        const factories = await this.userService.getFactoryList(factoryIds);
        const factorySerialize = keyBy(factories, 'id');
        deviceRequests = deviceRequests.concat(
          data.map((item) => ({
            ...item,
            factory: factorySerialize[item.factoryId]?.name,
          })),
        );
      }
      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!deviceRequests || isEmpty(deviceRequests)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.name'),
      },
      {
        key: 'type',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.type'),
      },
      {
        key: 'factory',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.factory'),
      },
      {
        key: 'deviceGroup',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.deviceGroup'),
      },
      {
        key: 'quantity',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.quantity'),
      },
      {
        key: 'status',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.deviceRequest.status'),
      },
    ];

    const items = deviceRequests?.map((deviceRequest) => ({
      code: deviceRequest.code ?? '',
      name: deviceRequest.name ?? '',
      description: deviceRequest.description ?? '',
      type: deviceRequest.type ?? '',
      factory: deviceRequest?.factory ?? '',
      deviceGroup: deviceRequest?.deviceGroup ?? '',
      quantity: deviceRequest?.quantity ?? '',
      status: deviceRequest?.status ?? '',
    }));
    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.region.title')],
      headers,
    );
    return workbook;
  }

  async exportArea(payload: ExportRequestDto) {
    let areas = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListAreaQuery();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.areaRepository.list(request);
      if (!isEmpty(data)) {
        areas = areas.concat(data);
      }
      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!areas || isEmpty(areas)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.area.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.area.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.area.description'),
      },
      {
        key: 'factoryName',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.area.factoryName'),
      },
    ];

    const items = areas?.map((area) => {
      const item = {
        code: area.code ?? '',
        name: area.name ?? '',
        description: area.description ?? '',
        factoryName: area?.factory?.name ?? '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.area.title')],
      headers,
    );
    return workbook;
  }

  async exportErrorType(payload: ExportRequestDto) {
    let errorTypes = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListErrorTypeQuery();
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id').join(',');
      }
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      const { data } = await this.errorTypeRepository.list(request);
      if (!isEmpty(data)) {
        errorTypes = errorTypes.concat(data);
      }

      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!errorTypes || isEmpty(errorTypes)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }
    const headers = [
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.errorType.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.errorType.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.errorType.description'),
      },
      {
        key: 'priority',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.errorType.priority'),
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
      {
        key: 'updatedAt',
        width: 25,
        style: {
          alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_RIGHT_MIDDLE,
          numFmt: EXCEL_STYLE.DDMMYYYYHHMMSS,
        },
        title: await this.i18n.translate('export.common.updatedAt'),
      },
    ];

    const items = errorTypes.map((item) => ({
      code: item?.code,
      name: item?.name,
      description: item?.description,
      priority: item?.priority,
      updatedAt: item?.updatedAt,
      createdAt: item?.createdAt,
    }));

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.errorType.title')],
      headers,
    );
    return workbook;
  }

  async exportVendor(payload: ExportRequestDto) {
    let vendors = [];

    for (let i = 1; i <= MAX_NUMBER_PAGE; i++) {
      const request = new GetListVendorRequestDto();
      request.page = i;
      request.limit = ROW.LIMIT_EXPORT_ON_SHEET;
      request.filter = payload.filter;
      request.sort = payload.sort;
      if (payload.queryIds) {
        request.queryIds = map(JSON.parse(payload.queryIds), 'id');
      }

      const { data } = await this.vendorRepository.list(request);
      if (!isEmpty(data)) {
        vendors = vendors.concat(data);
      }
      if (data.length < ROW.LIMIT_EXPORT_ON_SHEET) {
        break;
      }
    }

    if (!vendors || isEmpty(vendors)) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .build();
    }

    const headers = [
      {},
      {
        key: 'code',
        width: 15,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.code'),
      },
      {
        key: 'name',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.name'),
      },
      {
        key: 'description',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.description'),
      },
      {
        key: 'address',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.address'),
      },
      {
        key: 'phone',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.phone'),
      },
      {
        key: 'email',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.email'),
      },
      {
        key: 'bank',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.bank'),
      },
      {
        key: 'contactUser',
        width: 30,
        style: { alignment: <Partial<Alignment>>EXCEL_STYLE.ALIGN_LEFT_MIDDLE },
        title: await this.i18n.translate('export.vendor.contactUser'),
      },
    ];

    const items = vendors?.map((vendor) => {
      const item = {
        code: vendor.code ?? '',
        name: vendor.name ?? '',
        description: vendor.description ?? '',
        address: vendor.address ?? '',
        phone: vendor.phone ?? '',
        email: vendor.email ?? '',
        bank: vendor.bank ?? '',
        contactUser: vendor.contactUser ?? '',
      };

      return item;
    });

    let workbook = new Workbook();
    workbook = await this.exportOneSheetUtil(
      items,
      [await this.i18n.translate('export.vendor.title')],
      headers,
    );
    return workbook;
  }
}
