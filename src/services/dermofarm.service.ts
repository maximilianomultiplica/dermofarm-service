import { BadRequestException, Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class DermofarmService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl =
      this.configService.get<string>("DERMOFARM_API_URL") ||
      "http://localhost:8080/api";
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(`${this.baseUrl}${endpoint}`)
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch data from DERMOFARM: ${error.message}`
      );
    }
  }

  async getProducts() {
    return await this.makeRequest("/products");
  }

  async getOrders() {
    return await this.makeRequest("/orders");
  }

  async getCustomers() {
    return await this.makeRequest("/customers");
  }
}
