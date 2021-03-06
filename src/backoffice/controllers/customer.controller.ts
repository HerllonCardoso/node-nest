import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ValidatorInterceptor } from 'src/interceptors/validator.interceptor';
import { CreateCustomerContract } from '../contracts/customer/create-customer.contract';
import { CreateCustomerDTO } from '../dtos/create-customer-dto';
import { Result } from '../models/result.model';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';
import { AccountService } from '../services/account.service';
import { CustomerService } from '../services/customer.service';
import { Address } from '../models/address.model';
import { CreateAddressContract } from '../contracts/customer/create-address.contract';

@Controller('v1/customers')
export class CustomerController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
  ) {}
  @Get()
  get() {
    return new Result(null, true, [], null);
  }

  @Get(':document')
  getById(@Param('document') document: string) {
    return new Result(null, true, {}, null);
  }

  @Post()
  @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
  async post(@Body() model: CreateCustomerDTO) {
    let user;
    let customer;
    try {
      user = await this.accountService.create(
        new User(model.document, model.password, true),
      );
      customer = new Customer(
        model.name,
        model.document,
        model.email,
        null,
        null,
        null,
        null,
        user,
      );
      const res = await this.customerService.create(customer);
      return new Result('Cliente criado com sucesso!', true, res, null);
    } catch (error) {
      throw new HttpException(
        new Result(
          'Nao foi possivel realizar seu cadastro',
          false,
          null,
          error,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':document/addresses/billing')
  @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
  async addBillingAddress(@Param('document') document, @Body() model: Address) {
    try {
      await this.customerService.addBillingAddress(document, model);
      return new Result(null, true, model, null)
    } catch (error) {
      throw new HttpException(
        new Result(
          'N??o foi poss??vel adicionar seu endere??o',
          false,
          null,
          error,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':document/addresses/shipping')
  @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
  async addShippingAddress(
    @Param('document') document,
    @Body() model: Address,
  ) {
    try {
      await this.customerService.addShippingAddress(document, model);
      return new Result(null, true, model, null)
    } catch (error) {
      throw new HttpException(
        new Result(
          'N??o foi poss??vel adicionar seu endere??o',
          false,
          null,
          error,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':document')
  put(@Param('document') document, @Body() body) {
    return new Result('Cliente alterado com sucesso!', true, body, null);
  }

  @Delete(':document')
  delete(@Param('document') document) {
    return new Result('Cliente removido com sucesso', true, null, null);
  }
}
