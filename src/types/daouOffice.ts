export interface Profile {
  basic_info: BasicInfo;
  contact_info: ContactInfo;
  position_info: PositionInfo;
  summaries: Summaries;
}

export interface BasicInfo {
  company_id: number;
  company_name: string;
  email: string;
  id: number;
  name: string;
}

export interface ContactInfo {
  direct_tel: string;
  fax: string;
  mobile_no: string;
}

export interface PositionInfo {
  department: string;
  grade: string;
  position: string;
}

export interface Summaries {
  approval: number;
  approval2: number;
  asset: number;
  board: number;
  calendar: number;
  community: number;
  mail: number;
  report: number;
  survey: number;
}
