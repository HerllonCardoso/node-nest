import { Controller } from '@nestjs/common';

@Controller()
export class CustomerController {
  get() {
    return 'Obter os clientes';
  }

  post() {
    return 'Criar cliente';
  }

  put() {
    return 'Atualizar um cliente';
  }

  delete() {
    return 'Remover um cliente';
  }
}
