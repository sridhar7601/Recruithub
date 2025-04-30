// College-related types

export interface CollegeResponseDto {
  collegeId: string;
  name: string;
  city: string;
  isDeleted: boolean;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface PaginationMetaDto {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedCollegeResponseDto {
  items: CollegeResponseDto[];
  meta: PaginationMetaDto;
}
