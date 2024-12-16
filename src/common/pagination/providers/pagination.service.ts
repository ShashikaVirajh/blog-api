import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Request } from 'express';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<PaginatedResponse<T>> {
    const data = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    // Generate new url
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);

    // Calculate page numbers
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page - 1;

    // Generate pagination links
    const generateUrl = (pageNumber: number): string =>
      `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${pageNumber}`;

    const paginatedResponse: PaginatedResponse<T> = {
      data: data,
      meta: {
        currentPage: paginationQuery.page,
        itemsPerPage: paginationQuery.limit,
        totalPages: totalPages,
        totalItems: totalItems,
      },
      links: {
        first: generateUrl(1),
        last: generateUrl(totalPages),
        current: generateUrl(paginationQuery.page),
        previous: generateUrl(previousPage),
        next: generateUrl(nextPage),
      },
    };

    return paginatedResponse;
  }
}
