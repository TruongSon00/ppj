import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Company } from '@entities/company/company.entity';
import { GetListCompanyRequestDto } from '@components/company/dto/request/get-list-company.request.dto';
import { CompanyRequestDto } from '@components/company/dto/request/company.request.dto';

export interface CompanyRepositoryInterface
  extends BaseInterfaceRepository<Company> {
  createEntity(companyDto: CompanyRequestDto): Company;
  updateEntity(updateEntity: Company, companyDto: CompanyRequestDto): Company;
  getDetail(id: number);
  getList(request: GetListCompanyRequestDto);
  getUserCompanies(userId: number);
  getCount(): Promise<any>;
}
